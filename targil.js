const velocity = document.getElementById("velocity");
const alpha = document.getElementById("zavit");
const timeOutput = document.getElementById("timeInAir");
const distanceOutput = document.getElementById("totalDistance");
const maxHeightOutput = document.getElementById("maxHeight");
// for graph
var xPoints = [];
var yPoints = [];
function calc() {
  // check if input boxes are not full
  if (velocity.value.length === 0 && alpha.value.length === 0) {
    alert("Please fill the requsted parameters");
    return 
  } else if (velocity.value.length === 0) {
    alert("Please enter velocity parameter");
    return
  } else if (velocity.value > 100000000) {
    alert("invalid velocity !");
    return
  } else if (alpha.value.length === 0) {
    alert("please enter alpha parameter");
    return
  } else if (velocity.value < 0 && alpha.value < 0) {
    alert("velocity and alpha must be postive numbers ! ");
    return
  } else if (velocity.value < 0) {
    alert("invalid velocity ! must be a postive number");
    return
  } else if (alpha.value < 0) {
    alert("invalid alpha ! must be a postive number");
    return
  } else if (alpha.value > 90) {
    alert("alpha must be below 90 !");
    return
  } else {
    const zavit = (parseFloat(alpha.value) * Math.PI) / 180.0;
    const time =
      (2 * parseFloat(velocity.value) * Math.sin(parseFloat(zavit))) / 9.81;
    timeOutput.innerHTML = `time: ${time.toFixed(2).toString()} (sec)`;
    const distance =
      (Math.pow(parseFloat(velocity.value), 2) *
        Math.sin(2 * parseFloat(zavit))) /
      9.81;
    distanceOutput.innerHTML = `total distance: ${distance
      .toFixed(2)
      .toString()} (m)`;
    const maxHeight =
      Math.pow(parseFloat(velocity.value) * Math.sin(parseFloat(zavit)), 2) /
      (2 * 9.81);
    maxHeightOutput.innerHTML = `max height: ${maxHeight
      .toFixed(2)
      .toString()} (m)`;
    var timeStamp = time / 10;
    var currentTime = 0;
    var xPoint = 0;
    var yPoint = 0;
    for (let i = 0; i <= 10; i++) {
      xPoint = velocity.value * Math.cos(zavit) * currentTime;
      yPoint =
        velocity.value * Math.sin(zavit) * currentTime -
        (9.81 * Math.pow(currentTime, 2)) / 2;
      xPoints[i] = xPoint;
      yPoints[i] = yPoint;
      currentTime = currentTime + timeStamp;
    }
    document.getElementById("calc").addEventListener("click", createChart);
    document.getElementById("calc").addEventListener("click", showTable);
    document.getElementById("calc").addEventListener("click", animation);
  }
}
// clear input boxes and output div
function clear() {
  velocity.value = "";
  alpha.value = "";
  timeOutput.innerHTML = "";
  distanceOutput.innerHTML = "";
  maxHeightOutput.innerHTML = "";
  document.getElementById("results-container").style.display = "none";
  document.getElementById("calc").removeEventListener("click", createChart);
  document.getElementById("calc").removeEventListener("click", showTable);
  document.getElementById("calc").removeEventListener("click", animation);
}
document.getElementById("clear").addEventListener("click", clear);

function showTable() {
  document.getElementById("results-container").style.display = "block";
}

function animation() {
  document.getElementById("results-container").className = "results";
}

function createChart() {
  var trace = {
    x: xPoints,
    y: yPoints,
    type: "scatter",
  };
  var data = [trace];
  var layout = {
    title: "Trejectory graph",
    autosize: true,
    xaxis: {
      autorange: true,
    },
    yaxis: {
      autorange: true,
    },
  };
  var update = {
    height: 250,
  };
  Plotly.newPlot("chart", data, layout);
  Plotly.relayout("chart", update);
}
