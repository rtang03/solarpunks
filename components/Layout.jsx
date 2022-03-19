import Link from "next/link";
import Account from "./Account/Account";

export default function Layout({ children, home }) {
  return (

    <div>
    <nav >
      <div><a>Twitter</a></div>
      <div>Location</div>
      <div> ENS / <Account /></div>
      <div>Balance</div>
      <div> ⚡ Emergy Units</div>
      <div> 💽 Chips Units</div>
      <div> 🪨 Carbon</div>      
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
