import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_TEXT } from "./constants";
import { addEvent } from "./event";

const updateProps = (props, dom) => {
  Object.entries(props).forEach(([key, value]) => {
    if (key === "children") return;
    if (key === "style") {
      Object.entries(value).forEach(
        ([_key, _value]) => (dom["style"][_key] = _value)
      );
    } else {
      if (/^on.*[A-Z]/.test(key)) {
        addEvent(dom, key.toLocaleLowerCase(), value);
      } else {
        dom[key] = value;
      }
    }
  });
};

const mount = (vDom, container) => {
  const dom = createDom(vDom);
  container.appendChild(dom);
};

const reconcileChildren = (children, dom) => {
  children.forEach((child) => mount(child, dom));
};

const mountClassComponent = (vDom) => {
  const { type, props, ref } = vDom;
  const classInstance = new type(props);
  vDom.classInstance = classInstance;
  if (ref) ref.current = classInstance;
  const renderVDom = classInstance.render();
  vDom.oldRenderVDom = classInstance.oldRenderVDom = renderVDom;
  return createDom(renderVDom);
};

const mountFunctionComponent = (vDom) => {
  const { type, props, ref } = vDom;
  const renderVDom = type(props, ref);
  vDom.oldRenderVDom = renderVDom;
  return createDom(renderVDom);
};

const mountForwardComponent = (vDom) => {
  const { type, props, ref } = vDom;
  const renderVDom = type.render(props, ref);
  vDom.oldRenderVDom = renderVDom;
  return createDom(renderVDom);
};

const createDom = (vDom) => {
  const { $$typeof, type, props, ref } = vDom;

  let dom;
  if (type?.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vDom);
  } else if (type === REACT_TEXT) {
    dom = document.createTextNode(props);
  } else if (typeof type === "function") {
    return type.isReactComponent
      ? mountClassComponent(vDom)
      : mountFunctionComponent(vDom);
  } else if ($$typeof === REACT_ELEMENT) {
    dom = document.createElement(type);
  }

  if (props) {
    updateProps(props, dom);
    const { children } = props;
    if (children?.type) {
      mount(children, dom);
    } else if (Array.isArray(children)) {
      reconcileChildren(children, dom);
    }
  }

  if (ref) {
    vDom.ref.current = dom;
  }

  vDom.dom = dom;
  return dom;
};

const render = (vDom, container) => {
  mount(vDom, container);
};

const findDom = (vDom) => {
  if (!vDom) return null;
  if (vDom.dom) return vDom.dom;
  const renderVDom = vDom.oldRenderVDom;
  return findDom(renderVDom);
};
const compareTwoVDom = (parent, oldVDom, newVDom) => {
  const oldDom = findDom(oldVDom);
  const newDom = createDom(newVDom);
  parent.replaceChild(newDom, oldDom);
};

export default {
  render,
};

export { findDom, compareTwoVDom };
