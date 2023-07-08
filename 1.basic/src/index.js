import React from "./react";
import ReactDOM from "./react-dom";
// import { FunctionComponent } from "./components/Function";
import { ClassComponent } from "./components/Class";

const element = <ClassComponent title=" world" />;

ReactDOM.render(element, document.getElementById("root"));
