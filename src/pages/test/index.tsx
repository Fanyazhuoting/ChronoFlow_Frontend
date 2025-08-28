import { useState } from "react";
import ChangeElement from "./ChangeStatus";
import Async from "./Async";

export default function TestPage() {
  const [changedTest, setChangedTest] = useState(false);

  const changedTestHandler = () => {
    setChangedTest((prev) => !prev);
  };

  return (
    <div>
      <h1>Test Page</h1>
      {changedTest && <ChangeElement />}
      {!changedTest && <p>Test not changed</p>}
      <button onClick={changedTestHandler}>Change Test Button</button>
      <Async />
    </div>
  );
}
