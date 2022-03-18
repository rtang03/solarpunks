import { gql, useLazyQuery } from "@apollo/client";
import { useMoralis } from "react-moralis";

const Profiles = () => {
  const { account } = useMoralis();
  const [getProfiles, { loading, data, error }] = useLazyQuery(GET_PROFILES);

  return (
    <div>1
      <button
        className="bg-blue-500 m-2 p-2 border-2"
        onClick={() =>
          getProfiles({
            variables: {
              request: {
                limit: 10,
                cursor: 0,
                // handles: ["account1"], // string[]
                // profileIds: null, // string[]
                ownedBy: account,
                whoMirroredPublicationId: null, // string
              },
            },
          })
        }
      >
        Get Profiles
      </button>
      <div>Result: </div>
      {error && <div className="border-2">error: {error.message}</div>}
      <pre className="text-left">{data && JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const GET_PROFILES = gql`
  query ($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        name
        bio
        location
        website
        twitterUrl
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
              mimeType
            }
          }
          __typename
        }
        handle
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
              mimeType
            }
          }
          __typename
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
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          __typename
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

export default Profiles;
