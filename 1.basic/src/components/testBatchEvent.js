import React from "react";

export default class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log("constructor");
    this.state = { number: 0 };
  }

  componentDidMount() {
    console.log("did mount");
  }

  componentWillMount() {
    console.log(1, "mount");
  }

  componentWillReceiveProps() {
    console.log("receive");
  }

  componentWillUnmount() {
    console.log("unmount");
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
    console.log("render");
    return (
      <div onClick={() => this.clickDiv()}>
        {this.state.number}
        <button onClick={this.click}>plus</button>
      </div>
    );
  }
}
