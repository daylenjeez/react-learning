import React from "../react";

export class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 1 };
  }

  click() {
    this.setState({ number: this.state.number + 1 });
  }

  render() {
    return (
      <div>
        {this.state.number}
        <button onClick={() => this.click()}>plus</button>
      </div>
    );
  }
}
