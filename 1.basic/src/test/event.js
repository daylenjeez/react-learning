import { updateQueue } from "./component";

export const addEvent = (dom, eventType, handler) => {
  const store = dom.store || (dom.store = {});
  store[eventType] = handler;
  if (!document[eventType]) document[eventType] = dispatchEvent;
};

function dispatchEvent(event) {
  updateQueue.isBathingUpdate = true;
  const { target, type } = event;
  const eventType = `on${type}`;

  let currentTarget = target;
  while (currentTarget) {
    const { store } = currentTarget;
    const handler = store?.[eventType];
    const syntheticEvent = createSyntheticEvent(event);
    handler?.(syntheticEvent);
    if (syntheticEvent.isPropagationStop) break;
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
  syntheticEvent.isPreventEvent = false;
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.isPropagationStop = false;
  syntheticEvent.stopPropagation = stopPropagation;
  return syntheticEvent;
}

function preventDefault() {
  this.isPreventEvent = true;
  const event = this.nativeEvent;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = true;
  }
}

function stopPropagation() {
  this.isPropagationStop = true;
  const event = this.nativeEvent;
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
}
