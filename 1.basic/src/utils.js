import { REACT_TEXT } from "./constants";
const isNumberOrString = (element) =>
  typeof element === "number" || typeof element === "string";

export const wrapVDom = (vDom) =>
  isNumberOrString(vDom) ? { type: REACT_TEXT, props: vDom } : vDom;
