import fs from "fs";
import path from "path";

const name = process.argv[2];

if (!name) {
  console.log("Provide service name");
  process.exit(1);
}

const base = process.cwd();

const handlerPath = path.join(base, "api", "src", "handlers");
const servicePath = path.join(base, "api", "src", "services");

fs.writeFileSync(path.join(handlerPath, `${name}.handler.ts`), "");
fs.writeFileSync(path.join(servicePath, `${name}.service.ts`), "");

console.log("Service and handler have created: ", name);
