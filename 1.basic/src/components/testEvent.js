import React from "../_test/react";

export default class TestClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 1 };
  }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  };

  render() {
    return (
      <div>
        <span>{this.state.number}</span>
        <button onClick={this.handleClick}>click</button>
      </div>
    );
  }
}
