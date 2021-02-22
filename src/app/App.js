import React from 'react';
import {useSelector} from "react-redux";
import {selectIsUserLogedIn} from "./features/userSlice"

import Login from "./../components/Login/Login"
import Dasboard from "./../components/Dashboard/Dashboard"

function App() {
  const isLoginIn = useSelector(selectIsUserLogedIn);

  return (
    <div data-testid="appId" className="App">
      {isLoginIn ? <Dasboard /> : <Login />}
    </div>
  );
}

export default App;
