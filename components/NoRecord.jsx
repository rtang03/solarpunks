const NoRecord = ({ title }) => (
  <div>
    {title && <h5>{title}</h5>}
    <br />
    <h6>No record found.</h6>
  </div>
);

export default NoRecord;
