import React, { useState } from "react";
import { Button, TextField, Typography, Container } from "@mui/material";
import { login } from "../service/api";
import { useDispatch } from "react-redux";
import { setToken, setUserName, setUserId } from "../Redux/authAction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    } else {
      const data = { username: username, password: password };

      login(data)
        .then((response) => {
          if (response?.status) {
            const { token, username, id } = response.data;
            console.log("Id:", id);
            dispatch(setToken(token));
            dispatch(setUserName(username));
            dispatch(setUserId(id));
            toast("User Logged In", { type: "success" });
            navigate("/add");
          } else {
            toast("Invalid password", { type: "error" });
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log("error =====>>>>> ", error);
          console.error("Error:", error);
          toast(error.message, { type: "error" });
          setLoading(false);
        });
    }

    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <Container>
      <Typography variant="h4">Login For User</Typography>
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
        disabled={loading}
        onClick={handleLogin}
        variant="contained"
        color="primary"
        type="submit"
      >
        {loading ? "Logging In..." : "Login"}
      </Button>
    </Container>
  );
};

export default Login;
