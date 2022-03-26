import Layout from "../components/Layout";
import ConnectWalletMessage from "../components/ConnectWalletMessage";
import LensContext from "../components/LensContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import { useQueryPuckCitiesMetadata } from "../hooks/useQueryPuckCitiesMetadata";
import { FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";
import Pagination from "../components/Pagination";

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
  const [cities, setCities] = useState({});
  const [citiesArray, setCitiesArray] = useState();
  const [currentCity, setCurrentCity] = useState(0);

  const numberOfCities = citiesArray?.length;

  useEffect(() => {
    city0 && setCities({ ...cities, [city0.tokenID]: city0 });
    city1 && setCities({ ...cities, [city1.tokenID]: city1 });
    city2 && setCities({ ...cities, [city2.tokenID]: city2 });
    city3 && setCities({ ...cities, [city3.tokenID]: city3 });
    city4 && setCities({ ...cities, [city4.tokenID]: city4 });
    city5 && setCities({ ...cities, [city5.tokenID]: city5 });
    cities && setCitiesArray(Object.values(cities));
  }, [city0, city1, city2, city3, city4, city5]);

  // query cities
  const { citiesMetadataloading: loading0, citiesMetadataError: error0 } =
    useQueryPuckCitiesMetadata(setCity0, PUNKCITIES_ADDRESS, 0);
  const { citiesMetadataloading: loading1, citiesMetadataError: error1 } =
    useQueryPuckCitiesMetadata(setCity1, PUNKCITIES_ADDRESS, 1);
  const { citiesMetadataloading: loading2, citiesMetadataError: error2 } =
    useQueryPuckCitiesMetadata(setCity2, PUNKCITIES_ADDRESS, 2);
  const { citiesMetadataloading: loading3, citiesMetadataError: error3 } =
    useQueryPuckCitiesMetadata(setCity3, PUNKCITIES_ADDRESS, 3);
  const { citiesMetadataloading: loading4, citiesMetadataError: error4 } =
    useQueryPuckCitiesMetadata(setCity4, PUNKCITIES_ADDRESS, 4);
  const { citiesMetadataloading: loading5, citiesMetadataError: error5 } =
    useQueryPuckCitiesMetadata(setCity5, PUNKCITIES_ADDRESS, 5);

  error0 && console.error("fail to fetch city0", error0);
  error1 && console.error("fail to fetch city1", error1);
  error2 && console.error("fail to fetch city2", error2);
  error3 && console.error("fail to fetch city3", error3);
  error4 && console.error("fail to fetch city4", error4);
  error5 && console.error("fail to fetch city5", error5);

  const next = () => setCurrentCity((currentCity + 1) % numberOfCities);
  const prev = () => setCurrentCity((currentCity + numberOfCities - 1) % numberOfCities);

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
                {numberOfCities >= 0 && (
                  <div className=" text-left m-10">
                    <div>Name: {citiesArray?.[currentCity]?.name}</div>
                    <div>Desc: {citiesArray?.[currentCity]?.description}</div>
                    <div>Content: {citiesArray?.[currentCity]?.content}</div>
                    <div>Tag: {citiesArray?.[currentCity]?.tag}</div>
                    <div>TokenID: {citiesArray?.[currentCity]?.tokenID}</div>
                    <div className="flex flex-row">
                      <span>
                        <FaMapMarkerAlt />
                      </span>
                      <span>
                        <a
                          className="m-2 p-2 underline text-night-100 hover:text-solar-100"
                          target="_blank"
                          rel="noreferrer"
                          href={citiesArray?.[currentCity]?.address}
                        >
                          Map
                        </a>
                      </span>
                    </div>
                    <div className="font-bold my-2">Attributes</div>
                    {citiesArray?.[currentCity]?.attributes?.map((attribute, index) => (
                      <div key={index}>
                        <div className="ml-5">trait_type: {attribute.trait_type}</div>
                        <div className="ml-5 mb-2">value: {attribute.value}</div>
                      </div>
                    ))}
                    <Image
                      width={256}
                      height={256}
                      src={citiesArray?.[currentCity]?.image.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/",
                      )}
                    />
                    <Pagination next={next} prev={prev} totalCount={numberOfCities || 0} />
                  </div>
                )}
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
