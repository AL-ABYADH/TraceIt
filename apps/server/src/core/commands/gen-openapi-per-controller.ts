/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Project, SyntaxKind, SourceFile } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const START_GLOBS = [
  // features controllers (nested and direct)
  "src/features/**/controllers/**/*.controller.ts",
  "src/features/**/controllers/*.controller.ts",
  "src/features/**/controllers/**/*.ts",
  "src/features/**/controllers/*.ts",
  // core controllers (nested and direct)
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

/**
 * Split a path into posix segments (lowercased for comparisons).
 * Use this for directory-name comparisons (controllers, features, core).
 */
function splitSegmentsLower(p: string) {
  const posix = toPosix(path.normalize(p));
  return posix
    .split("/")
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

/**
 * NOTE: Prettier logic removed as requested.
 * Fallback normalization (whitespace-insensitive but deterministic):
 * - normalize line endings
 * - trim trailing whitespace on each line
 * - reduce multiple blank lines to a single blank line
 * - ensure single trailing newline
 */
function normalizeByPrettierOrFallback(content: string): string {
  let s = content.replace(/\r\n/g, "\n");
  s = s
    .split("\n")
    .map((l) => l.replace(/\s+$/g, ""))
    .join("\n");
  // collapse repeated blank lines (3+ -> 1)
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.trimEnd() + "\n";
  return s;
}

/**
 * Write file only if normalized content is different.
 * Returns true when file was written (new or updated), false when unchanged.
 */
function writeIfChangedNormalized(filePath: string, content: string): boolean {
  const normalizedNew = normalizeByPrettierOrFallback(content);

  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, "utf8");
    const normalizedExisting = normalizeByPrettierOrFallback(existing);
    if (normalizedExisting === normalizedNew) return false;
  } else {
    ensureDir(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, normalizedNew, "utf8");
  return true;
}

/* ---------- deterministic builders ---------- */

function pascalDtoNameFromVar(varName: string) {
  if (!varName) return varName;
  const stripped = varName.endsWith("Schema") ? varName.slice(0, -"Schema".length) : varName;
  const pascal = stripped.replace(/(^\w|[_\-\s]+\w)/g, (m) =>
    m.replace(/[_\-\s]/g, "").toUpperCase(),
  );
  return `${pascal}Dto`;
}

/**
 * Build grouped imports deterministically:
 * - sort module specifiers
 * - sort identifiers per module
 */
function buildGroupedImports(modMap: Map<string, Set<string>>) {
  const modules = Array.from(modMap.keys()).sort((a, b) => (a || "").localeCompare(b || ""));
  const blocks: string[] = [];
  for (const mod of modules) {
    const idents = Array.from(modMap.get(mod) ?? []).sort((a, b) => a.localeCompare(b));
    if (!mod || mod.trim() === "") {
      for (const id of idents) blocks.push(`// TODO: add import for ${id}`);
      continue;
    }
    if (idents.length === 1) blocks.push(`import { ${idents[0]} } from "${mod}";`);
    else blocks.push(`import {\n  ${idents.join(",\n  ")},\n} from "${mod}";`);
  }
  return blocks.join("\n");
}

/**
 * Build registerMultiple mapping deterministically (sorted keys)
 */
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

/* ---------- request / path builders (unchanged but deterministic in usage) ---------- */

function buildRequestSection(parts: {
  bodyComp?: string;
  paramsVar?: string;
  queryVar?: string;
  cookiesVar?: string;
}) {
  const lines: string[] = [];
  const hasBody = !!parts.bodyComp;
  const hasParams = !!parts.paramsVar;
  const hasQuery = !!parts.queryVar;
  const hasCookies = !!parts.cookiesVar;

  if (hasBody) {
    lines.push(`  request: {`);
    lines.push(`    body: {`);
    lines.push(`      description: "${parts.bodyComp} request body",`);
    lines.push(`      required: true,`);
    lines.push(`      content: {`);
    lines.push(
      `        "application/json": { schema: { $ref: "#/components/schemas/${parts.bodyComp}" } },`,
    );
    lines.push(`      },`);
    lines.push(`    },`);
    if (hasParams) lines.push(`    params: ${parts.paramsVar},`);
    if (hasQuery) lines.push(`    query: ${parts.queryVar},`);
    if (hasCookies) lines.push(`    cookies: ${parts.cookiesVar},`);
    lines.push(`  },`);
  } else {
    const inner: string[] = [];
    if (hasParams) inner.push(`    params: ${parts.paramsVar},`);
    if (hasQuery) inner.push(`    query: ${parts.queryVar},`);
    if (hasCookies) inner.push(`    cookies: ${parts.cookiesVar},`);
    if (inner.length > 0) {
      lines.push(`  request: {`);
      lines.push(...inner);
      lines.push(`  },`);
    }
  }

  return lines.join("\n");
}

function buildRegisterPath(
  method: string,
  fullPath: string,
  tag: string,
  parts: {
    bodyComp?: string;
    paramsVar?: string;
    queryVar?: string;
    cookiesVar?: string;
  },
) {
  const request = buildRequestSection(parts);
  return `registry.registerPath({
  method: "${method}",
  path: "${fullPath}",
  tags: ["${tag}"],
${request}
  responses: {
    200: { description: "Successful response" },
  },
});
`;
}

/* ---------- helpers for output paths ---------- */

function outputDirForController(controllerPath: string) {
  // Normalize to posix path for cross-platform handling
  const posix = toPosix(path.normalize(controllerPath));
  const parts = posix.split("/").filter(Boolean);
  const partsLower = parts.map((p) => p.toLowerCase());
  // support both "features" and "core" top-levels
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
  // case-insensitive .controller.ts removal (handles .Controller.ts etc.)
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

/* ---------- import resolution (same robust approach) ---------- */

function resolveImportForIdent(
  sf: SourceFile,
  identText: string,
): { module: string; ident: string } {
  if (!identText) return { module: "", ident: identText };

  // dotted usage (namespace.ident)
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

  // named imports (safe)
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

  // fallback: namespace imports where identText starts with namespace + "."
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

/* ---------- main ---------- */

async function main() {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    skipAddingFilesFromTsConfig: true,
  });

  // add files using the configured globs
  const added = project.addSourceFilesAtPaths(START_GLOBS);

  // dedupe by normalized path (use posix for consistent keys)
  const seen = new Map<string, SourceFile>();
  for (const sf of added) {
    const key = toPosix(path.normalize(sf.getFilePath()));
    seen.set(key, sf);
  }
  const candidates = Array.from(seen.values());

  // filter to actual controllers: must live in a 'controllers' path and have a @Controller decorator
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

  // track used names per output directory to avoid collisions across multiple controllers in same dir
  const outDirUsedNames = new Map<string, Set<string>>();

  for (const sf of controllers) {
    const controllerPath = sf.getFilePath();
    const outDir = outputDirForController(controllerPath);
    ensureDir(outDir);

    // use posix outDir key for Map consistency across OS
    const outDirKey = toPosix(outDir);

    // get / create usedNames for this output directory
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

        const fullPath = ("/" + [controllerPrefix, methodPath].filter(Boolean).join("/")).replace(
          /\/+/g,
          "/",
        );
        const tag =
          className.replace(/Controller$/, "") ||
          path.basename(controllerPath).replace(/\.controller\.ts$/i, "");

        let bodyVar: string | undefined;
        let queryVar: string | undefined;
        let paramsVar: string | undefined;
        let cookiesVar: string | undefined;

        for (const param of method.getParameters()) {
          const pdecs =
            typeof (param as any).getDecorators === "function"
              ? (param as any).getDecorators()
              : [];
          if (!pdecs || pdecs.length === 0) continue;
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
              } else if (pdName === "Param" && kind === SyntaxKind.CallExpression) {
                const inner =
                  typeof arg.asKind === "function"
                    ? arg.asKind(SyntaxKind.CallExpression)
                    : undefined;
                const innerArgs =
                  inner && typeof inner.getArguments === "function" ? inner.getArguments() : [];
                if (innerArgs.length > 0 && innerArgs[0])
                  paramsVar =
                    typeof innerArgs[0].getText === "function"
                      ? innerArgs[0].getText()
                      : String(innerArgs[0]);
              } else if (pdName === "Cookies") {
                cookiesVar = typeof arg.getText === "function" ? arg.getText() : String(arg);
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
                  }
                }
              }
            } catch {
              // ignore parse issues
            }

            for (const maybe of [bodyVar, queryVar, paramsVar, cookiesVar]) {
              if (!maybe) continue;
              const resolved = resolveImportForIdent(sf, maybe);
              const mod = resolved.module ?? "";
              const ident = resolved.ident ?? maybe;
              if (!moduleToIdents.has(mod)) moduleToIdents.set(mod, new Set<string>());
              moduleToIdents.get(mod)!.add(ident);
            }
          }
        }

        if (bodyVar) schemaMap.set(pascalDtoNameFromVar(bodyVar), bodyVar);
        if (queryVar) schemaMap.set(pascalDtoNameFromVar(queryVar), queryVar);
        if (paramsVar) schemaMap.set(pascalDtoNameFromVar(paramsVar), paramsVar);
        if (cookiesVar && cookiesVar.endsWith("Schema"))
          schemaMap.set(pascalDtoNameFromVar(cookiesVar), cookiesVar);

        const parts = {
          bodyComp: bodyVar ? pascalDtoNameFromVar(bodyVar) : undefined,
          paramsVar,
          queryVar,
          cookiesVar,
        };
        pathBlocks.push(buildRegisterPath(httpMethod, fullPath || "/", tag, parts));
      }
    }

    // assemble content deterministically
    const groupedImportsText = buildGroupedImports(moduleToIdents);
    const registerBlockText = buildRegisterMultiple(schemaMap);
    const regRel = registryImportRelPath(outDir);
    const registryImportLine = `import { registerMultiple, registry } from "${regRel}";`;
    const pieces = [
      registryImportLine,
      groupedImportsText || "",
      "",
      registerBlockText || "",
      pathBlocks.join("\n\n") || "",
    ].filter(Boolean);
    const finalContent = pieces.join("\n");

    // write only if normalized/formatted content differs
    const isNew = !fs.existsSync(outPath);
    const changed = writeIfChangedNormalized(outPath, finalContent);
    if (isNew && changed) {
      created.push(toPosix(outPath));
      console.log(`Created ${toPosix(outPath)}`);
    } else if (!isNew && changed) {
      updated.push(toPosix(outPath));
      console.log(`Updated ${toPosix(outPath)}`);
    }
    // unchanged -> no log
  } // controllers loop

  // module-level indexes (deterministic order)
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
    const wrote = writeIfChangedNormalized(indexPath, content);
    if (wrote) console.log(`Wrote module index ${toPosix(indexPath)}`);
  }

  // update top-level index deterministically (sorted)
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
    const wroteTop = writeIfChangedNormalized(SWAGGER_INDEX, newTop);
    if (wroteTop) console.log(`Updated ${toPosix(SWAGGER_INDEX)} with ${toAdd.length} imports.`);
  } else {
    // ensure top-level index exists even if no change
    if (!fs.existsSync(SWAGGER_INDEX)) {
      const wrote = writeIfChangedNormalized(SWAGGER_INDEX, topIndexText);
      if (wrote) console.log(`Created ${toPosix(SWAGGER_INDEX)}`);
    } else {
      // unchanged -> no output
    }
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
