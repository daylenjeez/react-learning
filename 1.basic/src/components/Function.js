import React from "../react";

export const FunctionComponent = (props) => (
  <h1 style={{ color: "#aaa" }}>
    <span style={{ color: "#eee" }}>hello </span>
    {props.title}
    <div>{props.children}</div>
  </h1>
);
