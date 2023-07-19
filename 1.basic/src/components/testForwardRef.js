import React from "../_test/react";

const TestUseRef = React.forwardRef((_, ref) => <input ref={ref} />);

const TestForwardRef = () => {
  const ref = React.createRef();
  const handleClick = () => {
    ref.current.focus();
  };

  return (
    <div>
      <button onClick={handleClick}>focus</button>
      <TestUseRef ref={ref} />
    </div>
  );
};

export default TestForwardRef;
