import { type ReactNode } from "react";

import { type EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import theme from "~/theme/theme";

type Props = {
  emotionCache: EmotionCache;
  children: ReactNode;
};

export function ThemeProvider(props: Props) {
  const { emotionCache, children } = props;

  return (
    <CacheProvider value={emotionCache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
