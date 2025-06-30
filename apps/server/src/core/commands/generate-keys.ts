import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const envPath = path.resolve(process.cwd(), ".env");

function generateKey(length = 64) {
  return crypto.randomBytes(length).toString("hex");
}

function updateEnvVariable(content: string, key: string, value: string): string {
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(content)) {
    return content.replace(regex, `${key}=${value}`);
  } else {
    const endingNewline = content.endsWith("\n") ? "" : "\n";
    return content + endingNewline + `${key}=${value}\n`;
  }
}

function createOrUpdateEnv(update = false) {
  const jwtSecret = generateKey();
  const jwtRefreshSecret = generateKey();

  if (!fs.existsSync(envPath)) {
    const initialContent = `JWT_SECRET=${jwtSecret}\nJWT_REFRESH_SECRET=${jwtRefreshSecret}\n`;
    fs.writeFileSync(envPath, initialContent);
    console.log(`✅ '.env' file created with JWT keys.`);
    return;
  }

  let content = fs.readFileSync(envPath, "utf-8");

  const hasJwtSecret = /^JWT_SECRET=.*$/m.test(content);
  const hasJwtRefreshSecret = /^JWT_REFRESH_SECRET=.*$/m.test(content);

  if (!update) {
    if (hasJwtSecret && hasJwtRefreshSecret) {
      console.warn(`❗ '.env' file already contains JWT keys.`);
      console.warn(`Use 'pnpm run update:keys' to regenerate keys.`);
      process.exit(1);
    }
  }

  content = updateEnvVariable(content, "JWT_SECRET", jwtSecret);
  content = updateEnvVariable(content, "JWT_REFRESH_SECRET", jwtRefreshSecret);

  fs.writeFileSync(envPath, content);
  console.log(`✅ JWT keys ${update ? "updated" : "added"} successfully in '.env' file.`);
}

// Check if --update is present in the command line arguments
const isUpdate = process.argv.includes("--update");

createOrUpdateEnv(isUpdate);
