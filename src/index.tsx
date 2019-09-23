import { execSync } from "child_process";
import React from "react";
import { render, Box, Text, Color } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import { composeItems, filterItems, Item } from "./utils";
import { NpmScript } from "./components";

const App = () => {
  const [step, setStep] = React.useState(0);
  const [cmd, setCmd] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [items, setItems] = React.useState<Item[]>([]);

  React.useEffect(() => {
    async function getWorkspaces() {
      setItems(await composeItems());
    }
    getWorkspaces();
  }, []);

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>Which command do you want to run?</Text>{" "}
        <Color green>
          {step === 0 && (
            <TextInput value={query} onChange={value => setQuery(value)} />
          )}
          {step === 1 ? (
            <TextInput
              value={cmd}
              onChange={value => setCmd(value)}
              onSubmit={value => {
                setStep(2);
                try {
                  execSync(value, {
                    stdio: "inherit",
                  });
                } catch (err) {
                  process.exit(0);
                }
              }}
            />
          ) : (
            cmd
          )}
        </Color>
      </Box>
      {step === 0 && (
        <SelectInput
          limit={10}
          items={filterItems(query, items)}
          itemComponent={NpmScript as any}
          onSelect={item => {
            setCmd(`${item.value} `);
            setStep(1);
          }}
        />
      )}
    </Box>
  );
};

const renderApp = () => render(<App />);

export { renderApp };
