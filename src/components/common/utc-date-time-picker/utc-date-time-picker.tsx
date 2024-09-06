import React, { useState } from "react";

import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

import type { SxProps, TextFieldProps } from "@mui/material";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

type Props = {
  value: Date;
  label: string;
  onChange: (value: string) => void;
  sx?: SxProps;
  variant?: TextFieldProps["variant"];
  size?: TextFieldProps["size"];
};

export const UtcDateTimePicker = (props: Props) => {
  const { value, label, variant, size, onChange, sx } = props;
  const [isChangingByDirectInput, setIsChangingByDirectInput] = useState(false);

  const handleChangeDate = (newValue: dayjs.Dayjs | null) => {
    if (!newValue || isChangingByDirectInput) return;

    try {
      const utcValue = newValue.utc().format(); // ISO string format
      onChange(utcValue);
    } catch (error) {
      // empty
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setIsChangingByDirectInput(true);
    try {
      const parsedDate = dayjs.utc(inputValue, "DD/MM/YYYY HH:mm", true);
      onChange(parsedDate.format());
    } catch (error) {
      // empty
    } finally {
      setTimeout(() => setIsChangingByDirectInput(false), 0); // Delay resetting the flag to allow for state updates
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
      <DateTimePicker
        value={dayjs.utc(value)}
        onChange={handleChangeDate}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={sx}
            label={label}
            InputLabelProps={{ shrink: true }}
            error={false}
            size={size ?? "small"}
            variant={variant ?? "standard"}
            onChange={handleInputChange}
          />
        )}
      />
    </LocalizationProvider>
  );
};
