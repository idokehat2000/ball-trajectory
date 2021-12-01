const velocityElement = document.getElementById("velocity");
const alphaInDegreesElement = document.getElementById("alpha");
const timeOutputElement = document.getElementById("timeInAir");
const distanceOutputElement = document.getElementById("totalDistance");
const maxHeightOutputElement = document.getElementById("maxHeight");
// for graph
var xPoints = [];
var yPoints = [];
// check if input data exists
function checkIfInputExists() {
  if (
    velocityElement.value.length === 0 &&
    alphaInDegreesElement.value.length === 0
  ) {
    alert("Please fill the requsted parameters");
    return false;
  } else if (velocityElement.value.length === 0) {
    alert("Please enter velocity parameter");
    return false;
  } else if (alphaInDegreesElement.value.length === 0) {
    alert("please enter alpha parameter");
    return false;
  } else {
    return true;
  }
}
// check if input data is valid
function checkValidInput(velocityValue, alphaDegreesValue) {
  if (velocityValue > 100000000) {
    alert("invalid velocity !");
    return false;
  } else if (velocityValue < 0 && alphaDegreesValue < 0) {
    alert("velocity and alpha must be postive numbers ! ");
    return false;
  } else if (velocityValue < 0) {
    alert("invalid velocity ! must be a postive number");
    return false;
  } else if (alphaDegreesValue < 0) {
    alert("invalid alpha ! must be a postive number");
    return false;
  } else if (alphaDegreesValue > 90) {
    alert("alpha must be below 90 !");
    return false;
  } else {
    return true;
  }
}
// process data
function calc() {
  const velocityValue = parseInt(velocityElement.value);
  const alphaInDegreesValue = parseInt(alphaInDegreesElement.value);
  if (
    !checkIfInputExists() ||
    !checkValidInput(velocityValue, alphaInDegreesValue)
  )
    return;
  const alphaInRadiansValue =
    (parseFloat(alphaInDegreesValue) * Math.PI) / 180.0;
  const timeInAir =
    (2 *
      parseFloat(velocityValue) *
      Math.sin(parseFloat(alphaInRadiansValue))) /
    9.81;
  const distance =
    (Math.pow(parseFloat(velocityValue), 2) *
      Math.sin(2 * parseFloat(alphaInRadiansValue))) /
    9.81;
  const maxHeight =
    Math.pow(
      parseFloat(velocityValue) * Math.sin(parseFloat(alphaInRadiansValue)),
      2
    ) /
    (2 * 9.81);
  const numberOfDataPoints = 10;
  const timeStamp = timeInAir / numberOfDataPoints;
  let currentDataPoint = 0;
  for (let i = 0; i <= numberOfDataPoints; i++) {
    const xPoint =
      velocityValue * Math.cos(alphaInRadiansValue) * currentDataPoint;
    const yPoint =
      velocityValue * Math.sin(alphaInRadiansValue) * currentDataPoint -
      (9.81 * Math.pow(currentDataPoint, 2)) / 2;
    xPoints[i] = xPoint;
    yPoints[i] = yPoint;
    currentDataPoint = currentDataPoint + timeStamp;
  }
  createTable(timeInAir, distance, maxHeight);
  document.getElementById("calc").addEventListener("click", () => {
    showTable();
    createChart();
    animation();
  });
}
// clear input boxes and output elements
function clear() {
  velocityElement.value = "";
  alphaInDegreesElement.value = "";
  timeOutputElement.innerHTML = "";
  distanceOutputElement.innerHTML = "";
  maxHeightOutputElement.innerHTML = "";
  document.getElementById("results-container").style.display = "none";
  document.getElementById("calc").removeEventListener("click", () => {
    showTable();
    createChart();
    animation();
  });
}
// clear event
document.getElementById("clear").addEventListener("click", clear);
// interpolate data to table
function createTable(timeInAir, distance, maxHeight) {
  timeOutputElement.innerHTML = `time: ${timeInAir
    .toFixed(2)
    .toString()} (sec)`;
  distanceOutputElement.innerHTML = `total distance: ${distance
    .toFixed(2)
    .toString()} (m)`;
  maxHeightOutputElement.innerHTML = `max height: ${maxHeight
    .toFixed(2)
    .toString()} (m)`;
}
function showTable() {
  document.getElementById("results-container").style.display = "block";
}
function createChart() {
  const trace = {
    x: xPoints,
    y: yPoints,
    type: "scatter",
  };
  const data = [trace];
  const layout = {
    title: "Trejectory graph",
    autosize: true,
    xaxis: {
      autorange: true,
    },
    yaxis: {
      autorange: true,
    },
  };
  const update = {
    height: 250,
  };
  Plotly.newPlot("chart", data, layout);
  Plotly.relayout("chart", update);
}
function animation() {
  document.getElementById("results-container").className = "results";
}
