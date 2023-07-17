import { findDom, compareTwoVDom } from "../_test/react-dom";
export const updateQueue = {
  isBatchingUpdate: false,
  updaters: new Set(),
  batchUpdate: () => {
    updateQueue.isBatchingUpdate = false;
    for (let update of updateQueue.updaters) {
      update.updateComponent();
    }
    updateQueue.updaters.clear();
  },
};

export class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;

    this.pendingStates = [];
  }

  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate();
  }

  emitUpdate() {
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this);
    } else {
      this.updateComponent();
    }
  }

  updateComponent() {
    console.log("update");
    if (this.pendingStates.length) {
      const { classInstance } = this;
      this.shouldUpdate(classInstance, this.getValues());
    }
  }

  shouldUpdate(classInstance, state) {
    classInstance.state = state;
    classInstance.forceUpdate();
  }

  getValues() {
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
    this.updater = new Updater(this);

    this.state = {};
  }

  setState(partialState) {
    this.updater.addState(partialState);
  }

  forceUpdate() {
    const dom = findDom(this.oldRenderVDom);
    const parentNode = dom.parentNode;
    const newRenderVDom = this.render();
    compareTwoVDom(parentNode, this.oldRenderVDom, newRenderVDom);

    this.oldRenderVDom = newRenderVDom;
  }
}
