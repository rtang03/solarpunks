import { gql, useLazyQuery } from "@apollo/client";

// TODO: hardcoded pagination
const PAGESIZE = 5;
const CURSOR = 0;
const PROFILE_ID = "0x21";

const Timeline = () => {
  const [getTimeline, { data, loading, error }] = useLazyQuery(GET_TIMELINE2);

  return (
    <div>
      <button
        className="bg-blue-500 m-2 p-2 border-2"
        onClick={() =>
          getTimeline({
            variables: {
              request: { limit: PAGESIZE, cursor: CURSOR, profileId: PROFILE_ID },
            },
          })
        }
      >
        Get Timeline
      </button>
      <div>Result: </div>
      {error && <div className="border-2">error: {error.message}</div>}
      {data && <pre className="text-left w-1/2">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Timeline;

// edit manually. Todo: replaced by auto-generated query
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

// ORIGINAL is broken
const GET_TIMELINE = gql`
  query ($request: TimelineRequest!) {
    timeline(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  fragment MediaFields on Media {
    url
    width
    height
    mimeType
  }

  fragment ProfileFields on Profile {
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
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
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
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    ownedBy
    depatcher {
      address
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

  fragment PublicationStatsFields on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
      small {
        ...MediaFields
      }
      medium {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on EmptyCollectModuleSettings {
      type
      contractAddress
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
        contractAddress
      }
    }
    appId
    collectedBy {
      ...WalletFields
    }
    onChainContentURI
  }

  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
        contractAddress
      }
    }
    appId
    onChainContentURI
  }

  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
    }
  }

  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
        contractAddress
      }
    }
    appId
    collectedBy {
      ...WalletFields
    }
    onChainContentURI
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentMirrorOfFields
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
      }
    }
  }

  fragment WalletFields on Wallet {
    address
    defaultProfile {
      ...ProfileFields
    }
    totalAmountOfProfiles
  }
`;
