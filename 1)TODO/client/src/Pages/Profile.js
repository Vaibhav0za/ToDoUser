import { React, useState, useEffect } from "react";
import { Grid, Avatar, Typography, Chip } from "@mui/material";
import BaseColor from "../config/color";
import { useSelector } from "react-redux";
import { getCompleteTasks, getDueTasks } from "../service/api";
import moment from "moment";

export default function Profile(props) {
  const { joinedDate, taskData } = props;
  const joinedDateString = joinedDate.split(",")[0];

  const { username, userid } = useSelector((state) => state.auth);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [dueTasks, setDueTasks] = useState([]);
  const [todayTaskAssigned, setTodayTaskAssigned] = useState(0);
  const [todayTaskCompleted, setTodayTaskCompleted] = useState(0);
  const [todayTaskDue, setTodayTaskDue] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const res = await getCompleteTasks(userid, username);
      const resDue = await getDueTasks(userid, username);

      if (isMounted) {
        setCompletedTasks(res?.data?.completedTasks);
        getTodayTaskAssigned();
        getTodayCompletedTasks(res?.data?.completedTasks);
        getTodayDueTasks(resDue?.data?.dueTasks);
        setDueTasks(resDue?.data?.dueTasks);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getTodayTaskAssigned = () => {
    const todaydate = moment().format("MMMM Do YYYY");
    taskData.map((val) => {
      console.log(val?.createdAt.split(",")[0], todaydate);
      if (val?.createdAt.split(",")[0] === todaydate) {
        setTodayTaskAssigned((prevCount) => prevCount + 1);
      }
    });
  };

  const getTodayCompletedTasks = (data) => {
    const todaydate = moment().format("MMMM Do YYYY");
    data.map((val) => {
      if (val.taskStatus[0].endTime.split(",")[0] === todaydate) {
        setTodayTaskCompleted((prevCount) => prevCount + 1);
      }
    });
  };

  const getTodayDueTasks = (data) => {
    const todaydate = moment().format("MMMM Do YYYY");
    data.map((val) => {
      const formatedExpireDate = moment(val?.deadLine).format("MMMM Do YYYY");

      if (formatedExpireDate === todaydate) {
        setTodayTaskDue((prevCount) => prevCount + 1);
      }
    });
  };
  const totalAssignedTasks = taskData.length + completedTasks.length + dueTasks.length;
  const totalCompletedTasks = completedTasks.length;
  const totalDueTasks = dueTasks.length;
  return (
    <Grid container>
      <Grid flexDirection={"column"} alignItems={"center"} container>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            color: BaseColor.white,
            backgroundColor: BaseColor.primary,
            fontWeight: "bolder",
            fontSize: 40,
          }}
        >
          {username.charAt(0).toUpperCase()}
        </Avatar>
        <Grid item>
          <Typography
            sx={{
              fontSize: 25,
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            {username}
          </Typography>
        </Grid>
      </Grid>

      <Grid alignItems={"center"} justifyContent={"center"} gap={1} container>
        <Grid
          sx={{
            fontSize: 15,
            textTransform: "capitalize",
            fontWeight: "bold",
          }}
        >
          <Chip
            sx={{ color: BaseColor.primary }}
            label={`User Joined on: ${joinedDateString}`}
          />
        </Grid>
      </Grid>
      <Grid gap={2} mt={2} flexDirection={"column"} container>
        <Grid sx={{ display: "flex", justifyContent: "space-evenly" }} item>
          <Chip
            sx={{ color: BaseColor.info }}
            label={`Total Task Assigned:${
              totalAssignedTasks > 9
                ? totalAssignedTasks
                : "0" + totalAssignedTasks
            }`}
          />
          <Chip
            sx={{ color: BaseColor.info }}
            label={`Today Task Assigned:${
              todayTaskAssigned > 9
                ? todayTaskAssigned
                : "0" + todayTaskAssigned
            }`}
          />
        </Grid>

        <Grid sx={{ display: "flex", justifyContent: "space-evenly" }} item>
          <Chip
            sx={{ color: BaseColor.success }}
            label={`Total Task Completed:${
              totalCompletedTasks > 9
                ? totalCompletedTasks
                : "0" + totalCompletedTasks
            }`}
          />
          <Chip
            sx={{ color: BaseColor.success }}
            label={`Today Task Completed:${
              todayTaskCompleted > 9
                ? todayTaskCompleted
                : "0" + todayTaskCompleted
            }`}
          />
        </Grid>

        <Grid
          sx={{ display: "flex", justifyContent: "space-evenly", gap: 10 }}
          item
        >
          <Chip
            sx={{ color: BaseColor.error }}
            label={`Total Task Due:${
              totalDueTasks > 9 ? totalDueTasks : "0" + totalDueTasks
            }`}
          />
          <Chip
            sx={{ color: BaseColor.error }}
            label={`Today Task Due:${
              todayTaskDue > 9 ? todayTaskDue : "0" + todayTaskDue
            }`}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
