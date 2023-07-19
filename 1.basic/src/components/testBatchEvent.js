import React from "../_test/react";

export default class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }

  click = (event) => {
    event.stopPropagation();
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);

    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number);
    }, 500);
  };

  clickDiv() {
    console.log("div click");
  }

  render() {
    return (
      <div onClick={() => this.clickDiv()}>
        {this.state.number}
        <button onClick={this.click}>plus</button>
      </div>
    );
  }
}
