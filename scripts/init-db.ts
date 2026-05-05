import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

async function main() {
  try {
    const schemaPath = path.join(process.cwd(), "schema.db");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    
    console.log("Inicializando base de datos...");
    await db.executeMultiple(schemaSql);
    console.log("Base de datos inicializada exitosamente.");
    
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
}

main();
