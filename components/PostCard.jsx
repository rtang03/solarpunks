import Link from "next/link";
import includes from "lodash/includes";
import Image from "next/image";

const MIMETYPE = ["image/png", "image/jpeg"];

// when using Timeline query. The result Post has no stats fields
const PostCard = ({ post, showLinkToPublicProfile, hideStats }) => {
  const { stats, metadata, profile } = post;
  const media0MemeType = metadata?.media?.[0]?.original?.mimeType;
  const media0Url = metadata?.media?.[0]?.original?.url;
  const isDisplayable = includes(MIMETYPE, media0MemeType);

  return (
    <div>
      <div>Type: {post.__typename}</div>
      <div className="my-2 font-bold">{post.id}</div>
      <div>
        <span>
          owner: {profile?.handle}#{profile?.id}
        </span>
        {showLinkToPublicProfile && (
          <span>
            <button className="bg-blue-200 m-2 p-2">
              <Link href={`/explore/${profile?.handle}%23${profile.id}`}>
                <a>Go to Public Profile</a>
              </Link>
            </button>
          </span>
        )}
      </div>
      {!hideStats && (
        <>
          <div className="my-2 font-bold">PublicationStats</div>
          <div>totalAmountOfMirrors: {stats?.totalAmountOfMirrors}</div>
          <div>totalAmountOfCollects: {stats?.totalAmountOfCollects}</div>
          <div>totalAmountOfComments: {stats?.totalAmountOfComments}</div>
        </>
      )}
      <div className="my-2 font-bold">Metadata</div>
      <div>metadata-name: {metadata?.name}</div>
      <div>metadata-description: {metadata?.description}</div>
      <div>metadata-content: {metadata?.content}</div>
      {Object.entries(metadata?.attributes)?.map(([key, value], index) => (
        <div key={index}>
          <span>{key}</span>
          <span>{value}</span>
        </div>
      ))}
      <div>
        <Image width={100} height={100} src={media0Url} />
      </div>
      <div>ownedBy: {profile.ownedBy}</div>
      <div>createdAt: {post.createdAt}</div>
    </div>
  );
};

export default PostCard;

// {
//   "__typename": "Post",
//   "id": "0x21-0x09",
//   "profile": {
//     "__typename": "Profile",
//     "id": "0x21",
//     "name": "tester",
//     "bio": "fullstack dev",
//     "location": "the earth",
//     "website": "http://abc.com",
//     "twitterUrl": "http://twitter.com",
//     "handle": "rtang3",
//     "picture": null,
//     "coverPicture": {
//       "__typename": "MediaSet",
//       "original": {
//         "__typename": "Media",
//         "url": "http://abc.com",
//         "mimeType": null
//       }
//     },
//     "ownedBy": "0xc93b8F86c949962f3B6D01C4cdB5fC4663b1af0A",
//     "depatcher": null,
//     "stats": {
//       "__typename": "ProfileStats",
//       "totalFollowers": 3,
//       "totalFollowing": 0,
//       "totalPosts": 3,
//       "totalComments": 1,
//       "totalMirrors": 0,
//       "totalPublications": 4,
//       "totalCollects": 2
//     },
//     "followModule": null
//   },
//   "stats": {
//     "__typename": "PublicationStats",
//     "totalAmountOfMirrors": 1,
//     "totalAmountOfCollects": 0,
//     "totalAmountOfComments": 0
//   },
//   "metadata": {
//     "__typename": "MetadataOutput",
//     "name": "PUG",
//     "description": "### dog",
//     "content": "content",
//     "media": [
//       {
//         "__typename": "MediaSet",
//         "original": {
//           "__typename": "Media",
//           "url": "https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8?filename=pug.png",
//           "mimeType": "image/png"
//         }
//       }
//     ],
//     "attributes": []
//   },
//   "createdAt": "2022-03-20T11:36:17.000Z",
//   "collectModule": {
//     "__typename": "EmptyCollectModuleSettings"
//   },
//   "referenceModule": null,
//   "appId": "testing123"
// }
