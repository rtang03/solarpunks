import { gql, useQuery } from "@apollo/client";
import ConnectWalletMessage from "../../../components/ConnectWalletMessage";
import Layout from "../../../components/Layout";
import LensContext from "../../../components/LensContext";
import PostCard from "../../../components/PostCard";
import CommentCard from "../../../components/CommentCard";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import Link from "next/link";
import { SEARCH } from "../../../graphql/search";

const PAGESIZE = 20;
const CURSOR = 0;

const TimelinePage = () => {
  const FUNC = "timeline";
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const router = useRouter();
  const handle = router.query.handle;

  // search profile based on pathname
  const {
    loading: searchProfileLoading,
    data: searchResult,
    error: searchProfileError,
  } = useQuery(SEARCH, {
    variables: { request: { query: handle, type: "PROFILE" } },
    skip: !handle,
  });
  searchProfileError && console.error("searchProfileError: ", searchProfileError);
  const profile = searchResult?.search?.items?.[0];

  const { data, loading, error } = useQuery(GET_TIMELINE2, {
    variables: { request: { limit: PAGESIZE, cursor: CURSOR, profileId: profile?.profileId } },
    skip: !profile?.profileId,
  });

  const result = data?.[FUNC]?.items;

  return (
    <Layout>
      {!(account && isAuthenticated) && <ConnectWalletMessage />}
      {!(account && isAuthenticated && isLensReady) && <div>Lens is not active</div>}
      {account && isAuthenticated && isLensReady && (
        <>
          {loading && <div>...loading</div>}
          {result && (
            <>
              {result.map((item, index) => (
                <div key={index} className="border-2 m-2 p-2">
                  {item["__typename"] === "Comment" ? (
                    <CommentCard comment={item} />
                  ) : item["__typename"] === "Post" ? (
                    <PostCard post={item} />
                  ) : (
                    <div>Unknow item</div>
                  )}
                </div>
              ))}
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default TimelinePage;

// edit manually. Todo: replaced by auto-generated query, which is broken
const GET_TIMELINE2 = gql`
  query ($request: TimelineRequest!) {
    timeline(request: $request) {
      items {
        ... on Post {
          id
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
                  size
                }
                small {
                  url
                  width
                  height
                  mimeType
                  size
                }
                medium {
                  url
                  width
                  height
                  mimeType
                  size
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
                  size
                }
                small {
                  url
                  width
                  height
                  mimeType
                  size
                }
                medium {
                  url
                  width
                  height
                  mimeType
                  size
                }
              }
            }
            ownedBy
            stats {
              totalFollowers
              totalFollowing
              totalPosts
              totalComments
              totalMirrors
              totalPublications
              totalCollects
            }
          }
          metadata {
            name
            description
            content
            cover {
              original {
                url
              }
            }
            media {
              original {
                url
              }
            }
            attributes {
              displayType
              value
              traitType
            }
          }
          createdAt
          collectedBy {
            address
            defaultProfile {
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
                    size
                  }
                  small {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                    size
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
                    size
                  }
                  small {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                }
              }
              ownedBy
              stats {
                totalFollowers
                totalFollowing
                totalPosts
                totalComments
                totalMirrors
                totalPublications
                totalCollects
              }
            }
          }
          appId
          collectModule {
            ... on EmptyCollectModuleSettings {
              type
              contractAddress
            }
          }
          referenceModule {
            ... on FollowOnlyReferenceModuleSettings {
              type
              contractAddress
            }
          }
          onChainContentURI
        }
        ... on Comment {
          id
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
                  size
                }
                small {
                  url
                  width
                  height
                  mimeType
                  size
                }
                medium {
                  url
                  width
                  height
                  mimeType
                  size
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
                  size
                }
                small {
                  url
                  width
                  height
                  mimeType
                  size
                }
                medium {
                  url
                  width
                  height
                  mimeType
                  size
                }
              }
            }
            ownedBy
            stats {
              totalFollowers
              totalFollowing
              totalPosts
              totalComments
              totalMirrors
              totalPublications
              totalCollects
            }
          }
          metadata {
            name
            description
            content
            cover {
              original {
                url
              }
            }
            media {
              original {
                url
              }
            }
            attributes {
              displayType
              value
              traitType
            }
          }
          createdAt
          collectedBy {
            address
            defaultProfile {
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
                    size
                  }
                  small {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                    size
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
                    size
                  }
                  small {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                    size
                  }
                }
              }
              ownedBy
              stats {
                totalFollowers
                totalFollowing
                totalPosts
                totalComments
                totalMirrors
                totalPublications
                totalCollects
              }
            }
          }
          appId
          collectModule {
            ... on EmptyCollectModuleSettings {
              type
              contractAddress
            }
          }
          referenceModule {
            ... on FollowOnlyReferenceModuleSettings {
              type
              contractAddress
            }
          }
          onChainContentURI
          mainPost {
            ... on Post {
              id
              profile {
                id
              }
            }
          }
          commentOn {
            ... on Comment {
              id
            }
            ... on Post {
              id
            }
          }
          firstComment {
            id
          }
        }
        ... on Mirror {
          id
          profile {
            id
          }
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
