import { REACT_TEXT } from "./constant";

const isNumberOrString = (type) =>
  typeof type === "string" || typeof type === "number";

export const wrapVDom = (element) =>
  isNumberOrString(element) ? { type: REACT_TEXT, props: element } : element;
