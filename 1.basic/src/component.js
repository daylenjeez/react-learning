import { findDom, compareTwoVDom } from "./react-dom";
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;

    this.pendingStates = [];
  }

  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate();
  }

  emitUpdate() {
    this.updateComponent();
  }

  updateComponent() {
    const { classInstance, pendingStates } = this;
    if (pendingStates.length) {
      this.shouldUpdate(classInstance, this.getStates());
    }
  }

  shouldUpdate(classInstance, state) {
    classInstance.state = state;
    classInstance.forceUpdate();
  }

  getStates() {
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

  setState(partialState) {
    this.updater.addState(partialState);
  }

  forceUpdate() {
    const oldRenderVDom = this.oldRenderVDom;
    const oldDom = findDom(oldRenderVDom);
    const newRenderVDom = this.render();

    compareTwoVDom(oldDom.parentNode, oldRenderVDom, newRenderVDom);
    this.oldRenderVDom = newRenderVDom;
  }
}
