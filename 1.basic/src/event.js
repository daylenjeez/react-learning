import { updateQueue } from "./react/component";

export const addEvent = (dom, eventType, handler) => {
  let store = dom.store || (dom.store = {});
  store[eventType] = handler; //store.onclick = handler
  if (!document[eventType]) document[eventType] = dispatchEvent;
};

function dispatchEvent(event) {
  updateQueue.isBathingUpdate = true; //事件执行前，标记为true
  let { target, type } = event;
  let eventType = `on${type}`;

  let currentTarget = target;
  while (currentTarget) {
    const { store } = currentTarget;
    const handler = store?.[eventType];
    const syntheticEvent = createSyntheticEvent(event);
    handler?.(syntheticEvent);
    if (syntheticEvent.isPropagationStopped) break;
    currentTarget = currentTarget.parentNode;
  }

  updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
  const syntheticEvent = {};
  for (let key in nativeEvent) {
    let value = nativeEvent[key];
    if (typeof value === "function") value = value.bind(nativeEvent);
    syntheticEvent[key] = value;
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.isDefaultPrevented = false;
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.isPropagationStopped = false;
  syntheticEvent.stopPropagation = stopPropagation;
  return syntheticEvent;
}

function preventDefault() {
  this.isDefaultPrevented = true;
  const event = this.nativeEvent;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = true;
  }
}

function stopPropagation() {
  this.isPropagationStopped = true;
  const event = this.nativeEvent;
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
}
