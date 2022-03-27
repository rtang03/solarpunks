import Layout from "../components/Layout";
import { useMoralis } from "react-moralis";
import Link from "next/link";

const Home = () => {
  const { account, isAuthenticated } = useMoralis();

  return (
    <Layout home={true}>
      <div className="flex min-h-screen flex-col items-center justify-center">
        {/* <div className="mt-32">
          <Link href="/new-place">
            <a>NewPost</a>
          </Link>
        </div> */}
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <div className="grid grid-cols-2 mt-48">
          <img
            src="https://punkcities.mypinata.cloud/ipfs/QmTBBj3qefdZWHM1aRgeYQFaih7iy2HXYA4r4JKVyNDguh"
            className="animate-bounce"
          />
          <div className="justify-items-center text-right mt-40">
            <div className=" text-5xl mx-10 font-exo items-center items-center text-night-100">
              Decentralized Social Network for <span className="text-white hover:text-cyber-100 cursor-pointer">Punk Cities</span> based on Lens Protocol
            </div>
            <div>
            
            </div>
            
            <div className="text-2xl mx-10 font-exo text-right mt-20 text-white">Developed @</div>
            <div className="text-8xl mx-10 text-green-900 font-black hover:animate-pulse">
              <Link className="" href={"https://showcase.ethglobal.com/lfgrow/solarpunks-86vjx"}>LFGrow 2022</Link>
            </div>
          </div>
          </div>
          <div className="h-screen">
          <div className="text-8xl mx-10 text-cyber-100 font-black hover:animate-pulse">Build with:</div>
            <div className="grid grid-cols-6 gap-5 mt-20 text-white text-2xl font-exo">
            <div className="bg-cyber-100 rounded-lg p-5">1. Love</div>
            <div className="bg-cyber-100 rounded-lg p-5">2. Lens-API latest</div>
            <div className="bg-cyber-100 rounded-lg p-5">3. NodeJs >= 14.x</div>
            <div className="bg-cyber-100 rounded-lg p-5">4. NextJs 12.x</div>
            <div className="bg-cyber-100 rounded-lg p-5">5. Tailwindcss v3.x</div>
            <div className="bg-cyber-100 rounded-lg p-5">6. Solidity latest</div>
            <div className="bg-cyber-100 rounded-lg p-5">7. Moralis SDK</div>
            <div className="bg-cyber-100 rounded-lg p-5">8. EthersJs v5.x</div>
            <div className="bg-cyber-100 rounded-lg p-5">9. Apollo client v3.x</div>
            <div className="bg-cyber-100 rounded-lg p-5">10. Metamask</div>
            <div className="bg-cyber-100 rounded-lg p-5">11. Moralis</div>
            <div className="bg-cyber-100 rounded-lg p-5">12. NFT.storage</div>
          </div>
          <div className="text-8xl mx-10 text-solar-100 font-black hover:animate-pulse mt-20">Team</div>
            <div className="grid grid-cols-3 gap-5 mt-20 text-white text-2xl font-exo justify-items-center">
            <div className="p-5 text-solar-100"><img src="https://avatars.githubusercontent.com/u/7686266?v=4" className="bg-solar-100 rounded-full h-60 w-60 mb-5"></img>
            <Link href={"https://github.com/rtang03"}>rtang03</Link>
            </div>
            <div className="p-5 text-solar-100"><img src="https://avatars.githubusercontent.com/u/57845110?s=400&u=5460231e3addfd30b2f4f35650c81206e3d7552f&v=4" className="bg-solar-100 rounded-full h-60 w-60 mb-5"></img>
            <Link href={"https://github.com/HabacucMX"}>habacuc.eth</Link>
            </div>
            <div className="p-5 text-solar-100"><img src="https://avatars.githubusercontent.com/u/36043359?v=4" className="bg-solar-100 rounded-full h-60 w-60 mb-5"></img>
            <Link href={"https://github.com/alessandromaci"}>alessandromaci</Link></div>
          </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Home;
