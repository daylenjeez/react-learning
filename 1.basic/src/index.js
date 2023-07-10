import React from "./react";
import ReactDOM from "./react-dom";
// import { FunctionComponent } from "./components/Function";
// import { ClassComponent } from "./components/Class";

const UserName = (props, ref) => {
  return <input ref={ref} />;
};

const ForwardUserName = React.forwardRef(UserName);

// class UserName extends React.Component {
//   constructor(props) {
//     super(props);
//     this.input = React.createRef();
//   }

//   getFocus = () => {
//     console.log("focus");
//     this.input.current.focus();
//   };
//   render() {
//     return <input ref={this.input} />;
//   }
// }

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.userNameRef = React.createRef();
  }

  focus = () => {
    this.userNameRef.current.focus();
  };
  render() {
    return (
      <div>
        <button onClick={this.focus}>focus</button>
        <ForwardUserName ref={this.userNameRef} />
      </div>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById("root"));
