import fs from "fs";
import fg from "fast-glob";
import pick from "lodash/pick";

export interface Package {
  name: string;
  version: string;
  scripts: {
    [key: string]: string;
  };
}

export interface AllPackages {
  [key: string]: Package;
}

const readFile = async (file: string) =>
  await JSON.parse(fs.readFileSync(file, "utf8"));

export const findPackages = () =>
  fg.sync("**/package.json", { ignore: ["**/node_modules/**"] });

export const findWorkspaces = async (): Promise<AllPackages> => {
  const packages = findPackages();
  const results = await Promise.all(packages.map(p => readFile(p)));

  return results.reduce((acc, result, index) => {
    const p = packages[index];
    acc[p] = pick(result, ["name", "version", "scripts"]);
    return acc;
  }, {});
};

export interface Item {
  label: string;
  value: string;
  divider?: boolean;
  preview?: string;
  location?: string;
}

export const composeItems = async () => {
  const workspaces = await findWorkspaces();
  const items: Item[] = [];

  Object.entries(workspaces).forEach(([location, packageContent]) => {
    let isRoot = location === "package.json" ? true : false;
    const runCmd = `yarn ${
      !isRoot ? `workspace ${packageContent.name} ` : ""
    }run`;

    items.push({
      label: packageContent.name,
      value: runCmd,
      preview: runCmd,
      divider: true,
      location,
    });

    if (packageContent.scripts) {
      Object.entries(packageContent.scripts).forEach(([script]) => {
        const scriptCmd = `yarn ${
          !isRoot ? `workspace ${packageContent.name} ` : ""
        }run ${script}`;

        items.push({
          label: scriptCmd,
          value: scriptCmd,
          preview: packageContent.scripts[script],
        });
      });
    }
  });

  return items;
};
