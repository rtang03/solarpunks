import { gql, useLazyQuery } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const TransactionReceiptCard = ({ receipt }) => {
  const { __typename, txReceipt, metadataStatus } = receipt;
  const { __typename: __typename_metadata, status, reason } = metadataStatus;

  return <div></div>;
};

export default TransactionReceiptCard;
