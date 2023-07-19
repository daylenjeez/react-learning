import React from "../_test/react";
const TestUseRef = () => {
  const ref = React.useRef();

  const handleClick = () => {
    ref.current.focus();
  };

  return (
    <div>
      <button onClick={handleClick}>plus</button>
      <input ref={ref} />
    </div>
  );
};

export default TestUseRef;
