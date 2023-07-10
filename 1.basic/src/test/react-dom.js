import { REACT_ELEMENT } from "./constant";
import { REACT_TEXT } from "./constant";
import { addEvent } from "./event";

const updateProps = (props, dom) => {
  Object.entries(props).forEach(([key, value]) => {
    if (key === "children") return;
    if (key === "style") {
      Object.entries(([_key, _value]) => (dom.style[_key] = _value));
    } else {
      if (/^on.*[A-Z]/.test(key)) {
        addEvent(dom, key.toLowerCase(), value);
        // dom[key.toLowerCase()] = value;
      } else {
        dom[key] = value;
      }
    }
  });
};

const mountFunctionComponent = (vDom) => {
  const { type, props } = vDom;
  const renderVDom = type(props);
  vDom.oldRenderVDom = renderVDom;
  return createDom(renderVDom);
};

const mountClassComponent = (vDom) => {
  const { type, props } = vDom;
  const classInstance = new type(props);
  vDom.classInstance = classInstance;
  const renderVDom = classInstance.render();
  vDom.oldRenderVDom = classInstance.oldRenderVDom = renderVDom;
  return createDom(renderVDom);
};

const mount = (vDom, container) => {
  const dom = createDom(vDom);
  container.appendChild(dom);
};

const reconcileChildren = (children, dom) => {
  children.forEach((child) => mount(child, dom));
};

const createDom = (vDom) => {
  const { type, $$typeof, props } = vDom;
  let dom;

  if (type === REACT_TEXT) {
    dom = document.createTextNode(props);
  } else if (typeof type === "function") {
    return type.isReactComponent
      ? mountClassComponent(vDom)
      : mountFunctionComponent(vDom);
  } else if ($$typeof === REACT_ELEMENT) {
    dom = document.createElement(type);
  }

  if (props) {
    const { children } = props;
    updateProps(props, dom);

    if (children?.type) {
      mount(children, dom);
    } else if (Array.isArray(children)) {
      reconcileChildren(children, dom);
    }
  }

  vDom.dom = dom;
  return dom;
};

const render = (vDom, container) => {
  mount(vDom, container);
};

const ReactDom = {
  render,
};

export const findDOM = (vDom) => {
  if (!vDom) return;
  if (vDom.dom) return vDom.dom;
  return vDom.classInstance
    ? vDom.classInstance.oldRenderVDom
    : vDom.oldRenderVDom;
};
export const compareTwoDom = (parentNode, oldVDom, newVDom) => {
  const oldDom = findDOM(oldVDom);
  const newDom = createDom(newVDom);
  parentNode.replaceChild(newDom, oldDom);
};

export default ReactDom;
