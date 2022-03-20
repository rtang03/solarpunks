import { gql, useLazyQuery } from "@apollo/client";
import { useMoralis } from "react-moralis";

// hardcoded: fix later
const PROFILE_ID = "0x21";
const PAGESIZE = 5;
const CURSOR = 0;

const Following = () => {
  const [getFollowing, { data, loading, error }] = useLazyQuery(GET_FOLLOWING);
  const { account } = useMoralis();

  return (
    <div>
      <button
        className="bg-blue-500 m-2 p-2 border-2"
        onClick={() =>
          getFollowing({
            variables: {
              request: {
                address: account,
                limit: PAGESIZE,
              },
            },
          })
        }
      >
        Get Following
      </button>
      <div>Result: </div>
      {error && <div className="border-2">error: {error.message}</div>}
      {data && <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Following;

const GET_FOLLOWING = gql`
  query ($request: FollowingRequest!) {
    following(request: $request) {
      items {
        profile {
          id
          name
          bio
          location
          website
          twitterUrl
          handle
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                width
                height
                mimeType
              }
              medium {
                url
                width
                height
                mimeType
              }
              small {
                url
                width
                height
                mimeType
              }
            }
          }
          coverPicture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                width
                height
                mimeType
              }
              small {
                width
                url
                height
                mimeType
              }
              medium {
                url
                width
                height
                mimeType
              }
            }
          }
          ownedBy
          depatcher {
            address
            canUseRelay
          }
          stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
          }
          followModule {
            ... on FeeFollowModuleSettings {
              type
              amount {
                asset {
                  name
                  symbol
                  decimals
                  address
                }
                value
              }
              recipient
            }
          }
        }
        totalAmountOfTimesFollowing
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;
