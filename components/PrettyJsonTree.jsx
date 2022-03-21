import React from "react";
import JSONTree from "react-json-tree";

const PrettyJsonTree = ({ content, title }) => (
  <div>
    {title && <h6>{title}</h6>}
    {content && <JSONTree data={content} hideRoot={true} />}
  </div>
);

export default PrettyJsonTree;
