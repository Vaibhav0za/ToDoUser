import React, { useState } from 'react';
import { Button, CssBaseline, Container } from '@mui/material';
import Signup from './SignUp';
import Login from './Login';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleData = (childData) => {
    setIsLogin(childData)
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {isLogin ? <Login /> : <Signup onSignUpDone = {handleData} />}
      <Button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Signup' : 'Switch to Login'}
      </Button>
    </Container>
  );
};

export default App;
