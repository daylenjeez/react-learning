import { REACT_TEXT } from "./constants";

const isStringOrNumber = (value) =>
  typeof value === "number" || typeof value === "string";

export const wrapVDom = (element) => {
  return isStringOrNumber(element)
    ? {
        type: REACT_TEXT,
        props: element,
      }
    : element;
};
