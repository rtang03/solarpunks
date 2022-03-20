import Link from "next/link";
import Account from "./Account/Account";

export default function Layout({ children, home }) {
  return (

    <div class="border-none">
    <nav class='top-hud'>
      <div class='hud1'>Twitter</div>
      <div class="hud2">Location</div>
      <div class="hudb"> <Account /></div>
      <div class="hud3">Balance</div>
      <div class="hud2"> ⚡ Energy</div>
      <div class="hud2"> 💽 Chips</div>
      <div class="hud4"> 🪨 Carbon</div>      
    </nav>
    <main>{children}</main>
    {!home && (
      <div>
        <Link href="/">
          <a>← Back to home</a>
        </Link>
      </div>
    )}
    <nav>
      <div ><a>Docs</a></div>
      <div></div>
      <div ><a>Discord</a></div>
    </nav>
  </div>
 
  );
    
  
  //return (
  //  <div>

  //    <nav className="container bg-gray-300 py-5">
  //      <Account />
  //    </nav>


  //    <main>{children}</main>
  //    {!home && (
  //      <div>
  //        <Link href="/">
  //          <a>← Back to home</a>
  //        </Link>
  //      </div>
  //    )}
  //  </div>
  //);
}
