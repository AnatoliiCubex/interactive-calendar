import type { SxProps } from "@mui/material";

// import img from "../../../../public/images/background.png";

export const useHomeViewStyle = () => {
  const wrapper: SxProps = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // width: "100dvw",
    // height: "100dvh",
    // padding: 5,
    // background: `url(${img.src}) no-repeat center center fixed`,
    // backgroundSize: "cover",
  };

  const content: SxProps = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
  };

  return { wrapper, content };
};
