import Link from "next/link";
import includes from "lodash/includes";
import Image from "next/image";

// const MIMETYPE = ["image/png", "image/jpeg"];

const CommentCard = ({ comment, showLinkToPublicProfile, hideTraits, hideImage, hideStats }) => {
  const { stats, metadata, profile, mainPost, commentOn } = comment;
  // const media0MemeType = metadata?.media?.[0]?.original?.mimeType;
  // const media0Url = metadata?.media?.[0]?.original?.url;
  const totalAmountOfMirrors = stats?.totalAmountOfMirrors;
  const totalAmountOfCollects = stats?.totalAmountOfCollects;
  const totalAmountOfComments = stats?.totalAmountOfComments;
  const firstComment = comment?.firstComment;
  const collectedBy = comment?.collectedBy;
  let imgSrc = metadata?.media?.[0]?.original?.url || metadata?.cover?.original?.url;
  if (imgSrc?.startsWith("ipfs://")) imgSrc = imgSrc.replace("ipfs://", "https://ipfs.io/ipfs/");

  return (
    <div>
      <div>Type: {comment.__typename}</div>
      <div className="my-2 font-bold">{comment.id}</div>
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
          <div>Total Mirrors: {stats?.totalAmountOfMirrors}</div>
          <div>Total Collects: {stats?.totalAmountOfCollects}</div>
          <div>Total Comments: {stats?.totalAmountOfComments}</div>
        </>
      )}
      <div className="my-2 font-bold">Metadata</div>
      <div>metadata-name: {metadata?.name}</div>
      <div>metadata-description: {metadata?.description}</div>
      <div>metadata-content: {metadata?.content}</div>
      <div>metadata-name: {metadata?.name}</div>
      {!hideTraits &&
        metadata?.attributes?.map((attribute, index) => (
          <div key={index}>
            {attribute.displayType && <div>displayType: {attribute.displayType}</div>}
            <div>traitType: {attribute.traitType}</div>
            <div>value: {attribute.value}</div>
          </div>
        ))}
      {/* <div>
        <Image width={100} height={100} src={media0Url} />
      </div> */}
      <div>
        {!hideImage && (
          <>
            {imgSrc ? <Image width={100} height={100} src={imgSrc} /> : <div>No image found</div>}
          </>
        )}
      </div>
      <div>ownedBy: {profile.ownedBy}</div>
      <div>createdAt: {comment.createdAt}</div>
      {collectedBy && <div>collectedBy: {collectedBy}</div>}
      <div>onChainContentURI: {comment.onChainContentURI}</div>
      <div>mainPoint: {mainPost?.id}</div>
      <div>mainPoint-profile: {mainPost?.profile?.id}</div>
      <div>commentOn-profile: {commentOn?.id}</div>
      {firstComment && <div>firstComment: {firstComment}</div>}
    </div>
  );
};

export default CommentCard;

//  {
//         "__typename": "Comment",
//         "id": "0x21-0x0a",
//         "profile": {
//           "__typename": "Profile",
//           "id": "0x21",
//           "name": null,
//           "bio": null,
//           "location": null,
//           "website": null,
//           "twitterUrl": null,
//           "handle": "rtang3",
//           "picture": null,
//           "coverPicture": null,
//           "ownedBy": "0xc93b8F86c949962f3B6D01C4cdB5fC4663b1af0A",
//           "stats": {
//             "__typename": "ProfileStats",
//             "totalFollowers": 2,
//             "totalFollowing": 0,
//             "totalPosts": 3,
//             "totalComments": 1,
//             "totalMirrors": 0,
//             "totalPublications": 4,
//             "totalCollects": 2
//           }
//         },
//         "metadata": {
//           "__typename": "MetadataOutput",
//           "name": "PUG",
//           "description": "### dog",
//           "content": "content",
//           "cover": null,
//           "media": [
//             {
//               "__typename": "MediaSet",
//               "original": {
//                 "__typename": "Media",
//                 "url": "https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8?filename=pug.png"
//               }
//             }
//           ],
//           "attributes": []
//         },
//         "createdAt": "2022-03-20T14:55:18.000Z",
//         "collectedBy": null,
//         "appId": "testing123",
//         "collectModule": {
//           "__typename": "EmptyCollectModuleSettings",
//           "type": "EmptyCollectModule",
//           "contractAddress": "0xb96e42b5579e76197B4d2EA710fF50e037881253"
//         },
//         "referenceModule": null,
//         "onChainContentURI": "https://ipfs.io/ipfs/QmWPNB9D765bXgZVDYcrq4LnXgJwuY6ohr2NrDsMhA9vZN",
//         "mainPost": {
//           "__typename": "Post",
//           "id": "0x21-0x08",
//           "profile": {
//             "__typename": "Profile",
//             "id": "0x21"
//           }
//         },
//         "commentOn": {
//           "__typename": "Post",
//           "id": "0x21-0x08"
//         },
//         "firstComment": null
//       },
