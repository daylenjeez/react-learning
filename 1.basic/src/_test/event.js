import { updateQueue } from "./component";
export const addEvent = (dom, eventType, handler) => {
  const store = dom.store || (dom.store = {});
  store[eventType] = handler;
  if (!document[eventType]) document[eventType] = dispatchEvent;
};

export const dispatchEvent = (nativeEvent) => {
  updateQueue.isBatchingUpdate = true;
  const { type, target } = nativeEvent;
  const { store } = target;
  const handler = store?.[`on${type}`];
  handler?.(nativeEvent);

  updateQueue.batchUpdate();
};
