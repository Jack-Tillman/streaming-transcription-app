import React from "react";
import { useLoading } from "../contexts/LoadingContext.js";
import '../styles/loading.css'
const Loading = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loadingio-spinner-spinner-nq4q5u6dq7r">
      <div className="ldio-x2uulkbinc">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
