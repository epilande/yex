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

export interface Item {
  label: string;
  value: string;
  divider?: boolean;
  preview?: string;
  location?: string;
}

const readFile = async (file: string) =>
  await JSON.parse(fs.readFileSync(file, "utf8"));

export const findPackages = () =>
  fg.sync("**/package.json", { ignore: ["**/node_modules/**"] });

export const findWorkspaces = async (): Promise<AllPackages> => {
  const packages = findPackages();
  let results: any[];

  try {
    results = await Promise.all(packages.map(p => readFile(p)));
  } catch (err) {
    console.log("\x1b[31m", "Error: Unable to process projects..");
    process.exit(1);
  }

  return results!.reduce((acc, result, index) => {
    const p = packages[index];
    acc[p] = pick(result, ["name", "version", "scripts"]);
    return acc;
  }, {});
};

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

const fuzzySearch = (needle: string = "", haystack: string = "") => {
  const nlen = needle.length;
  const hlen = haystack.length;

  if (nlen > hlen) return false;
  if (nlen === hlen) return needle === haystack;

  outer: for (let i = 0, j = 0; i < nlen; i++) {
    const nch = needle.charCodeAt(i);
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
};

export const filterItems = (text: string, items: Item[] = []) =>
  items.filter(
    item =>
      fuzzySearch(text, item.label) ||
      fuzzySearch(text, item.value) ||
      fuzzySearch(text, item.preview),
  );
