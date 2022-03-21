import { useMoralis } from "react-moralis";
import { useState } from "react";
import Authenticate from "./Lens/Authenicate";




const Login = () => {
  const { account, isAuthenticated } = useMoralis();
  const [isLensAPIAuthenticated, setLensAPIAuthenticated] = useState(false);

  return <div class="MainScreen">
    <div class="MainBoard">
      <div class="Board1">Friends</div>
      <div class="Board2">Punk Cities Places</div>
      <div class="Board3">Feed</div>
      <div class="Board2">My post</div>
    </div>
  </div>;
};

export default Login;
