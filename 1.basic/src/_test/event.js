import { updateQueue } from "./component";

export const addEvent = (dom, eventType, handler) => {
  const store = dom.store || (dom.store = {});
  store[eventType] = handler;
  if (!document[eventType]) document[eventType] = dispatchEvent;
};

export const dispatchEvent = (nativeEvent) => {
  updateQueue.isBatchingUpdate = true;
  const { type, target } = nativeEvent;

  let currentTarget = target;

  while (currentTarget) {
    const { store } = currentTarget;
    const handler = store?.[`on${type}`];
    const syntheticEvent = createSyntheticEvent(nativeEvent);
    handler?.(syntheticEvent);
    if (syntheticEvent.isPropagationStopped) break;
    currentTarget = currentTarget.parentNode;
  }

  updateQueue.batchUpdate();
};

function createSyntheticEvent(nativeEvent) {
  const syntheticEvent = {};

  for (let key in nativeEvent) {
    let value = nativeEvent[key];
    if (typeof value === "function") {
      value = value.bind(nativeEvent);
    }
    syntheticEvent[key] = value;
  }
  syntheticEvent.nativeEvent = nativeEvent;

  syntheticEvent.isDefaultEventPrevented = false;
  syntheticEvent.preventDefaultEvent = preventDefaultEvent;
  syntheticEvent.isPropagationStopped = false;
  syntheticEvent.stopPropagation = stopPropagation;

  return syntheticEvent;
}

export function preventDefaultEvent() {
  this.isDefaultEventPrevented = true;
  const { nativeEvent } = this;
  if (nativeEvent.preventDefaultEvent) {
    nativeEvent.preventDefaultEvent();
  } else {
    nativeEvent.returnValue = true;
  }
}

export function stopPropagation() {
  this.isPropagationStopped = true;
  const { nativeEvent } = this;
  if (nativeEvent.stopPropagation) {
    nativeEvent.stopPropagation();
  } else {
    nativeEvent.cancelBubble = true;
  }
}
