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

  function removeElement(e) {
    let value = e.target.getAttribute("data-value");
    setEquationArr(
      equationArr
        .filter((elem, index) => {
          return index != value;
        })
        .map((elem, index) => {
          elem.position = index * rectWidth + 15;
          return elem;
        })
    );
  }

  function handleMouseMove(e) {
    setMouseCoords({
      x: e.clientX - mouseOffset.x,
      y: e.clientY - mouseOffset.y,
    });
  }

  function handleMouseUp(e) {
    if (tempDragGraphic != "") {
      let value = e.target.getAttribute("data-value");
      let type = e.target.className;
      let alphabet = e.target.innerHTML;
      let canvasElementTop = canvasElement.current.offsetTop;
      let canvasElementHeight = canvasElement.current.clientHeight;
      let isInCanvasElement =
        e.clientY + window.scrollY > canvasElementTop &&
        e.clientY + window.scrollY < canvasElementTop + canvasElementHeight;
      setTempDragGraphic("");
      if (isInCanvasElement) {
        const boundRect = e.target.getBoundingClientRect();
        const position = boundRect.left + canvasElement.current.scrollLeft;
        setEquationArr(
          [
            ...equationArr,
            {
              value: value,
              type: type,
              alphabet: alphabet,
              position: position,
            },
          ]
            .sort((a, b) => {
              return a.position - b.position;
            })
            .map((elem, index) => {
              elem.position = index * rectWidth + 15;
              return elem;
            })
        );
      }
    }
  }

  function renderComponent(component) {
    return component;
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
      <div className="canvas" ref={canvasElement}>
        {equationArr.map((elem, index) => (
          <div className={elem.type}>
            <span
              className="remove"
              onClick={(e) => removeElement(e)}
              data-value={index}
            >
              x
            </span>
            {elem.alphabet}
          </div>
        ))}
        {comparator && (
          <div className="comparator">
            <span className="remove" onClick={() => setComparator("")}>
              x
            </span>
            {comparator}
          </div>
        )}
        {rhs && (
          <div className="rhs">
            <span className="remove" onClick={() => setRhs("")}>
              x
            </span>
            {rhs}
          </div>
        )}
      </div>
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
