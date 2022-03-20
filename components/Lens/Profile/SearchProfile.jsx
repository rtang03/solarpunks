import { gql, useLazyQuery } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SEARCH } from "../../../graphql/search";

// TODO: hardcoded pagination
const PAGESIZE = 5;
const CURSOR = 0;

const SearchProfile = () => {
  const [searchProfile, { loading, data, error }] = useLazyQuery(SEARCH);

  return (
    <Formik
      initialValues={{ handle: "" }}
      validationSchema={Yup.object().shape({
        handle: Yup.string()
          .min(3, "Too Short! Min(3)")
          .max(256, "Too Long! Max(256)")
          .required("Required"),
      })}
      onSubmit={({ handle }) => {
        searchProfile({
          variables: {
            request: { limit: PAGESIZE, cursor: CURSOR, query: handle, type: "PROFILE" },
          },
        });
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="m-2">
            <span className="p-2 m-2">
              <label htmlFor="handle">Handle</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field id="handle" name="handle" placeholder="rtang3" />
            </span>
          </div>
          {errors?.handle && (
            <div>
              Input Error: <ErrorMessage name="handle" />
            </div>
          )}
          <button className="bg-blue-500 m-2 p-2 border-2" type="submit">
            Search
          </button>
          <div>Result: </div>
          {/* Apollo Error */}
          {error && <div className="border-2">error: {error.message}</div>}
          {/* Result */}
          {data && <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>}
        </Form>
      )}
    </Formik>
  );
};

export default SearchProfile;

// Example:
// should returns, something like:
// {
//   "search": {
//     "__typename": "ProfileSearchResult",
//     "items": [
//       {
//         "__typename": "Profile",
//         "profileId": "0x21",
//         "name": null,
//         "bio": null,
//         "location": null,
//         "website": null,
//         "twitterUrl": null,
//         "handle": "rtang3",
//         "picture": null,
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
//       "totalCount": 1,
//       "next": "{\"offset\":1}"
//     }
//   }
// }