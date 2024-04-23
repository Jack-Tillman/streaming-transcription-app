import React from "react";
import { useLoading } from "../contexts/LoadingContext.js";
import "../styles/loading.css";
const Loading = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <span className="loadingio-spinner-spinner-nq4q5u6dq7r">
      <span className="ldio-x2uulkbinc">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </span>
    </span>
  );
};

export default Loading;
