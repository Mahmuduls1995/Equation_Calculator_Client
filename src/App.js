import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

function App() {
  const canvasElement = useRef();
  const [operandsArr, setOperandsArr] = useState([]);
  const [operatorArr, setOperatorArr] = useState(["+", "-", "*", "/"]);
  const [comparatorArr, setComparatorArr] = useState(["<", ">"]);
  const [comparator, setComparator] = useState("");
  const [rhs, setRhs] = useState("");
  const [equationArr, setEquationArr] = useState([]);
  const [tempDragGraphic, setTempDragGraphic] = useState("");
  const [mouseCoords, setMouseCoords] = useState({
    x: 0,
    y: 0,
  });
  const mouseOffset = {
    x: 50,
    y: 50,
  };
  const rectWidth = 140;

  useEffect(() => {
    axios
      .get("http://localhost:8000/alphabets/")
      .then((response) => setOperandsArr(response.data))
      .catch((err) => console.log(err));
  }, []);

  function drag(e) {
    setTempDragGraphic(
      <div
        className={e.target.className}
        data-value={e.target.getAttribute("data-value")}
      >
        {e.target.innerHTML}
      </div>
    );
    setMouseCoords({
      x: e.clientX - mouseOffset.x,
      y: e.clientY - mouseOffset.y,
    });
  }

  function evaluate(arr, comparator, rhs) {
    let expression = "";
    arr.forEach((elem) => (expression += elem.value + " "));
    expression = expression + comparator + " " + rhs;
    try {
      alert(eval(expression));
    } catch (err) {
      alert("This is not a valid equation");
    }
  }

  

  return (
    <div
      className="App"
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseUp={(e) => handleMouseUp(e)}
    >
      <div
        className="tempDragGraphic"
        style={{
          position: "fixed",
          opacity: 0.6,
          zIndex: 3,
          left: mouseCoords.x,
          top: mouseCoords.y,
        }}
      >
        {renderComponent(tempDragGraphic)}
      </div>
      <div className="operands">
        {operandsArr.map((operand) => (
          <div
            className="operand"
            draggable="true"
            onDragStart={(e) => drag(e)}
            data-value={operand.value}
          >
            {operand.alphabet}
          </div>
        ))}
      </div>
      <br />
      <div className="operators">
        {operatorArr.map((operator) => (
          <div
            className="operator"
            draggable="true"
            onDragStart={(e) => drag(e)}
            data-value={operator}
          >
            {operator}
          </div>
        ))}
        <span className="space"></span>
        {comparatorArr.map((comparator) => (
          <div
            className="comparator"
            data-value={comparator}
            onClick={(e) => setComparator(e.target.getAttribute("data-value"))}
          >
            {comparator}
          </div>
        ))}
        <span className="space"></span>
        <div
          className="rhs"
          onClick={() => {
            let rhs = prompt("What should be the rhs integer?", "");
            rhs.trim() != "" ? setRhs(rhs) : setRhs("");
          }}
        >
          RHS Integer
        </div>
      </div>
      <br />
      
      <button
        className="submit"
        onClick={() => evaluate(equationArr, comparator, rhs)}
      >
        Calculate
      </button>

  <div><h2>Powered By @ Sheikh Mahmudul Hasan</h2></div>

    </div>
  );
}

export default App;
