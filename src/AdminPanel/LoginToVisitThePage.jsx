import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginToVisitThePage = () => {
  const navigate = useNavigate();
  const login = () => {
    navigate('/admin-panel');
  };
  return (
    <div className='login_first'>
      <h1>Please login before visiting the page!</h1>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default LoginToVisitThePage;
