import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Profile from "../../components/Profile";
import { useMoralis } from "react-moralis";
import ConnectWalletMessage from "../../components/ConnectWalletMessage";
import Link from "next/link";
const ProfilePage = () => {
  const { account, isAuthenticated } = useMoralis();
  const router = useRouter();
  const handle = router.query.handle;

  return (
    <Layout>
      {account && isAuthenticated ? (
        <>
          <Link href={`/profiles/${handle}/publications`}>
            <button className="bg-blue-300">
              <a>Go to my publication</a>
            </button>
          </Link>
          <Profile handle={handle} dev={true} />
        </>
      ) : (
        <ConnectWalletMessage />
      )}
    </Layout>
  );
};

export default ProfilePage;
