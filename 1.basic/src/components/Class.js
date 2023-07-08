import React from "../react";

export class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }

  click() {
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
