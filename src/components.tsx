import React from "react";
import { Box, Text, Color } from "ink";
import { ItemProps } from "ink-select-input";
import { Item } from "./workspaces";

const NpmScript: React.FunctionComponent<Item & ItemProps> = props => {
  const { label, divider, preview, location } = props;

  if (divider) {
    return (
      <Divider location={location} preview={preview}>
        {label}
      </Divider>
    );
  }

  return (
    <Box flexDirection="column">
      <Text>
        <Color green> {label} </Color>
      </Text>
      {preview && (
        <Box>
          <Text>
            {" "}
            <Color gray> ↳ {preview} </Color>
          </Text>
        </Box>
      )}
    </Box>
  );
};

const Divider: React.FunctionComponent<{
  location?: string;
  preview?: string;
}> = ({ children, location, preview }) => (
  <Box flexDirection="column" flexGrow={1}>
    <Box flexDirection="row" flexGrow={1} justifyContent="space-between">
      <Box>
        <Color cyan>
          <Text bold underline>
            {children}
          </Text>
        </Color>
        <Color gray> ⇢ {preview} </Color>
      </Box>
      <Box>
        <Color blue>{location} </Color>
      </Box>
    </Box>
  </Box>
);

export { NpmScript, Divider };
