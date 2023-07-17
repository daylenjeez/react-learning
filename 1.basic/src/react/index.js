import { REACT_ELEMENT, REACT_FORWARD_REF } from "../constants";
import { wrapVDom } from "../utils";
import { Component } from "./component";

function createElement(type, config, children) {
  const { __self, __source, key, ref, ...props } = config;

  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapVDom);
  } else {
    props.children = wrapVDom(children);
  }
  return {
    $$typeof: REACT_ELEMENT,
    type,
    props,
    key,
    ref,
  };
}

function createRef() {
  return {
    current: null,
  };
}

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render,
  };
}

const react = {
  createElement,
  createRef,
  forwardRef,
  Component,
};

export default react;
