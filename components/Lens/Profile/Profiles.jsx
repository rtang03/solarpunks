import { gql, useLazyQuery } from "@apollo/client";
import { useMoralis } from "react-moralis";

// TODO: hardcoded pagination
const PAGESIZE = 5;
const CURSOR = 0;

const Profiles = () => {
  const { account } = useMoralis();
  const [getProfiles, { loading, data, error }] = useLazyQuery(GET_PROFILES);

  return (
    <div>
      <button
        className="bg-blue-500 m-2 p-2 border-2"
        onClick={() =>
          getProfiles({
            variables: {
              request: {
                limit: PAGESIZE,
                cursor: CURSOR,
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
      {data && <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Profiles;

export const GET_PROFILES = gql`
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

// example
// {
//   "profiles": {
//     "__typename": "PaginatedProfileResult",
//     "items": [
//       {
//         "__typename": "Profile",
//         "id": "0x21",
//         "name": null,
//         "bio": null,
//         "location": null,
//         "website": null,
//         "twitterUrl": null,
//         "picture": null,
//         "handle": "rtang3",
//         "coverPicture": null,
//         "ownedBy": "0xc93b8F86c949962f3B6D01C4cdB5fC4663b1af0A",
//         "depatcher": null,
//         "stats": {
//           "__typename": "ProfileStats",
//           "totalFollowers": 0,
//           "totalFollowing": 0,
//           "totalPosts": 0,
//           "totalComments": 0,
//           "totalMirrors": 0,
//           "totalPublications": 0,
//           "totalCollects": 0
//         },
//         "followModule": null
//       },
//       {
//         "__typename": "Profile",
//         "id": "0x2f",
//         "name": null,
//         "bio": null,
//         "location": null,
//         "website": null,
//         "twitterUrl": null,
//         "picture": null,
//         "handle": "rtang4",
//         "coverPicture": null,
//         "ownedBy": "0xc93b8F86c949962f3B6D01C4cdB5fC4663b1af0A",
//         "depatcher": null,
//         "stats": {
//           "__typename": "ProfileStats",
//           "totalFollowers": 0,
//           "totalFollowing": 0,
//           "totalPosts": 0,
//           "totalComments": 0,
//           "totalMirrors": 0,
//           "totalPublications": 0,
//           "totalCollects": 0
//         },
//         "followModule": null
//       }
//     ],
//     "pageInfo": {
//       "__typename": "PaginatedResultInfo",
//       "prev": "{\"offset\":0}",
//       "next": "{\"offset\":2}",
//       "totalCount": 2
//     }
//   }
// }
