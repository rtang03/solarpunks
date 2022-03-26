import Layout from "../components/Layout";
import ConnectWalletMessage from "../components/ConnectWalletMessage";
import LensContext from "../components/LensContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import { useQueryPuckCitiesMetadata } from "../hooks/useQueryPuckCitiesMetadata";
import { FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

const PUNKCITIES_ADDRESS = "0x092BBe9022D421940B6D74799179267e5c822895";

const Dashboard = () => {
  const { friendList, setFriendList, isLensReady } = useContext(LensContext);
  const { account, isAuthenticated } = useMoralis();
  const [city0, setCity0] = useState();
  const [city1, setCity1] = useState();
  const [city2, setCity2] = useState();
  const [city3, setCity3] = useState();
  const [city4, setCity4] = useState();
  const [city5, setCity5] = useState();

  // query cities
  const { citiesMetadataloading: loading0, citiesMetadataError: error0 } =
    useQueryPuckCitiesMetadata(setCity0, PUNKCITIES_ADDRESS, 0);
  const { citiesMetadataloading: loading1, citiesMetadataError: error1 } =
    useQueryPuckCitiesMetadata(setCity0, PUNKCITIES_ADDRESS, 1);
  const { citiesMetadataloading: loading2, citiesMetadataError: error2 } =
    useQueryPuckCitiesMetadata(setCity0, PUNKCITIES_ADDRESS, 2);
  const { citiesMetadataloading: loading3, citiesMetadataError: error3 } =
    useQueryPuckCitiesMetadata(setCity0, PUNKCITIES_ADDRESS, 3);
  const { citiesMetadataloading: loading4, citiesMetadataError: error4 } =
    useQueryPuckCitiesMetadata(setCity0, PUNKCITIES_ADDRESS, 4);
  const { citiesMetadataloading: loading5, citiesMetadataError: error5 } =
    useQueryPuckCitiesMetadata(setCity0, PUNKCITIES_ADDRESS, 5);

  error0 && console.error("fail to fetch city0", error0);
  error1 && console.error("fail to fetch city1", error1);
  error2 && console.error("fail to fetch city2", error2);
  error3 && console.error("fail to fetch city3", error3);
  error4 && console.error("fail to fetch city4", error4);
  error5 && console.error("fail to fetch city5", error5);

  console.log(city0);
  return (
    <Layout>
      <div className="MainCon">
        {!(account && isAuthenticated) && <ConnectWalletMessage />}
        {!(account && isAuthenticated && isLensReady) && (
          <div className="LensCon">
            <div className="LensIcon">🌿</div>Lens is not active
          </div>
        )}
      </div>
      {account && isAuthenticated && isLensReady && (
        <div className="MainScreen">
          <div className="MainBoard">
            <div className="Board1 divide-y-2">
              <div className="my-5">Friends</div>
              <div className="text-md py-2">
                {friendList?.map((friend, index) => (
                  <div key={index}>
                    <Link href={`/explore/${friend.replace("#", "%23")}`}>
                      <a>{friend}</a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="Board2 divide-y-2">
              <div className="my-5">My Post</div>
              <div className="text-md py-2"></div>
            </div>
            <div className="Board3 divide-y-2">
              {" "}
              <div className="my-5">Punk Cities Places</div>
              <div className="text-md py-2">
                <div className="border-2 text-left m-10">
                  <div>Name: {city0.name}</div>
                  <div>Desc: {city0.description}</div>
                  {city0.content && <div>Content: {city0.content}</div>}
                  <div>Tag: {city0.tag}</div>
                  <div>TokenID: {city0.tokenID}</div>
                  <div className="flex flex-row">
                    <span>
                      <FaMapMarkerAlt />
                    </span>
                    <span>
                      <a
                        className="m-2 p-2 underline text-night-100 hover:text-solar-100"
                        target="_blank"
                        rel="noreferrer"
                        href={city0.address}
                      >
                        Map
                      </a>
                    </span>
                  </div>
                  <div className="font-bold my-2">Attributes</div>
                  {city0.attributes?.map((attribute, index) => (
                    <div key={index}>
                      <div className="ml-5">trait_type: {attribute.trait_type}</div>
                      <div className="ml-5 mb-2">value: {attribute.value}</div>
                    </div>
                  ))}
                  <Image
                    width={256}
                    height={256}
                    src={city0.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                  />
                </div>
              </div>
            </div>
            <div className="Board2">My Followers</div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
