import { React, useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import BaseColor from "../config/color";
import {  getDueTasks  } from "../service/api";
import CancelIcon from '@mui/icons-material/Cancel';

export default function TAskCompleted() {
  const [taskData, setTaskData] = useState("");
  const [loading, setLoading] = useState(false);
  const { username } = useSelector((state) => state.auth);
  const { userid } = useSelector((state) => state.auth);

  useEffect(() => {
    getTaskData();
    setLoading(true);
  }, []);

  const getTaskData = async () => {
    const res = await getDueTasks(userid, username);
    console.log("username =====>>>>> ", username);
    setTaskData(res?.data?.dueTasks);
    setLoading(false);
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
      field: "createdAt",
      headerName: "ASSIGNED AT",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <Typography>{params.value}</Typography>;
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
      headerName: "STATUS",
      align: "center",
      headerAlign: "center",
      renderCell: () => (
        <Tooltip title="Task Due" placement="right">
        <CancelIcon
          sx={{ cursor: "pointer", color: BaseColor.error }}
        />
      </Tooltip>
      ),
    },
  ];

  return (
    <Grid container>
      <Grid justifyContent={"center"} container sx={{ mt: 2 }}>
        <div>
          <DataGrid
            rows={taskData}
            columns={columns}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </Grid>
    </Grid>
  );
}
