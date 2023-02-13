import moment from "moment";
import { promises as fs, existsSync } from "fs";

export const getUnixTimestamp = (date: any) => {
  return Math.floor(date / 1000);
};

export const getFormattedMigrationName = (name: string) => {
  return name.replaceAll(" ", "-").toLocaleLowerCase();
};

export const getMigrationFileName = (migrationName: string) => {
  const dateTime = moment().format("YYYYMMDDHHmmss");
  const formattedMigrationName = getFormattedMigrationName(migrationName);
  return `${dateTime}_${formattedMigrationName}.ts`;
};

export const createMigration = async () => {
  try {
    const dir = "migrations";
    // if (existsSync(dir)) await fs.rm(dir, { recursive: true });

    if (!existsSync(dir)) {
      await fs.mkdir(`${dir}`, { recursive: true });
    }

    process.argv.splice(0, 1);
    const migrationName = process.argv.join("-");

    const migrationFileName = getMigrationFileName(migrationName);

    await fs.copyFile(
      "./migration.template.ts",
      `migrations/${migrationFileName}`
    );
  } catch (error: any) {
    console.error("Migration file creation files: ", error?.message);
  }
};
