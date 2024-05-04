import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function OutlinedButtons({text}) {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Button variant="contained"type="submit" >{text}</Button>
    </Stack>
  );
}
