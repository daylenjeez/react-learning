import { REACT_ELEMENT, REACT_FORWARD_REF } from "./constants";
import { wrapVDom } from "./utils";
import { Component } from "./component";

function createElement(type, config, children) {
  const { __source, __self, ref, key, ...props } = config;

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

export default { createElement, Component, createRef, forwardRef };
