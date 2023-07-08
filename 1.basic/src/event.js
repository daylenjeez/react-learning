import { updateQueue } from "./component";

export const addEvent = (dom, eventType, handler) => {
  let store = dom.store || (dom.store = {});
  store[eventType] = handler; //store.onclick = handler
  if (!document[eventType]) document[eventType] = dispatchEvent;
};

function dispatchEvent(event) {
  updateQueue.isBathingUpdate = true; //事件执行前，标记为true
  let { target, type } = event;
  let eventType = `on${type}`;
  const { store } = target;
  const handler = store?.[eventType];
  handler?.();

  updateQueue.batchUpdate();
}
