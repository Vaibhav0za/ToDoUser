import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const statusOptions = [
  { id: 1, icon: <RestartAltIcon />, name: "On Going" },
  { id: 2, icon: <TaskAltIcon />, name: "Completed" },
];
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    // color:add here color as status,
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
  },
}));

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        variant="outlined"
        onClick={handleClick}
        sx={{ padding: "2px 6px" }}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <GridViewIcon />
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {statusOptions.map((val, i) => [
          <MenuItem key={val.id} onClick={handleClose}>
            {val.icon}
            {val.name}
          </MenuItem>,
          i !== statusOptions.length - 1 && (
            <Divider key={`divider-${i}`} sx={{ my: 0.2 }} />
          ),
        ])}
      </StyledMenu>
    </div>
  );
}
