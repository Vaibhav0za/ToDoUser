import { React, useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Avatar,
  ListItemIcon,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import BaseColor from "../config/color";
import {
  getTasks,
  updateTaskStatus,
  completeTaskValue,
  dueTask,
} from "../service/api";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import GridViewIcon from "@mui/icons-material/GridView";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import Logout from "@mui/icons-material/Logout";
import TAskCompleted from "./TaskCompleted";
import CModal from "../Components/CAutoComplete/CModal";
import moment from "moment";
import Profile from "./Profile";
import DueTask from "./dueTask";

const statusOptions = [
  { id: 1, icon: <RestartAltIcon />, name: "On Going", color: BaseColor.info },
  { id: 2, icon: <TaskAltIcon />, name: "Completed", color: BaseColor.success },
];

export default function AddToDo() {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.auth);
  const { userid } = useSelector((state) => state.auth);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDueTask, setShowDueTask] = useState(false);
  const [joinDate, setJoinDate] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();

  useEffect(() => {
    getTaskData();
    setLoading(true);
  }, []);

  const getTaskData = async () => {
    let res = await getTasks(userid, username);
    setTaskData(res?.data?.tasks);
    setJoinDate(res?.data?.userVal?.joinDate);
    setLoading(false);

    // toast(res?.data?.message , { type: "success" });
  };

  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    navigate("/");
    window.location.reload();
    toast("User logout", { type: "success" });
  };

  const checkExpiredTasks = () => {
    taskData.map((task, i) => {
      if (task?.deadLine !== "") {
        const formatedExpireDate = moment(task?.deadLine).format(
          "MMMM Do YYYY  h:mm:ss a"
        );

        if (task.createdAt > formatedExpireDate) {
          const data = {
            username: username,
            status: "due",
          };
          dueTask(task._id, data);
        } else if (task.createdAt < formatedExpireDate) {
        } else {
          return null;
        }
      }
    });
  };
  checkExpiredTasks();

  const RowOptions = ({ id, taskList }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);

    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };
    const handleStatus = (status, id) => {
      const data = {
        status,
        username,
      };
      if (status === "On Going") {
        data.actionTime = moment().format("MMMM Do YYYY, h:mm:ss a");
      } else {
        data.endTime = moment().format("MMMM Do YYYY, h:mm:ss a");
        completeTaskValue(userid, 1);
      }
      updateTaskStatus(id, data)
        .then((response) => {
          if (response?.status) {
            toast(response.data.message, { type: "success" });
            setAnchorEl(null);
            getTaskData();
            setLoading(true);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast(error.message, { type: "error" });
          setLoading(true);
        });
    };

    return (
      <>
        {taskList.length === 0 ? (
          <Tooltip title="Action Required" placement="right" arrow>
            <GridViewIcon
              sx={{ cursor: "pointer", color: BaseColor.primary }}
              onClick={handleRowOptionsClick}
            />
          </Tooltip>
        ) : (
          taskList.map((task, i) => {
            if (task.username === username) {
              if (task.status === "On Going") {
                return (
                  <Tooltip title="On Going" placement="right">
                    <RestartAltIcon
                      key={task.id}
                      sx={{ cursor: "pointer", color: BaseColor.info }}
                      onClick={handleRowOptionsClick}
                    />
                  </Tooltip>
                );
              } else {
                return (
                  <Tooltip title="Task Completed" placement="right">
                    <TaskAltIcon
                      key={task.id}
                      sx={{ cursor: "pointer", color: BaseColor.success }}
                    />
                  </Tooltip>
                );
              }
            }

            return null;
          })
        )}

        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{ style: { minWidth: "8rem" } }}
        >
          {statusOptions.map((val) => {
            return (
              <MenuItem
                key={val.id}
                onClick={() => handleStatus(val.name, id)}
                sx={{ "& svg": { mr: 2 }, color: val.color }}
                disabled={
                  taskList.length === 0 && val.name === "Completed"
                    ? true
                    : taskList.some((task) =>
                        task.status === val.name ? true : false
                      )
                }
              >
                {val.icon}
                {val.name}
              </MenuItem>
            );
          })}
        </Menu>
      </>
    );
  };
  const columns = [
    {
      field: "id",
      headerName: "NO.",
      flex: 0.2,
      minWidth: 70,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        const newStartIndex = 1;
        taskData.map((data, i) => {
          data.serialNumber = i + newStartIndex;
        });
        return <Typography>{params?.row?.serialNumber}</Typography>;
      },
    },
    {
      field: "taskName",
      headerName: "TASK",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taskPriority",
      headerName: "TASK PRIORITY",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Chip
            sx={{
              color:
                params?.row?.taskPriority === "Low"
                  ? BaseColor.info
                  : params?.row?.taskPriority === "Medium"
                  ? BaseColor.success
                  : params?.row?.taskPriority === "Higher"
                  ? BaseColor.warning
                  : BaseColor.error,
              background:
                params?.row?.taskPriority === "Low"
                  ? `${BaseColor.info}1A`
                  : params?.row?.taskPriority === "Medium"
                  ? `${BaseColor.success}1A`
                  : params?.row?.taskPriority === "Higher"
                  ? `${BaseColor.warning}1A`
                  : `${BaseColor.error}1A`,
              fontWeight: "bold",
            }}
            label={params?.row?.taskPriority}
          />
        );
      },
    },

    {
      field: "createdAt",
      headerName: "ASSIGNED AT",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <Typography>{params.value}</Typography>;
      },
    },
    {
      field: "deadLine",
      headerName: "EXPIRING IN",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Typography>
            {params?.row?.deadLine
              ? moment(params?.row?.deadLine).format("MMMM Do YYYY  h:mm:ss a")
              : "No Deadline"}
          </Typography>
        );
      },
    },
    {
      field: "createdBy",
      headerName: "ASSIGNED BY",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <Typography>{params.value}</Typography>;
      },
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: "actions",
      headerName: "ACTION",
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <RowOptions
          taskCompletedValue={row?.taskCompleted}
          taskList={row?.taskStatus}
          id={row?._id}
        />
      ),
    },
  ];

  return (
    <Grid container>
      <Grid
        backgroundColor={theme.palette.primary.main}
        container
        p={2}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant="h4" sx={{ color: "white", textAlign: "center" }}>
          {"Hello " + username + " " + taskData.length + " task left "}
        </Typography>
        <Grid item>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <Tooltip title="Profile">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    color: BaseColor.primary,
                    backgroundColor: BaseColor.white,
                    fontWeight: "bolder",
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                setShowProfile(true);
                handleClose();
              }}
            >
              <Avatar /> Profile
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleClose();
                setShowCompleteModal(true);
              }}
            >
              <ListItemIcon>
                <TaskAltIcon />
              </ListItemIcon>
              Completed Task
            </MenuItem>
            <MenuItem
              onClick={() => {
                setShowDueTask(true);
                handleClose();
              }}
            >
              <ListItemIcon>
                <PlaylistRemoveIcon />
              </ListItemIcon>
              Due Task
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>

      <Grid justifyContent={"center"} container sx={{ mt: 5 }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "50vh",
            }}
          >
            <CircularProgress style={{ color: BaseColor.primary }} size={30} />
          </div>
        ) : (
          <Grid>
            <DataGrid
              sx={{ height: 500 }}
              rows={taskData}
              columns={columns}
              getRowId={(row) => row._id}
              disableRowSelectionOnClick
              hideFooterPagination
              hideFooter
              disableAutosize
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </Grid>
        )}
      </Grid>
      <Grid>
        <CModal
          visible={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          title={"Completed Task List"}
          children={
            <Grid sx={{ background: "white", p: 3 }} container>
              <TAskCompleted />
            </Grid>
          }
        />
      </Grid>
      <Grid>
        <CModal
          visible={showProfile}
          onClose={() => setShowProfile(false)}
          title={"User Profile"}
          children={
            <Grid sx={{ background: "white", p: 3 }} container>
              <Profile taskData={taskData} joinedDate={joinDate} />
            </Grid>
          }
        />
      </Grid>
      <Grid>
        <CModal
          visible={showDueTask}
          onClose={() => setShowDueTask(false)}
          title={"Due Task List"}
          children={
            <Grid sx={{ background: "white", p: 3 }} container>
              <DueTask />
            </Grid>
          }
        />
      </Grid>
    </Grid>
  );
}
