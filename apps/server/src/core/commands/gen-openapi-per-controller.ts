/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Project, SyntaxKind, SourceFile } from "ts-morph";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

const START_GLOBS = [
  "src/features/**/controllers/**/*.controller.ts",
  "src/features/**/controllers/*.controller.ts",
  "src/features/**/controllers/**/*.ts",
  "src/features/**/controllers/*.ts",
  "src/core/**/controllers/**/*.controller.ts",
  "src/core/**/controllers/*.controller.ts",
  "src/core/**/controllers/**/*.ts",
  "src/core/**/controllers/*.ts",
];

const SWAGGER_ROOT = "src/swagger";
const SWAGGER_INDEX = path.join(SWAGGER_ROOT, "index.ts");
const REGISTRY_FILENAME = "registry";

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
function toPosix(p: string) {
  return p.replace(/\\/g, "/");
}
function splitSegmentsLower(p: string) {
  const posix = toPosix(path.normalize(p));
  return posix
    .split("/")
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

/* ---------- deterministic normalization (no Prettier) ---------- */

function normalizeContent(content: string): string {
  let s = content.replace(/\r\n/g, "\n");
  s = s
    .split("\n")
    .map((l) => l.replace(/\s+$/g, ""))
    .join("\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trimEnd() + "\n";
}

/* ---------- ESLint loader + in-memory fix helper ---------- */

function tryLoadProjectESLint(): any | undefined {
  try {
    const resolved = require.resolve("eslint", { paths: [process.cwd()] });
    return require(resolved);
  } catch {
    try {
      // fallback to runtime eslint if available
      return require("eslint");
    } catch {
      return undefined;
    }
  }
}

const eslintPkg = tryLoadProjectESLint();
let _eslintInstance: any | null = null;
function getEslintInstance() {
  if (!eslintPkg) return null;
  if (_eslintInstance) return _eslintInstance;
  try {
    const { ESLint } = eslintPkg;
    _eslintInstance = new ESLint({ cwd: process.cwd(), fix: true });
    return _eslintInstance;
  } catch {
    _eslintInstance = null;
    return null;
  }
}

async function applyEslintFixesToText(text: string, filePath: string): Promise<string> {
  const eslint = getEslintInstance();
  if (!eslint) return text;
  try {
    // lintText returns an array of lint results; output contains fixed text when fixes applied
    const results = await eslint.lintText(text, { filePath });
    if (results && results[0] && typeof results[0].output === "string") {
      return results[0].output;
    }
    return text;
  } catch {
    // on any eslint error, fall back to original text
    return text;
  }
}

/* ---------- write helper (async, eslint-before-write) ---------- */

async function writeIfChangedNormalized(filePath: string, content: string): Promise<boolean> {
  // first do deterministic normalization
  const normalizedNew = normalizeContent(content);

  // apply ESLint fixes in-memory (if available)
  const withEslint = await applyEslintFixesToText(normalizedNew, filePath);

  // normalize again after eslint fixes to ensure stable final form
  const finalNormalized = normalizeContent(withEslint);

  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, "utf8");
    const normalizedExisting = normalizeContent(existing);
    if (normalizedExisting === finalNormalized) return false;
  } else {
    ensureDir(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, finalNormalized, "utf8");
  return true;
}

/* ---------- deterministic builders (unchanged) ---------- */

function pascalDtoNameFromVar(varName: string) {
  if (!varName) return varName;
  const stripped = varName.endsWith("Schema") ? varName.slice(0, -"Schema".length) : varName;
  const pascal = stripped.replace(/(^\w|[_\-\s]+\w)/g, (m) =>
    m.replace(/[_\-\s]/g, "").toUpperCase(),
  );
  return `${pascal}Dto`;
}

function buildGroupedImports(modMap: Map<string, Set<string>>) {
  const modules = Array.from(modMap.keys()).sort((a, b) => (a || "").localeCompare(b || ""));
  const blocks: string[] = [];
  for (const mod of modules) {
    const idents = Array.from(modMap.get(mod) ?? []).sort((a, b) => a.localeCompare(b));
    if (!mod || mod.trim() === "") {
      for (const id of idents) blocks.push(`// TODO: add import for ${id}`);
      continue;
    }
    if (idents.length === 1) {
      blocks.push(`import { ${idents[0]} } from "${mod}";`);
    } else {
      if (idents.length <= 3) {
        blocks.push(`import { ${idents.join(", ")} } from "${mod}";`);
      } else {
        const singleLine = `import { ${idents.join(", ")} } from "${mod}";`;
        if (singleLine.length <= 80) blocks.push(singleLine);
        else blocks.push(`import {\n  ${idents.join(",\n  ")},\n} from "${mod}";`);
      }
    }
  }
  return blocks.join("\n");
}

function buildRegisterMultiple(map: Map<string, string>) {
  if (!map || map.size === 0) return "";
  const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const lines = entries.map(([comp, varName]) => `  ${comp}: ${varName},`);
  return `// Register DTOs
registerMultiple(registry, {
${lines.join("\n")}
});
`;
}

/* ---------- helpers for override parsing and code serialization ---------- */

/**
 * Try to extract a JSON object from JSDoc/leading comments above method.
 * Recognizes:
 *  - JSDoc comment body that contains a JSON object with "@openapi" prefix or plain JSON
 *  - Block comment /* openapi ... *\/ containing JSON
 *
 * Returns parsed object or undefined.
 */
function parseOverrideFromMethod(method: any, sf: SourceFile): any | undefined {
  // 1) try JSDoc comments with @openapi on the method node itself
  try {
    const jsDocs = typeof method.getJsDocs === "function" ? method.getJsDocs() : [];
    for (const jd of jsDocs) {
      try {
        const c = typeof jd.getComment === "function" ? jd.getComment() : undefined;
        if (!c) continue;
        const txt = String(c).trim();
        const json = extractJsonFromText(txt);
        if (json) return json;
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  // 1b) try JSDoc on decorators (important: comment can be placed between decorators)
  try {
    const decs = typeof method.getDecorators === "function" ? method.getDecorators() : [];
    for (const d of decs || []) {
      try {
        const decJs = typeof d.getJsDocs === "function" ? d.getJsDocs() : [];
        for (const jd of decJs || []) {
          const c = typeof jd.getComment === "function" ? jd.getComment() : undefined;
          if (!c) continue;
          const txt = String(c).trim();
          const json = extractJsonFromText(txt);
          if (json) return json;
        }
      } catch {
        // ignore
      }

      // also try to extract inline block comment attached to decorator text
      try {
        const full = typeof d.getFullText === "function" ? d.getFullText() : "";
        const json = extractJsonFromText(String(full));
        if (json) return json;
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  // 2) try block comment immediately preceding the method (search in source text)
  try {
    const sfText = sf.getFullText();
    const start = typeof method.getStart === "function" ? method.getStart() : -1;
    if (start > 0) {
      // look back up to 4000 chars (in case of large comment)
      const lookBack = 4000;
      const from = Math.max(0, start - lookBack);
      const chunk = sfText.slice(from, start);

      // --- prefer /* openapi ... */ style, but ensure it's adjacent (only decorators/whitespace allowed after it)
      {
        const openapiRegex = /\/\*\s*openapi\s*([\s\S]*?)\*\//gi;
        let lastMatch: RegExpExecArray | null = null;
        let m: RegExpExecArray | null;
        while ((m = openapiRegex.exec(chunk)) !== null) lastMatch = m;
        if (lastMatch) {
          const matchEnd = lastMatch.index + lastMatch[0].length;
          const after = chunk.slice(matchEnd);
          // allow only whitespace and decorator lines between the comment and the method start
          // decorator lines look like: @DecorName(...) or @DecorName
          if (/^\s*(?:@\w+(?:\([^)]*\))?\s*)*$/.test(after)) {
            const json = extractJsonFromText(lastMatch[1]!);
            if (json) return json;
          }
        }
      }

      // --- fallback: last /* { ... } */ block immediately before method (same adjacency rule)
      {
        const genericRegex = /\/\*([\s\S]*?\{[\s\S]*\}[\s\S]*?)\*\//g;
        let lastMatch: RegExpExecArray | null = null;
        let gm: RegExpExecArray | null;
        while ((gm = genericRegex.exec(chunk)) !== null) lastMatch = gm;
        if (lastMatch) {
          const matchEnd = lastMatch.index + lastMatch[0].length;
          const after = chunk.slice(matchEnd);
          if (/^\s*(?:@\w+(?:\([^)]*\))?\s*)*$/.test(after)) {
            const json = extractJsonFromText(lastMatch[1]!);
            if (json) return json;
          }
        }
      }

      // --- also try JSDoc style @openapi tag lines, but ensure adjacency
      {
        const jsOpenapiRegex = /\/\*\*([\s\S]*?)\*\//g;
        let lastMatch: RegExpExecArray | null = null;
        let jm: RegExpExecArray | null;
        while ((jm = jsOpenapiRegex.exec(chunk)) !== null) lastMatch = jm;
        if (lastMatch) {
          const txt = lastMatch[1]!.replace(/^\s*\*\s?/gm, "");
          const idx = txt.indexOf("@openapi");
          if (idx !== -1) {
            const after = txt.slice(idx + "@openapi".length);
            const matchEnd = lastMatch.index + lastMatch[0].length;
            const trailing = chunk.slice(matchEnd);
            if (/^\s*(?:@\w+(?:\([^)]*\))?\s*)*$/.test(trailing)) {
              const json = extractJsonFromText(after);
              if (json) return json;
            }
          }
        }
      }
    }
  } catch {
    // ignore
  }
}

/** try to extract a JSON object inside arbitrary text; returns parsed object or undefined */
function extractJsonFromText(txt: string): any | undefined {
  const s = String(txt);
  // Find the first { and last } to attempt parse
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return undefined;
  let candidate = s.slice(first, last + 1);
  // Remove leading * from JSDoc lines
  candidate = candidate
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, ""))
    .join("\n");
  try {
    return JSON.parse(candidate);
  } catch {
    // try to be lenient: remove trailing commas
    const cleaned = candidate.replace(/,\s*([}\]])/g, "$1");
    try {
      return JSON.parse(cleaned);
    } catch {
      return undefined;
    }
  }
}

/** helper to flatten moduleToIdents map into a set of known identifiers */
function knownIdentsFromMap(moduleToIdents: Map<string, Set<string>>): Set<string> {
  const out = new Set<string>();
  for (const s of moduleToIdents.values()) {
    for (const x of s) out.add(x);
  }
  return out;
}

/**
 * Serialize a JS value to TypeScript source code.
 * If a string exactly matches a known identifier, it will be emitted without quotes.
 * Objects and arrays are pretty-printed.
 */
function valueToTsCode(value: any, knownIdents: Set<string>, indent = ""): string {
  const nextIndent = indent + "  ";
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => valueToTsCode(v, knownIdents, nextIndent));
    return `[\n${nextIndent}${items.join(`,\n${nextIndent}`)}\n${indent}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const lines = entries.map(([k, v]) => {
      // allow numeric keys (200) and bare identifiers as keys
      const keyBare = /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(k) || /^\d+$/.test(k);
      const keyCode = keyBare ? k : JSON.stringify(k);
      return `${nextIndent}${keyCode}: ${valueToTsCode(v, knownIdents, nextIndent)}`;
    });
    return `{\n${lines.join(",\n")}\n${indent}}`;
  }
  if (typeof value === "string") {
    // emit as identifier if it matches known ident pattern and is present in knownIdents
    if (knownIdents.has(value) && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(value)) {
      return value;
    }
    return JSON.stringify(value);
  }
  // number or boolean
  return String(value);
}

/* ---------- Request builder (normalized to zod-to-openapi request shape) ---------- */

/**
 * Normalize an override object to ensure we do not emit unsupported `request` properties.
 * - If override.requestBody exists (top-level), we move it into override.request.body.
 * - If override.request has requestBody, we rename it to body.
 * - We only allow request keys: body, params, query, cookies, headers. Any other keys are left at path level (not under request).
 *
 * This function returns a shallow-cloned normalized override (does not mutate input).
 */
function normalizeOverrideForRequest(override: any | undefined): any | undefined {
  if (!override) return undefined;
  // shallow copy
  const out: any = { ...override };

  // if top-level requestBody present, move it into request.body
  if (out.requestBody) {
    out.request = out.request || {};
    out.request.body = out.request.body ?? out.requestBody;
    delete out.requestBody;
  }

  // if override.request exists and contains requestBody, rename to body
  if (out.request && typeof out.request === "object") {
    if (out.request.requestBody) {
      out.request.body = out.request.body ?? out.request.requestBody;
      delete out.request.requestBody;
    }
    // keep only allowed request keys, copy them
    const allowed = ["body", "params", "query", "cookies", "headers"];
    const reqCopy: any = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(out.request, k)) reqCopy[k] = out.request[k];
    }
    out.request = reqCopy;
  }

  return out;
}

/* ---------- deep merge helper ---------- */

/**
 * Deeply merges source onto target returning a new object.
 * - Objects are merged recursively.
 * - Arrays are replaced by source arrays (not concatenated).
 * - Primitive values from source overwrite target.
 */
function deepMerge(target: any, source: any): any {
  if (source === undefined) return target;
  if (target === undefined || target === null) {
    // return a deep clone of source
    if (Array.isArray(source)) return source.slice();
    if (typeof source === "object") return JSON.parse(JSON.stringify(source));
    return source;
  }
  if (Array.isArray(source) || Array.isArray(target)) {
    // prefer source arrays (replace)
    return Array.isArray(source) ? source.slice() : source;
  }
  if (typeof target === "object" && typeof source === "object") {
    const out: any = {};
    const keys = new Set<string>([...Object.keys(target), ...Object.keys(source)]);
    for (const k of keys) {
      if (Object.prototype.hasOwnProperty.call(source, k)) {
        out[k] = deepMerge(target[k], source[k]);
      } else {
        out[k] = deepMerge(target[k], undefined);
      }
    }
    return out;
  }
  // primitives: source overrides
  return source;
}

/**
 * Build the 'request' section as TypeScript code for registry.registerPath,
 * using the normalized override. It will produce a `request: { body:..., params:..., query:..., cookies:..., headers:... }`
 * shape which matches zod-to-openapi expectations.
 */
function buildRequestSectionAsCode(
  parts: {
    bodyComp?: string;
    paramsVar?: string;
    queryVar?: string;
    cookiesVar?: string;
    headersVar?: string;
    multipartFiles?: Array<{ name: string; multiple?: boolean }>;
  },
  overrideRaw: any | undefined,
  knownIdents: Set<string>,
) {
  const override = normalizeOverrideForRequest(overrideRaw);
  const lines: string[] = [];

  // Build the generated request object from detected parts
  const genReq: any = {};

  const hasBody = !!parts.bodyComp || (parts.multipartFiles && parts.multipartFiles.length > 0);
  if (hasBody) {
    if (parts.multipartFiles && parts.multipartFiles.length > 0) {
      const schemaObj = buildMultipartSchemaObject(parts.bodyComp, parts.multipartFiles);
      genReq.body = {
        description: `${parts.bodyComp ?? "multipart form data"}`,
        required: true,
        content: {
          "multipart/form-data": { schema: schemaObj },
        },
      };
    } else if (parts.bodyComp) {
      genReq.body = {
        description: `${parts.bodyComp} request body`,
        required: true,
        content: {
          "application/json": { schema: { $ref: `#/components/schemas/${parts.bodyComp}` } },
        },
      };
    }
  }

  if (parts.paramsVar) genReq.params = parts.paramsVar;
  if (parts.queryVar) genReq.query = parts.queryVar;
  if (parts.cookiesVar) genReq.cookies = parts.cookiesVar;
  if (parts.headersVar) genReq.headers = parts.headersVar;

  // If override.request exists, deep-merge it into generated request. This enables partial updates:
  // e.g. override.request.body = { description: "..." } will only update description and keep content/schema.
  let finalReq = genReq;
  if (
    override &&
    typeof override.request === "object" &&
    Object.keys(override.request).length > 0
  ) {
    finalReq = deepMerge(genReq, override.request);
  }

  // Only emit if finalReq has something meaningful
  if (finalReq && Object.keys(finalReq).length > 0) {
    const code = valueToTsCode(finalReq, knownIdents, "");
    if (code !== "{}") lines.push(`  request: ${code},`);
  }

  return lines.join("\n");
}

/** helper to build a JS object representing multipart schema */
function buildMultipartSchemaObject(
  bodyComp?: string,
  multipartFiles?: Array<{ name: string; multiple?: boolean }>,
) {
  const props: any = {};
  for (const mf of multipartFiles || []) {
    if (mf.multiple)
      props[mf.name] = { type: "array", items: { type: "string", format: "binary" } };
    else props[mf.name] = { type: "string", format: "binary" };
  }
  if (bodyComp) props["data"] = { $ref: `#/components/schemas/${bodyComp}` };
  return { type: "object", properties: props };
}

/* ---------- helper: map component $ref -> shared-schemas variable name ---------- */
function componentNameToSchemaVar(componentName: string): string {
  // remove any path prefix if present
  const last = componentName.split("/").pop() ?? componentName;
  // strip '#/components/schemas/' if present
  const base = last.replace(/^#\/components\/schemas\//, "");
  // remove trailing Dto if present
  const noDto = base.endsWith("Dto") ? base.slice(0, -3) : base;
  // lower-first and append Schema
  return noDto.charAt(0).toLowerCase() + noDto.slice(1) + "Schema";
}

/* ---------- helper: recursively collect all $ref strings in an object ---------- */
function collectRefsInObject(obj: any, out: Set<string>) {
  if (!obj || typeof obj !== "object") return;
  for (const [k, v] of Object.entries(obj)) {
    if (k === "$ref" && typeof v === "string") {
      // extract component name last segment
      const comp = v.split("/").pop() ?? v;
      out.add(comp);
    } else if (typeof v === "object") {
      collectRefsInObject(v, out);
    }
  }
}

/* ---------- buildRegisterPath: updated to produce richer responses and accept finalPath + overrides ---------- */

function buildRegisterPathAsCode(
  method: string,
  finalPath: string,
  tag: string,
  parts: {
    bodyComp?: string;
    paramsVar?: string;
    queryVar?: string;
    cookiesVar?: string;
    headersVar?: string;
    hasPathParams?: boolean;
    needsAuth?: boolean;
    multipartFiles?: Array<{ name: string; multiple?: boolean }>;
  },
  overrideRaw: any | undefined,
  knownIdents: Set<string>,
) {
  const override = normalizeOverrideForRequest(overrideRaw);
  const lines: string[] = [];
  lines.push(`registry.registerPath({`);
  lines.push(`  method: "${method}",`);
  lines.push(`  path: "${finalPath}",`);
  lines.push(`  tags: ["${tag}"],`);

  // include optional basic fields from override if present
  const optionalSimpleFields = [
    "summary",
    "description",
    "deprecated",
    "operationId",
    "externalDocs",
    "callbacks",
    "servers",
    "security",
  ];
  for (const f of optionalSimpleFields) {
    if (override && Object.prototype.hasOwnProperty.call(override, f)) {
      const code = valueToTsCode(override[f], knownIdents, "");
      lines.push(`  ${f}: ${code},`);
    }
  }

  // If override provides top-level parameters array (OpenAPI), include it (only once)
  if (override && Array.isArray(override.parameters)) {
    const pCode = valueToTsCode(override.parameters, knownIdents, "");
    lines.push(`  parameters: ${pCode},`);
  } else {
    // if we have a paramsVar (zod schema identifier) and it is known, include it in request (not as top-level parameters)
    // top-level `parameters` is for OpenAPI parameter objects, while zod-to-openapi expects request.params = z.object(...)
  }

  // request section — either override or generated (with merging)
  const requestSection = buildRequestSectionAsCode(
    {
      bodyComp: parts.bodyComp,
      paramsVar: parts.paramsVar,
      queryVar: parts.queryVar,
      cookiesVar: parts.cookiesVar,
      headersVar: parts.headersVar,
      multipartFiles: parts.multipartFiles ?? [],
    },
    override,
    knownIdents,
  );
  if (requestSection && requestSection.trim() !== "") {
    lines.push(requestSection);
  }

  // responses: prefer override.responses merged with defaults if present; otherwise minimal defaults
  const defaultResponses: any = {
    200: { description: "Successful response" },
    400: { description: "Bad request" },
    500: { description: "Internal Server Error" },
  };
  if (parts.bodyComp) {
    // keep 400 as default when body exists (already set)
  }
  if (parts.needsAuth) defaultResponses[401] = { description: "Unauthorized" };
  if (parts.hasPathParams) defaultResponses[404] = { description: "Not Found" };

  if (override && override.responses) {
    const merged = deepMerge(defaultResponses, override.responses);
    const rCode = valueToTsCode(merged, knownIdents, "  ");
    lines.push(`  responses: ${rCode},`);
  } else {
    const rCode = valueToTsCode(defaultResponses, knownIdents, "  ");
    lines.push(`  responses: ${rCode},`);
  }

  lines.push(`});`);
  return lines.join("\n");
}

/* ---------- path helpers (unchanged) ---------- */

function outputDirForController(controllerPath: string) {
  const posix = toPosix(path.normalize(controllerPath));
  const parts = posix.split("/").filter(Boolean);
  const partsLower = parts.map((p) => p.toLowerCase());
  const idxFeatures = partsLower.lastIndexOf("features");
  const idxCore = partsLower.lastIndexOf("core");
  const idx = Math.max(idxFeatures, idxCore);
  if (idx === -1) return SWAGGER_ROOT;
  const rel = parts.slice(idx + 1);
  const controllersIndex = rel.map((r) => r.toLowerCase()).lastIndexOf("controllers");
  const dirParts =
    controllersIndex >= 0 ? rel.slice(0, controllersIndex) : rel.slice(0, rel.length - 1);
  return path.join(SWAGGER_ROOT, ...dirParts);
}

function outFileName(controllerFilePath: string, usedNames: Set<string>) {
  const base = path.basename(controllerFilePath).replace(/\.controller\.ts$/i, "");
  if (!usedNames.has(`${base}.openapi.ts`)) {
    usedNames.add(`${base}.openapi.ts`);
    return `${base}.openapi.ts`;
  }
  let i = 1;
  while (usedNames.has(`${base}-${i}.openapi.ts`)) i++;
  const name = `${base}-${i}.openapi.ts`;
  usedNames.add(name);
  return name;
}

function registryImportRelPath(outDir: string) {
  let rel = path.relative(outDir, path.join(SWAGGER_ROOT, REGISTRY_FILENAME));
  rel = toPosix(rel);
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel;
}

/* ---------- import resolution (unchanged) ---------- */

function resolveImportForIdent(
  sf: SourceFile,
  identText: string,
): { module: string; ident: string } {
  if (!identText) return { module: "", ident: identText };
  const dotIndex = identText.indexOf(".");
  if (dotIndex !== -1) {
    const ns = identText.slice(0, dotIndex);
    const last = identText.slice(dotIndex + 1);
    const decl = sf.getImportDeclarations().find((d) => {
      const nsImp = d.getNamespaceImport();
      if (!nsImp) return false;
      const nsName =
        (nsImp as any) && typeof (nsImp as any).getName === "function"
          ? (nsImp as any).getName()
          : (nsImp as any) && typeof (nsImp as any).getText === "function"
            ? (nsImp as any).getText()
            : undefined;
      return nsName === ns;
    });
    if (decl) return { module: decl.getModuleSpecifierValue() ?? "", ident: last };
  }

  for (const d of sf.getImportDeclarations()) {
    const named = d.getNamedImports();
    for (const ni of named) {
      let originalName = "";
      try {
        const nameNode: any = (ni as any).getNameNode ? (ni as any).getNameNode() : undefined;
        if (nameNode && typeof nameNode.getText === "function") originalName = nameNode.getText();
        else if ((ni as any).getName && typeof (ni as any).getName === "function")
          originalName = (ni as any).getName();
        else originalName = ni.getText();
      } catch {
        originalName = ni.getText();
      }

      let localName = originalName;
      try {
        const aliasNode: any = (ni as any).getAliasNode ? (ni as any).getAliasNode() : undefined;
        if (aliasNode && typeof aliasNode.getText === "function") localName = aliasNode.getText();
      } catch {
        // ignore
      }

      if (localName === identText || originalName === identText) {
        return { module: d.getModuleSpecifierValue() ?? "", ident: originalName };
      }
    }
  }

  for (const d of sf.getImportDeclarations()) {
    const nsImp = d.getNamespaceImport();
    if (!nsImp) continue;
    const nsName =
      (nsImp as any) && typeof (nsImp as any).getName === "function"
        ? (nsImp as any).getName()
        : (nsImp as any) && typeof (nsImp as any).getText === "function"
          ? (nsImp as any).getText()
          : "";
    if (nsName && identText.startsWith(nsName + ".")) {
      const last = identText.split(".").pop() ?? identText;
      return { module: d.getModuleSpecifierValue() ?? "", ident: last };
    }
  }

  return { module: "", ident: identText };
}

/* ---------- utilities for interactive deletion (updated to preserve three files) ---------- */

/**
 * Returns true if the directory (or its subdirectories) contains any files.
 */
function directoryHasFiles(dir: string): boolean {
  if (!fs.existsSync(dir)) return false;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isFile()) return true;
    if (e.isDirectory() && directoryHasFiles(full)) return true;
  }
  return false;
}

/**
 * Prompt the user for a yes/no question. Resolves true for yes, false for no.
 */
function askYesNo(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      const a = (answer || "").trim().toLowerCase();
      if (a === "y" || a === "yes") resolve(true);
      else resolve(false);
    });
  });
}

/**
 * Delete everything inside `dir` except files at the top-level whose basenames are in allowedBasenames.
 * - If an entry is a file and its basename is included in allowedBasenames, it will be kept.
 * - All other files and directories (and their contents) will be removed.
 */
function deleteContentsExcept(dir: string, allowedBasenames: Set<string>) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isFile()) {
      if (allowedBasenames.has(e.name)) {
        // keep it
        continue;
      } else {
        try {
          fs.rmSync(full, { force: true });
        } catch {
          // ignore removal errors
        }
      }
    } else if (e.isDirectory()) {
      // remove directories entirely
      try {
        fs.rmSync(full, { recursive: true, force: true });
      } catch {
        // ignore removal errors
      }
    } else {
      // other types: try to remove
      try {
        fs.rmSync(full, { recursive: true, force: true });
      } catch {
        // ignore
      }
    }
  }
}

/* ---------- helper: run ESLint CLI fix on generated files to ensure identical formatting ---------- */

function runEslintCliFixOnSwagger() {
  try {
    const { spawnSync } = require("child_process");
    const localBin = path.join(process.cwd(), "node_modules", ".bin", "eslint");
    const pattern = `${SWAGGER_ROOT}/**/*.ts`;

    // prefer local eslint binary if present
    if (fs.existsSync(localBin)) {
      console.log("Running local eslint --fix on generated swagger files...");
      const res = spawnSync(localBin, ["--fix", "--ext", ".ts", pattern], {
        stdio: "inherit",
        shell: true,
      });
      if (res.status === 0) {
        console.log("ESLint fixed generated swagger files (local).");
      } else {
        console.warn("Local ESLint exited with code", res.status);
      }
      return;
    }

    // fallback to npx eslint
    console.log("Running `npx eslint --fix` on generated swagger files (fallback)...");
    const res = spawnSync("npx", ["eslint", "--fix", "--ext", ".ts", pattern], {
      stdio: "inherit",
      shell: true,
    });
    if (res.status === 0) {
      console.log("ESLint fixed generated swagger files (npx).");
    } else {
      console.warn("`npx eslint` exited with code", res.status);
    }
  } catch (err) {
    console.warn("Could not run ESLint CLI to fix generated files:", err);
  }
}

/* ---------- main (uses async write helper) ---------- */

async function main() {
  // If swagger root exists and has files, ask user whether to delete previous generated files
  let didDelete = false;
  if (directoryHasFiles(SWAGGER_ROOT)) {
    const wantsDelete = await askYesNo(
      `Do you want to delete previous generated files under ${SWAGGER_ROOT}? (y/n) `,
    );
    if (wantsDelete) {
      try {
        // delete everything except generator.ts, index.ts, registry.ts at top-level of SWAGGER_ROOT
        const allowed = new Set(["generator.ts", "index.ts", "registry.ts"]);
        deleteContentsExcept(SWAGGER_ROOT, allowed);
        didDelete = true;
        console.log(
          `Deleted previous generated files under ${SWAGGER_ROOT} except generator.ts, index.ts, registry.ts.`,
        );
      } catch (err) {
        console.error(`Failed to clean ${SWAGGER_ROOT}:`, err);
        process.exit(1);
      }
    } else {
      console.log(`Keeping existing files under ${SWAGGER_ROOT} and will generate alongside them.`);
    }
  } else {
    // ensure root exists for generation
    ensureDir(SWAGGER_ROOT);
  }

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    skipAddingFilesFromTsConfig: true,
  });

  const added = project.addSourceFilesAtPaths(START_GLOBS);

  const seen = new Map<string, SourceFile>();
  for (const sf of added) {
    const key = toPosix(path.normalize(sf.getFilePath()));
    seen.set(key, sf);
  }
  const candidates = Array.from(seen.values());

  const controllers: SourceFile[] = [];
  for (const sf of candidates) {
    const fp = sf.getFilePath();
    const segLower = splitSegmentsLower(fp);
    if (!segLower.some((p) => p === "controllers")) continue;
    try {
      const classes = sf.getClasses();
      let hasControllerDecorator = false;
      for (const cls of classes) {
        try {
          const dec = cls.getDecorator && cls.getDecorator("Controller");
          if (dec) {
            hasControllerDecorator = true;
            break;
          }
        } catch {
          // ignore
        }
      }
      if (hasControllerDecorator) controllers.push(sf);
    } catch {
      // ignore parse issues
    }
  }

  if (!controllers || controllers.length === 0) {
    console.error("No controllers found. Check START_GLOBS:", START_GLOBS.join(", "));
    process.exit(1);
  }

  ensureDir(SWAGGER_ROOT);

  const created: string[] = [];
  const updated: string[] = [];
  const outDirUsedNames = new Map<string, Set<string>>();

  for (const sf of controllers) {
    const controllerPath = sf.getFilePath();
    const outDir = outputDirForController(controllerPath);
    ensureDir(outDir);

    const outDirKey = toPosix(outDir);

    let usedNames = outDirUsedNames.get(outDirKey);
    if (!usedNames) {
      usedNames = new Set<string>();
      outDirUsedNames.set(outDirKey, usedNames);
    }

    const outName = outFileName(controllerPath, usedNames);
    const outPath = path.join(outDir, outName);

    const moduleToIdents = new Map<string, Set<string>>();
    const schemaMap = new Map<string, string>();
    const pathBlocks: string[] = [];

    const classes = sf.getClasses();
    let hasAuthPaths = false;

    for (const cls of classes) {
      let rawName: string | undefined;
      try {
        rawName = typeof (cls as any).getName === "function" ? (cls as any).getName() : undefined;
      } catch {
        rawName = undefined;
      }
      const fallback = path.basename(controllerPath).replace(/\.controller\.ts$/i, "");
      const className = rawName ?? fallback;

      let controllerPrefix = "";
      const cdec = cls.getDecorator("Controller");
      if (cdec) {
        const getArgs =
          typeof (cdec as any).getArguments === "function"
            ? (cdec as any).getArguments.bind(cdec)
            : () => [];
        const carr = getArgs();
        if (carr && carr.length > 0 && carr[0]) {
          const argNode: any = carr[0];
          controllerPrefix =
            typeof argNode.getText === "function" ? argNode.getText().replace(/['"`]/g, "") : "";
        }
      }

      for (const method of cls.getMethods()) {
        const decs = method.getDecorators();
        let httpMethod: string | undefined;
        let methodPath = "";
        for (const d of decs) {
          const name =
            typeof (d as any).getName === "function"
              ? (d as any).getName()
              : typeof (d as any).getText === "function"
                ? (d as any).getText()
                : undefined;
          if (!name) continue;
          if (["Get", "Post", "Put", "Patch", "Delete"].includes(name)) {
            httpMethod = name.toLowerCase();
            const getArgs =
              typeof (d as any).getArguments === "function"
                ? (d as any).getArguments.bind(d)
                : () => [];
            const args = getArgs();
            if (args.length > 0 && args[0]) {
              const a0: any = args[0];
              methodPath =
                typeof a0.getText === "function" ? a0.getText().replace(/['"`]/g, "") : "";
            }
            break;
          }
        }
        if (!httpMethod) continue;

        const originalFullPath = (
          "/" + [controllerPrefix, methodPath].filter(Boolean).join("/")
        ).replace(/\/+/g, "/");
        const tag =
          className.replace(/Controller$/, "") ||
          path.basename(controllerPath).replace(/\.controller\.ts$/i, "");

        // We'll collect method params that are @Param(...) to map path tokens -> param names
        const pathParamCandidates: Array<{
          paramName: string;
          explicitToken?: string; // e.g. @Param('id')
          schemaRef?: string; // e.g. zodParam(...)
        }> = [];

        let bodyVar: string | undefined;
        let queryVar: string | undefined;
        let paramsVar: string | undefined;
        let cookiesVar: string | undefined;
        let headersVar: string | undefined;

        // detect if route seems auth-related
        let needsSecurity = false;

        // detect multipart uploads (UploadedFile / UploadedFiles / Uploaded)
        const multipartFiles: Array<{ name: string; multiple?: boolean }> = [];

        for (const param of method.getParameters()) {
          const pdecs =
            typeof (param as any).getDecorators === "function"
              ? (param as any).getDecorators()
              : [];
          if (!pdecs || pdecs.length === 0) continue;

          const paramName =
            typeof (param as any).getName === "function"
              ? (param as any).getName()
              : String((param as any).getName ? (param as any).getName() : "");

          for (const pd of pdecs) {
            const pdName = typeof pd.getName === "function" ? pd.getName() : undefined;
            const getArgs =
              typeof pd.getArguments === "function" ? pd.getArguments.bind(pd) : () => [];
            const args = getArgs();
            if (!args || args.length === 0) continue;
            const arg = args[0];
            if (!arg) continue;

            try {
              const kind = typeof arg.getKind === "function" ? arg.getKind() : undefined;

              // detect common file decorators by name
              if (pdName && ["UploadedFile", "UploadedFiles", "Uploaded"].includes(pdName)) {
                const multiple = pdName === "UploadedFiles";
                multipartFiles.push({ name: paramName, multiple });
                continue;
              }

              if (pdName === "Body" && kind === SyntaxKind.CallExpression) {
                const inner =
                  typeof arg.asKind === "function"
                    ? arg.asKind(SyntaxKind.CallExpression)
                    : undefined;
                const innerArgs =
                  inner && typeof inner.getArguments === "function" ? inner.getArguments() : [];
                if (innerArgs.length > 0 && innerArgs[0])
                  bodyVar =
                    typeof innerArgs[0].getText === "function"
                      ? innerArgs[0].getText()
                      : String(innerArgs[0]);
              } else if (pdName === "Query" && kind === SyntaxKind.CallExpression) {
                const inner =
                  typeof arg.asKind === "function"
                    ? arg.asKind(SyntaxKind.CallExpression)
                    : undefined;
                const innerArgs =
                  inner && typeof inner.getArguments === "function" ? inner.getArguments() : [];
                if (innerArgs.length > 0 && innerArgs[0])
                  queryVar =
                    typeof innerArgs[0].getText === "function"
                      ? innerArgs[0].getText()
                      : String(innerArgs[0]);
              } else if (pdName === "Param") {
                // Handle @Param('id'), @Param(zodParam(...)), or @Param() style
                if (kind === SyntaxKind.StringLiteral) {
                  // @Param('id')
                  const tok =
                    typeof arg.getText === "function"
                      ? arg.getText().replace(/['"`]/g, "")
                      : String(arg);
                  pathParamCandidates.push({ paramName, explicitToken: tok });
                  // keep paramsVar as candidate, but we will only register it if it looks like a schema identifier later
                  paramsVar = paramsVar ?? tok;
                } else if (kind === SyntaxKind.CallExpression) {
                  // could be @Param(zodParam(schema)) or @Param(zodParam(schema,'id')) etc.
                  const inner =
                    typeof arg.asKind === "function"
                      ? arg.asKind(SyntaxKind.CallExpression)
                      : undefined;
                  const callee =
                    inner &&
                    typeof inner.getExpression === "function" &&
                    typeof inner.getExpression().getText === "function"
                      ? inner.getExpression().getText()
                      : "";
                  const innerArgs =
                    inner && typeof inner.getArguments === "function" ? inner.getArguments() : [];
                  if (callee.includes("zodParam") && innerArgs.length > 0) {
                    const cand =
                      typeof innerArgs[0].getText === "function"
                        ? innerArgs[0].getText()
                        : String(innerArgs[0]);
                    pathParamCandidates.push({ paramName, schemaRef: cand });
                    paramsVar = paramsVar ?? cand;
                  } else if (innerArgs.length > 0 && innerArgs[0]) {
                    const possible =
                      typeof innerArgs[0].getText === "function"
                        ? innerArgs[0].getText()
                        : String(innerArgs[0]);
                    const litMatch = possible.match(/^['"`](.*)['"`]$/);
                    if (litMatch) {
                      pathParamCandidates.push({ paramName, explicitToken: litMatch[1] });
                      paramsVar = paramsVar ?? litMatch[1];
                    } else {
                      pathParamCandidates.push({ paramName });
                    }
                  } else {
                    pathParamCandidates.push({ paramName });
                  }
                } else {
                  // @Param() or unknown form
                  pathParamCandidates.push({ paramName });
                }
              } else if (pdName === "Cookies") {
                cookiesVar = typeof arg.getText === "function" ? arg.getText() : String(arg);
              } else if (pdName === "Headers") {
                headersVar = typeof arg.getText === "function" ? arg.getText() : String(arg);
              } else {
                if (kind === SyntaxKind.CallExpression) {
                  const inner =
                    typeof arg.asKind === "function"
                      ? arg.asKind(SyntaxKind.CallExpression)
                      : undefined;
                  const callee =
                    inner &&
                    typeof inner.getExpression === "function" &&
                    typeof inner.getExpression().getText === "function"
                      ? inner.getExpression().getText()
                      : "";
                  const innerArgs =
                    inner && typeof inner.getArguments === "function" ? inner.getArguments() : [];
                  if (innerArgs.length > 0 && innerArgs[0]) {
                    const cand =
                      typeof innerArgs[0].getText === "function"
                        ? innerArgs[0].getText()
                        : String(innerArgs[0]);
                    if (callee.includes("zodBody")) bodyVar = bodyVar ?? cand;
                    if (callee.includes("zodQuery")) queryVar = queryVar ?? cand;
                    if (callee.includes("zodParam")) paramsVar = paramsVar ?? cand;
                    if (callee.includes("zodHeaders")) headersVar = headersVar ?? cand;
                  }
                }
              }
            } catch {
              // ignore parse issues
            }

            // collect imports for any detected schema identifiers
            for (const maybe of [bodyVar, queryVar, paramsVar, cookiesVar, headersVar]) {
              if (!maybe) continue;
              const resolved = resolveImportForIdent(sf, maybe);
              const mod = resolved.module ?? "";
              const ident = resolved.ident ?? maybe;
              if (!moduleToIdents.has(mod)) moduleToIdents.set(mod, new Set<string>());
              moduleToIdents.get(mod)!.add(ident);
            }
          }
        }

        // Map path tokens to generic {id} or param names, but do not use token name as schema identifier automatically.
        let finalPath = originalFullPath;
        try {
          const tokenRegex = /:([A-Za-z0-9_]+)/g;
          const tokens: string[] = [];
          let m;
          while ((m = tokenRegex.exec(originalFullPath)) !== null) {
            tokens.push(m[1]);
          }

          if (tokens.length > 0) {
            const used = new Set<number>();
            for (let i = 0; i < tokens.length; i++) {
              const tok = tokens[i];
              const foundIndex = pathParamCandidates.findIndex((c) => c.explicitToken === tok);
              if (foundIndex !== -1) {
                // We emit generic {id} as requested
                finalPath = finalPath.replace(`:${tok}`, `{id}`);
                used.add(foundIndex);
                continue;
              }
            }
            let candidatePointer = 0;
            for (let i = 0; i < tokens.length; i++) {
              const tok = tokens[i];
              if (finalPath.indexOf(`:${tok}`) === -1) continue;
              while (candidatePointer < pathParamCandidates.length && used.has(candidatePointer))
                candidatePointer++;
              if (candidatePointer < pathParamCandidates.length) {
                finalPath = finalPath.replace(`:${tok}`, `{id}`);
                used.add(candidatePointer);
                candidatePointer++;
              } else {
                finalPath = finalPath.replace(`:${tok}`, `{id}`);
              }
            }
          }
        } catch {
          finalPath = originalFullPath.replace(/:([A-Za-z0-9_]+)/g, (_m, _p1) => `{id}`);
        }

        // Register schema map entries (only register if looks like a schema identifier)
        function shouldRegisterSchemaCandidate(varName?: string) {
          if (!varName) return false;
          // if it resolves to an import, treat as schema
          const resolved = resolveImportForIdent(sf, varName);
          if (resolved.module && resolved.ident) return true;
          // accept variables that end with Schema
          if (varName.endsWith("Schema")) return true;
          return false;
        }
        if (shouldRegisterSchemaCandidate(bodyVar)) {
          const resolved = resolveImportForIdent(sf, bodyVar!);
          const ident = resolved.ident ?? bodyVar!;
          schemaMap.set(pascalDtoNameFromVar(bodyVar!), ident);
        }
        if (shouldRegisterSchemaCandidate(queryVar)) {
          const resolved = resolveImportForIdent(sf, queryVar!);
          const ident = resolved.ident ?? queryVar!;
          schemaMap.set(pascalDtoNameFromVar(queryVar!), ident);
        }
        if (shouldRegisterSchemaCandidate(paramsVar)) {
          const resolved = resolveImportForIdent(sf, paramsVar!);
          const ident = resolved.ident ?? paramsVar!;
          schemaMap.set(pascalDtoNameFromVar(paramsVar!), ident);
        }
        if (shouldRegisterSchemaCandidate(cookiesVar) && cookiesVar!.endsWith("Schema")) {
          const resolved = resolveImportForIdent(sf, cookiesVar!);
          const ident = resolved.ident ?? cookiesVar!;
          schemaMap.set(pascalDtoNameFromVar(cookiesVar!), ident);
        }
        if (shouldRegisterSchemaCandidate(headersVar)) {
          const resolved = resolveImportForIdent(sf, headersVar!);
          const ident = resolved.ident ?? headersVar!;
          // headers are not usually registered as DTOs but we still collect
          schemaMap.set(pascalDtoNameFromVar(headersVar!), ident);
        }

        // Determine auth-ish endpoints
        if (finalPath.startsWith("/auth") || originalFullPath.startsWith("/auth")) {
          const lc = finalPath.toLowerCase();
          if (lc.includes("logout")) needsSecurity = true;
          const decoNames = decs
            .map((d) =>
              typeof (d as any).getName === "function"
                ? (d as any).getName()
                : typeof (d as any).getText === "function"
                  ? (d as any).getText()
                  : undefined,
            )
            .filter(Boolean)
            .map((s) => String(s));
          const authish = ["UseGuards", "AuthGuard", "JwtAuthGuard", "Auth", "Roles"];
          if (decoNames.some((n) => authish.includes(n ?? ""))) needsSecurity = true;
        }

        if (finalPath.startsWith("/auth") || originalFullPath.startsWith("/auth"))
          hasAuthPaths = hasAuthPaths || true;

        // Parse user-provided overrides
        const overrideRaw = parseOverrideFromMethod(method, sf);
        // ----- NEW: if overrideRaw is present, scan it for $ref and for string schema names in request.*
        if (overrideRaw) {
          // collect component $refs
          const refs = new Set<string>();
          collectRefsInObject(overrideRaw, refs);
          for (const comp of refs) {
            const varName = componentNameToSchemaVar(comp);
            const sharedMod = "@repo/shared-schemas";
            if (!moduleToIdents.has(sharedMod)) moduleToIdents.set(sharedMod, new Set<string>());
            moduleToIdents.get(sharedMod)!.add(varName);
            // register schemaMap mapping from Pascal component to varName so registerMultiple includes it
            const pascalName = comp; // e.g. UpdateProjectCollaborationDto or CreatedItem
            if (!schemaMap.has(pascalName)) schemaMap.set(pascalName, varName);
          }

          // if override.request.* contains strings pointing to schema vars, register them
          try {
            const r = overrideRaw.request;
            if (r && typeof r === "object") {
              for (const key of ["params", "query", "cookies", "headers"]) {
                const val = r[key];
                if (typeof val === "string" && val.trim().length > 0) {
                  // assume the string is a schema identifier exported from @repo/shared-schemas
                  const sharedMod = "@repo/shared-schemas";
                  const ident = val;
                  if (!moduleToIdents.has(sharedMod))
                    moduleToIdents.set(sharedMod, new Set<string>());
                  moduleToIdents.get(sharedMod)!.add(ident);
                  // add a Pascal DTO entry so it can be registered
                  const dtoName = pascalDtoNameFromVar(ident);
                  if (!schemaMap.has(dtoName)) schemaMap.set(dtoName, ident);
                }
              }
            }
          } catch {
            // ignore
          }
        }
        // ----- END NEW SCANNING

        const override = normalizeOverrideForRequest(overrideRaw);

        // known identifiers set for serializer (emit imported identifiers unquoted)
        const knownIdents = knownIdentsFromMap(moduleToIdents);
        for (const cand of [bodyVar, queryVar, paramsVar, cookiesVar, headersVar]) {
          if (!cand) continue;
          const resolved = resolveImportForIdent(sf, cand);
          if (resolved.module && resolved.ident) knownIdents.add(resolved.ident);
        }

        // parts for request builder
        const parts = {
          bodyComp: bodyVar ? pascalDtoNameFromVar(bodyVar) : undefined,
          paramsVar:
            paramsVar && resolveImportForIdent(sf, paramsVar).module
              ? resolveImportForIdent(sf, paramsVar).ident
              : paramsVar &&
                  paramsVar.endsWith("Schema") &&
                  resolveImportForIdent(sf, paramsVar).ident
                ? resolveImportForIdent(sf, paramsVar).ident
                : paramsVar && /^\w+$/.test(paramsVar) && knownIdents.has(paramsVar)
                  ? paramsVar
                  : undefined,
          queryVar:
            queryVar && resolveImportForIdent(sf, queryVar).module
              ? resolveImportForIdent(sf, queryVar).ident
              : queryVar && queryVar.endsWith("Schema") && resolveImportForIdent(sf, queryVar).ident
                ? resolveImportForIdent(sf, queryVar).ident
                : queryVar && knownIdents.has(queryVar)
                  ? queryVar
                  : undefined,
          cookiesVar:
            cookiesVar && resolveImportForIdent(sf, cookiesVar).module
              ? resolveImportForIdent(sf, cookiesVar).ident
              : cookiesVar &&
                  cookiesVar.endsWith("Schema") &&
                  resolveImportForIdent(sf, cookiesVar).ident
                ? resolveImportForIdent(sf, cookiesVar).ident
                : undefined,
          headersVar:
            headersVar && resolveImportForIdent(sf, headersVar).module
              ? resolveImportForIdent(sf, headersVar).ident
              : headersVar &&
                  headersVar.endsWith("Schema") &&
                  resolveImportForIdent(sf, headersVar).ident
                ? resolveImportForIdent(sf, headersVar).ident
                : undefined,
          hasPathParams: /\{[A-Za-z0-9_]+\}/.test(finalPath),
          needsAuth: needsSecurity,
          multipartFiles: multipartFiles.length ? multipartFiles : undefined,
        };

        // build path block
        const pathBlock = buildRegisterPathAsCode(
          httpMethod,
          finalPath || "/",
          tag,
          parts,
          overrideRaw,
          knownIdents,
        );
        pathBlocks.push(pathBlock);
      }
    }

    if (hasAuthPaths) {
      const sharedMod = "@repo/shared-schemas";
      if (!moduleToIdents.has(sharedMod)) moduleToIdents.set(sharedMod, new Set<string>());
      moduleToIdents.get(sharedMod)!.add("loginSchema");
      moduleToIdents.get(sharedMod)!.add("registerSchema");
      if (!schemaMap.has("LoginDto")) schemaMap.set("LoginDto", "loginSchema");
      if (!schemaMap.has("RegisterDto")) schemaMap.set("RegisterDto", "registerSchema");
    }

    const groupedImportsText = buildGroupedImports(moduleToIdents);
    const registerBlockText = buildRegisterMultiple(schemaMap);
    const regRel = registryImportRelPath(outDir);
    const registryImportLine = `import { registerMultiple, registry } from "${regRel}";`;

    let authPreamble = "";
    if (hasAuthPaths) {
      // single shared securitySchemes registration per-file (not per-path)
      authPreamble = `/**
 * Register a securitySchemes component using registry.registerComponent.
 * registerComponent(type, name, componentObject)
 *
 * The return value has { name, ref: { $ref: string } } shape.
 * We'll cast it to a typed object so TS/ESLint are happier.
 */
const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description:
    "JWT Bearer token. Paste the token or 'Bearer <token>' depending on your Swagger UI.",
}) as { name: string; ref: { $ref: string } };\n\n`;
    }

    const pieces = [
      registryImportLine,
      groupedImportsText || "",
      "",
      authPreamble || "",
      registerBlockText || "",
      pathBlocks.join("\n\n") || "",
    ].filter(Boolean);
    const finalContent = pieces.join("\n");

    const isNew = !fs.existsSync(outPath);
    const changed = await writeIfChangedNormalized(outPath, finalContent);
    if (isNew && changed) {
      created.push(toPosix(outPath));
      console.log(`Created ${toPosix(outPath)}`);
    } else if (!isNew && changed) {
      updated.push(toPosix(outPath));
      console.log(`Updated ${toPosix(outPath)}`);
    }
  }

  // module-level indexes
  function walkDirs(root: string): string[] {
    const result: string[] = [];
    if (!fs.existsSync(root)) return result;
    const entries = fs.readdirSync(root, { withFileTypes: true });
    let has = false;
    for (const e of entries) {
      const full = path.join(root, e.name);
      if (e.isFile() && e.name.toLowerCase().endsWith(".openapi.ts")) has = true;
      if (e.isDirectory()) result.push(...walkDirs(full));
    }
    if (has) result.push(root);
    return result;
  }

  const dirs = walkDirs(SWAGGER_ROOT);
  for (const dir of dirs) {
    const files: string[] = [];
    function gather(d: string) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, e.name);
        if (e.isDirectory()) gather(full);
        else if (e.isFile() && e.name.toLowerCase().endsWith(".openapi.ts")) files.push(full);
      }
    }
    gather(dir);

    files.sort((a, b) => a.localeCompare(b));
    const relImports = files.map((f) => {
      let rel = path.relative(dir, f);
      rel = toPosix(rel);
      if (!rel.startsWith(".")) rel = `./${rel}`;
      rel = rel.replace(/\.ts$/, "");
      return `import "${rel}";`;
    });

    const indexPath = path.join(dir, "index.ts");
    const content = `// Module swagger index (auto-generated)\n${relImports.join("\n")}\n`;
    const wrote = await writeIfChangedNormalized(indexPath, content);
    if (wrote) console.log(`Wrote module index ${toPosix(indexPath)}`);
  }

  const topLevelDirs = (
    fs.existsSync(SWAGGER_ROOT) ? fs.readdirSync(SWAGGER_ROOT, { withFileTypes: true }) : []
  )
    .filter((d) => d.isDirectory())
    .map((d) => path.join(SWAGGER_ROOT, d.name))
    .sort((a, b) => a.localeCompare(b));

  let topIndexText = "";
  if (fs.existsSync(SWAGGER_INDEX)) topIndexText = fs.readFileSync(SWAGGER_INDEX, "utf8");
  else topIndexText = "// Top-level swagger index (auto-generated)\n";

  const neededImports: string[] = [];
  for (const modDir of topLevelDirs) {
    const idx = path.join(modDir, "index.ts");
    if (fs.existsSync(idx)) {
      let rel = path.relative(SWAGGER_ROOT, idx);
      rel = toPosix(rel);
      if (!rel.startsWith(".")) rel = `./${rel}`;
      neededImports.push(`import "${rel.replace(/\.ts$/, "")}";`);
    }
  }
  neededImports.sort((a, b) => a.localeCompare(b));

  const existingTopImports = new Set<string>(
    topIndexText
      .split("\n")
      .filter((l) => l.trim().startsWith("import "))
      .map((l) => l.trim()),
  );
  const toAdd = neededImports.filter((i) => !existingTopImports.has(i));
  if (toAdd.length > 0) {
    const newTop = toAdd.join("\n") + "\n" + topIndexText;
    const wroteTop = await writeIfChangedNormalized(SWAGGER_INDEX, newTop);
    if (wroteTop) console.log(`Updated ${toPosix(SWAGGER_INDEX)} with ${toAdd.length} imports.`);
  } else {
    if (!fs.existsSync(SWAGGER_INDEX)) {
      const wrote = await writeIfChangedNormalized(SWAGGER_INDEX, topIndexText);
      if (wrote) console.log(`Created ${toPosix(SWAGGER_INDEX)}`);
    }
  }

  // Run ESLint CLI fix on generated swagger files to ensure consistent formatting
  // Run it if any file changed was created/updated OR we deleted files (fresh generation)
  if (created.length > 0 || updated.length > 0 || didDelete) {
    runEslintCliFixOnSwagger();
  }

  if (created.length === 0 && updated.length === 0) {
    console.log("Done. No changes needed.");
  } else {
    if (created.length) {
      console.log("Created files:");
      for (const c of created) console.log("  +", c);
    }
    if (updated.length) {
      console.log("Updated files:");
      for (const u of updated) console.log("  ~", u);
    }
    console.log("Done.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
