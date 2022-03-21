import Error from "./Error";

const Success = () => (
  <div>
    <h6>Successfully done.</h6>
  </div>
);

const ResultComponent = ({ isShow, result }) => (
  <>
    {isShow && !result?.loading && result?.data && (
      <div>
        <br />
        <Success />
      </div>
    )}
    {isShow && !result?.loading && result?.error && (
      <div>
        <br />
        <Error error={result.error} />
      </div>
    )}
  </>
);

export default ResultComponent;
