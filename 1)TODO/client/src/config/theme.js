import { purple } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
const whiteColor = '#fff'
const theme = createTheme({
  palette: {
    primary: {
      main: purple[800],
    },
    secondary: {
      main:whiteColor,
    },
  },
});
export default theme;
