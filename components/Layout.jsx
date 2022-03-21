import Link from "next/link";
import Account from "./Account/Account";
import { useMoralis } from "react-moralis";
import Authenticate from "../components/Lens/Authenicate";
import { useContext } from "react";
import LensContext from "./LensContext";

const Layout = ({ children, home }) => {
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);

  return (
    <div>
      <nav className="top-hud">
        <Account />
        {account && isAuthenticated && <Authenticate />}
        {account && isAuthenticated && isLensReady && (
          <a class="hud3" href="/dashboard">Dashboard</a>)}
        {account && isAuthenticated && isLensReady && (  
          <a class="hud3" href="/profiles">Profiles</a>)}
        {account && isAuthenticated && isLensReady && (
        <a class="hud4" href="/profiles/create-profile">Create Profile</a>)}
      </nav>
      <main>{children}</main>
      <nav class="bottom-hud">
      {account && (<div class="huda"> 🔥 Gas</div>)} 
      {account && (<div class="hudb"> ⚡ Energy</div>)}
      {account && (<div class="hudb"> 💽 Chips</div>)}
      {account && (<div class="hudc"> 🪨 Carbon</div>)}  
    </nav>
    </div>
  );
};

export default Layout;
