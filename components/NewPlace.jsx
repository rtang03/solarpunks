import { NFTStorage, File } from "nft.storage";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import mime from "mime";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

const NewPlace = ({ setParentContentURL }) => {
  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_TOKEN;
  const [image, setImage] = useState(null);
  const [contentType, setContentType] = useState("");
  const [contentUrl, setContentUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  !NFT_STORAGE_TOKEN && console.error("NFT_STORAGE_TOKEN does not exist, this call will fail");

  const captureFile = event => {
    console.log("capturing file...");
    const file = event.target.files[0];
    const _contentType = mime.getType(file.name);
    setContentType(_contentType);
    const _image = new File([file], file.name, { type: _contentType });
    setImage(_image);
  };

  const registerPlace = async ({ name, description, tag, location, tokenId, placeType }) => {
    let metadata;
    try {
      const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
      setLoading(true);
      metadata = await client.store({
        version: "1.0.0",
        metadata_id: uuidv4(),
        content: "Solarpunks",
        name,
        description,
        image: image,
        tag: tag,
        imageMimeType: contentType,
        attributes: [
          {
            traitType: "tokenId",
            value: tokenId,
          },
          {
            traitType: "location",
            value: location,
          },
          {
            traitType: "place_type",
            value: placeType,
          },
        ],
        appId: "solarpunks",
      });

      if (metadata?.url) {
        // set Url for use in this component
        setContentUrl(metadata.url);
        // set Url for callback in parent component
        setTimeout(() => {
          const url = metadata.url.replace("ipfs://", "https://ipfs.io/ipfs/");
          setParentContentURL(url);
        }, 100);
      } else setError(new Error("unrecognized metadata returned"));
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  error && console.error("error in preparing contentUrl", error);

  return (
    <div className="m-2">
      <Formik
        initialValues={{
          name: "",
          description: "",
          tag: "",
          tokenId: "",
          location: "",
          placeType: "",
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Required field"),
          description: Yup.string(),
          tag: Yup.string(),
          tokenId: Yup.number().integer(),
          location: Yup.string(),
          placeType: Yup.string(),
        })}
        onSubmit={async (
          { name, description, tag, tokenId, placeType, location },
          { setSubmitting },
        ) => {
          setSubmitting(true);
          await registerPlace({
            name,
            description,
            tag,
            tokenId: tokenId.toString(),
            placeType,
            location,
          });
          setSubmitting(false);
        }}
      >
        {({ errors, values, isSubmitting }) => (
          <Form>
            <div className="m-5">
              {/* Field1 name */}
              <div className="m-2">
                <span className="p-2 m-2">
                  <label htmlFor="name">Name*</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="name"
                    name="name"
                    placeholder="How this place is named in your city?"
                  />
                </span>
                {/* Input Error */}
                {errors?.name && (
                  <div className="m-2">
                    <ErrorMessage name="name" />
                  </div>
                )}
              </div>
              {/* Field2 description */}
              <div className="m-5">
                <span className="p-2 m-2">
                  <label htmlFor="description">Description</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="description"
                    name="description"
                    placeholder="description"
                  />
                </span>
                {/* Input Error */}
                {errors?.description && (
                  <div>
                    <ErrorMessage name="description" />
                  </div>
                )}
              </div>
              {/* Field3 tag */}
              <div className="m-5">
                <span className="p-2 m-2">
                  <label htmlFor="tag">Tag</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="tag"
                    name="tag"
                    placeholder="Camping, Climbing, Nature"
                  />
                </span>
                {/* Input Error */}
                {errors?.tag && (
                  <div>
                    <ErrorMessage name="tag" />
                  </div>
                )}
              </div>
              {/* Field4 tokenId */}
              <div className="m-5">
                <span className="p-2 m-2">
                  <label htmlFor="tokenId">Token ID</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="tokenId"
                    name="tokenId"
                    placeholder="tokenId"
                  />
                </span>
                {errors?.tokenId && (
                  <div>
                    <ErrorMessage name="tokenId" />
                  </div>
                )}
              </div>
              {/* Field5 location */}
              <div className="m-5">
                <span className="p-2 m-2">
                  <label htmlFor="location">Location</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="location"
                    name="location"
                    placeholder="location"
                  />
                </span>
                {errors?.location && (
                  <div>
                    <ErrorMessage name="location" />
                  </div>
                )}
              </div>
              {/* Field5 placeType */}
              <div className="m-5">
                <span className="p-2 m-2">
                  <label htmlFor="placeType">Type of Place</label>
                </span>
                <span className="p-2 m-2 border-2">
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="placeType"
                    name="placeType"
                    placeholder="placeType"
                  />
                </span>
                {errors?.placeType && (
                  <div>
                    <ErrorMessage name="placeType" />
                  </div>
                )}
              </div>
              <div className="m-2">
                <label className="file">
                  Take and upload a photo of the place
                  <input type="file" disabled={!!contentUrl} onChange={captureFile} />
                  <span className=""></span>
                </label>
              </div>
              <div className="m-5">
                {contentUrl ? (
                  <button disabled={true} className="bg-blue-500 m-2 p-2 border-2" type="submit">
                    DONE
                  </button>
                ) : (
                  <>
                    {isSubmitting ? (
                      <button className="bg-blue-500 m-2 p-2 border-2" disabled={true}>
                        ...Uploading
                      </button>
                    ) : (
                      <button
                        disabled={
                          isSubmitting ||
                          loading ||
                          !!errors?.name ||
                          !image ||
                          !values?.name ||
                          !!error?.tokenId
                        }
                        className="bg-blue-500 m-2 p-2 border-2"
                        type="submit"
                      >
                        Upload Image
                      </button>
                    )}{" "}
                  </>
                )}
                {contentUrl && <div>Image successfully upload</div>}
                {error && <div>Image upload error</div>}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewPlace;
