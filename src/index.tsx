import { execSync } from "child_process";
import React from "react";
import { render, Box, Text, Color } from "ink";
import SelectInput from "ink-select-input";
// import { UncontrolledTextInput } from "ink-text-input";
import { composeItems, Item } from "./workspaces";
import { NpmScript } from "./components";

const App = () => {
  const [cmd, setCmd] = React.useState("");
  const [items, setItems] = React.useState<Item[]>([]);

  React.useEffect(() => {
    async function getWorkspaces() {
      setItems(await composeItems());
    }
    getWorkspaces();
  }, []);

  const handleSelect = (item: Item) => {
    setCmd(item.value);
    try {
      execSync(item.value, {
        stdio: "inherit",
      });
    } catch (err) {
      process.exit(0);
    }
  };

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>What do you want to run?</Text> <Color green>{cmd}</Color>
      </Box>
      {!cmd && (
        <SelectInput
          limit={10}
          items={items}
          onSelect={handleSelect as any}
          itemComponent={NpmScript as any}
        />
      )}
      {/* {cmd && (
        <Box>
          <Box marginRight={1}>Enter your query:</Box>
          <UncontrolledTextInput
            onSubmit={() => {
              // useKeyHandler((_str, key) => {
              //   console.log("TCL: App -> key", key.name);
              //   if (key.ctrl && key.name === "c") {
              //     process.exit(0);
              //   }
              // });
              // execSync(cmd, {
              //   stdio: "inherit",
              // });
              // process.exit(0);
            }}
          />
        </Box>
      )} */}
    </Box>
  );
};

const renderApp = () => render(<App />);

export { renderApp };
