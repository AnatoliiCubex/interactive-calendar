import type { ThemeOptions } from "@mui/material";

export const components: ThemeOptions["components"] = {
  // MuiOutlinedInput: {
  //   styleOverrides: {
  //     input: {
  //       padding: "10px 20px !important",
  //       borderRadius: "10px",
  //     },
  //     root: {
  //       borderRadius: "10px",
  //       "& .MuiOutlinedInput-notchedOutline": {
  //         borderColor: "primary.main", // Default border color
  //       },
  //       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //         borderColor: "primary.main",
  //       },
  //       "&:hover .MuiOutlinedInput-notchedOutline": {
  //         borderColor: "primary.main",
  //       },
  //     },
  //   },
  // },
  // MuiInputLabel: {
  //   styleOverrides: {
  //     root: {
  //       "&.MuiFormLabel-root.MuiInputLabel-outlined": {
  //         transform: "translate(20px, 10px) scale(1)",
  //         "&.MuiInputLabel-shrink": {
  //           transform: "translate(14px, -8px) scale(0.75)",
  //         },
  //       },
  //     },
  //   },
  // },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        // width: "fit-content",
        // borderRadius: "10px",
      },
      // default size
      // sizeMedium: {
      //   padding: "11px 20px",
      //   fontSize: "14px",
      // },
    },
    defaultProps: {
      variant: "contained",
    },
  },
  MuiTypography: {
    styleOverrides: {
      h1: { fontSize: "44px", lineHeight: "66px", fontWeight: "700" },
      h2: { fontSize: "32px", lineHeight: "48px", fontWeight: "400" },
      h3: { fontSize: "24px", lineHeight: "36px", fontWeight: "400" },
      h4: { fontSize: "18px", lineHeight: "27px", fontWeight: "500" },
      body1: { fontSize: "16px", lineHeight: "24px", fontWeight: "500" }, // default typography
      subtitle1: { fontSize: "14px", lineHeight: "21px", fontWeight: "500" },
      subtitle2: { fontSize: "12px", lineHeight: "18px", fontWeight: "500" },
    },
  },
  //   defaultProps: {
  //     variantMapping: {
  //       subtitle1: "span",
  //       subtitle2: "span",
  //       body1: "span",
  //       body2: "span",
  //       caption: "span",
  //       overline: "span",
  //     },
  //   },
  // },
};
