import { findDOM, compareTwoDom } from "./react-dom";

export let updateQueue = {
  isBathingUpdate: false,
  updaters: new Set(),
  batchUpdate() {
    updateQueue.isBathingUpdate = false;
    for (const update in updateQueue.updaters) {
      update.updateComponent();
    }
    updateQueue.updaters.clear();
  },
};

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;

    this.pendingStates = [];
  }

  addState(partialStates) {
    this.pendingStates.push(partialStates);
    this.emitUpdate();
  }

  emitUpdate() {
    if (updateQueue.isBathingUpdate) {
      updateQueue.updaters.add(this);
    } else {
      this.updateComponent();
    }
  }

  updateComponent() {
    const { classInstance, pendingStates } = this;
    if (pendingStates.length) {
      this.shouldUpdate(classInstance, this.getState());
    }
  }

  shouldUpdate(classInstance, state) {
    classInstance.state = state;
    classInstance.forceUpdate();
  }

  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach((nextState) => (state = { ...state, ...nextState }));
    return state;
  }
}

export class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};

    this.updater = new Updater(this);
  }

  setState(partialStates) {
    this.updater.addState(partialStates);
  }

  forceUpdate() {
    const oldRenderVDom = this.oldRenderVDom;
    const oldDom = findDOM(oldRenderVDom);
    const newRenderVDom = this.render();
    compareTwoDom(oldDom.parentNode, oldRenderVDom, newRenderVDom);
    this.oldRenderVDom = newRenderVDom;
  }
}
