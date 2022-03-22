const TypedDataCard = ({ eip712TypedData }) => {
  const { __typename, id, expiresAt, typedData } = eip712TypedData;
  const { domain, value } = typedData;

  return (
    <div className="border-2 m-2 p-2">
      <div className="font-bold">Type: {__typename}</div>
      <div>id: {id}</div>
      <div>expires: {expiresAt}</div>
      <div className="font-bold">Domain</div>
      <div>name: {domain?.name}</div>
      <div>chainId: {domain?.chainId}</div>
      <div>version: {domain?.version}</div>
      <div>verifyingContract: {domain?.verifyingContract}</div>
      <div className="font-bold">Value</div>
      {Object.entries(value).map([key, val], index => (
        <div key={index}>
          <span className="mx-2">{key}: </span>
          <span className="mx-2">{val}</span>
        </div>
      ))}
    </div>
  );
};

export default TypedDataCard;
