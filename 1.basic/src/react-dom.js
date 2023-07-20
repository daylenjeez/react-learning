import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_TEXT } from "./constants";
import { addEvent } from "./event";

const updateProps = (props, dom) => {
  Object.entries(props).forEach(([key, value]) => {
    if (key === "children") return;
    if (key === "style") {
      Object.entries(value).forEach(([_key, _value]) => {
        dom.style[_key] = _value;
      });
    } else {
      if (/^on.*[A-Z]/.test(key)) {
        // dom[key.toLowerCase(key)] = value;
        addEvent(dom, key.toLowerCase(), value);
      }
      dom[key] = value;
    }
  });
};

const mountClassComponent = (vDom) => {
  const { type, props, ref } = vDom;
  const classInstance = new type(props);
  vDom.classInstance = classInstance;
  if (ref) ref.current = classInstance;
  classInstance.componentWillMount?.();
  const renderVDom = classInstance.render();
  vDom.oldRenderVDom = classInstance.oldRenderVDom = renderVDom;
  const dom = createDom(renderVDom);
  classInstance.componentDidMount?.();
  return dom;
};

const mountFunctionComponent = (vDom) => {
  const { type, props } = vDom;
  const renderVDom = type(props);
  vDom.oldRenderVDom = renderVDom;
  return createDom(renderVDom);
};

const mountForwardComponent = (vDom) => {
  const { type, props, ref } = vDom;
  const renderVDom = type.render(props, ref);
  vDom.oldRenderVDom = renderVDom;
  return createDom(renderVDom);
};

const mount = (vDom, container) => {
  if (!vDom) return;
  const dom = createDom(vDom);
  container.appendChild(dom);
};

const reconcileChildren = (children, dom) => {
  children.forEach((child) => mount(child, dom));
};

const createDom = (vDom) => {
  const { type, $$typeof, props, ref } = vDom;
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

    if (props.children?.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }

  vDom.dom = dom;
  if (ref) {
    ref.current = dom;
  }
  return dom;
};

const render = (vDom, container) => {
  mount(vDom, container);
};

const ReactDOM = {
  render,
};

export const findDom = (vDom) => {
  if (!vDom) return null;
  if (vDom.dom) return vDom.dom;
  const renderVDom = vDom.classInstance
    ? vDom.classInstance.oldRenderVDom
    : vDom.oldRenderVDom;
  return createDom(renderVDom);
};

export const compareTwoVDom = (parentNode, oldVDom, newVDom) => {
  const oldDom = findDom(oldVDom);
  const newDom = createDom(newVDom);
  parentNode.replaceChild(newDom, oldDom);
};

export default ReactDOM;
