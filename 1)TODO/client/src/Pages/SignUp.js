import React, { useState } from "react";
import { Button, TextField, Typography, Container } from "@mui/material";
import { signUp } from "../service/api";
import { toast } from "react-toastify";
import moment from "moment";

const Signup = ({onSignUpDone}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const sendDataToParent = () => {
    onSignUpDone(true);
  };
  const handleSignup = () => {
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    } else {
      const data = {
        username: username,
        password: password,
        role:'user',
        taskCompleted:0,
        accountCreatedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
      };

      signUp(data)
        .then((response) => {
          if (response?.status) {
            toast("User Registered", { type: "success" });
            sendDataToParent()
          } else {
            toast("Username Already exist", { type: "error" });
          }
        })
        .catch((error) => {
          console.log("error =====>>>>> ", error);
          console.error("Error:", error);
          toast(error.message, { type: "error" });
        });
    }

    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <Container>
      <Typography variant="h4">Signup For User</Typography>
      <TextField
        label="Username"
        margin="normal"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        margin="normal"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        onClick={handleSignup}
        variant="contained"
        color="primary"
        type="submit"
      >
        Signup
      </Button>
    </Container>
  );
};

export default Signup;
