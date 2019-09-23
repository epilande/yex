import { execSync } from "child_process";
import React from "react";
import { render, Box, Text, Color } from "ink";
import SelectInput from "ink-select-input";
import { UncontrolledTextInput } from "ink-text-input";
import { composeItems, Item } from "./workspaces";
import { NpmScript } from "./components";

const App = () => {
  const [step, setStep] = React.useState(0);
  const [cmd, setCmd] = React.useState("");
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
        <Color green>{cmd}</Color>
      </Box>
      {step === 0 && (
        <SelectInput
          limit={10}
          items={items}
          itemComponent={NpmScript as any}
          onSelect={item => {
            setStep(1);
            setCmd(item.value as string);
          }}
        />
      )}
      {step === 1 && (
        <Box>
          <Box marginRight={1}>
            <Text bold>Additional arguments?</Text>
          </Box>
          <UncontrolledTextInput
            onSubmit={value => {
              const newCmd = `${cmd} ${value}`;
              setStep(2);
              setCmd(newCmd);

              try {
                execSync(newCmd, {
                  stdio: "inherit",
                });
              } catch (err) {
                process.exit(0);
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

const renderApp = () => render(<App />);

export { renderApp };
