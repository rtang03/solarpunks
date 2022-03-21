import Link from "next/link";
import Account from "./Account/Account";
import { useMoralis } from "react-moralis";
import { useState } from "react";
import Authenticate from "../components/Lens/Authenicate";
import MainBoard from "../components/MainBoard"


export default function Layout({ children, home }) {
  const { account, isAuthenticated } = useMoralis();
  const [isLensAPIAuthenticated, setLensAPIAuthenticated] = useState(false);

  return (

  <div class="border-none">

    <nav class='top-hud'>
      <div class="hud1"> <Account /></div>
      {account && (<Authenticate authenicationCallback={setLensAPIAuthenticated} /> )}
      {account && (<div class='hud4'>My Lens profile</div>)}
    </nav>
    <nav class="bottom-hud">
      {account && (<div class="huda"> 🔥 Gas</div>)} 
      {account && (<div class="hudb"> ⚡ Energy</div>)}
      {account && (<div class="hudb"> 💽 Chips</div>)}
      {account && (<div class="hudc"> 🪨 Carbon</div>)}  
    </nav>

    <main><MainBoard/></main>
    {!home && (
      <div>
        <Link href="/">
          <a>← Back to home</a>
        </Link>
      </div>
    )}
  </div>
 
  );

}
