import React from "../_test/react";

export default class TestClass extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div>
        <h1 style={{ color: "#aaa" }}>hello </h1>
        <span style={{ color: "#eee" }}>{this.props.title}</span>
        <span>{this.props.children}</span>
      </div>
    );
  }
}
