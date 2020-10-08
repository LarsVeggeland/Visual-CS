//<--Variables-->

const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");
const ctxWidth = 600;
const ctxHeight = 600;
let grid = [];
var startNode = null;
var goalNode = null;



//<--Drawing Section--> 

function drawGrid(rows, cols) {
  myCanvas.setAttribute("width", ctxWidth);
  myCanvas.setAttribute("height", ctxHeight);
  var rowPos = 0;
  for (var i = 0; i < rows; i++) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.moveTo(0, rowPos);
    ctx.lineTo(ctxWidth, rowPos);
    ctx.stroke();
    rowPos += ctxHeight/(rows-1);
  }
  var colPos = 0;
  for (var i = 0; i < cols; i++) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.moveTo(colPos, 0);
    ctx.lineTo(colPos, ctxWidth);
    ctx.stroke();
    colPos += ctxWidth/(cols-1);
  }
}

function make(x, y) {
  window.alpha = ctxWidth/(x - 1);
  window.beta = ctxHeight/(y - 1);
  grid = [];
  for(var i = 0; i < x; i++){
    var row = [];
    for(var j = 0; j < y; j++){
      let node = new Vertex(i, j);
      row.push(node);
      drawSquare(node);
    }
    grid.push(row);
  }
  //drawGrid(x, y);
}

/**
 * Draws a square in the grid at the specified position with the provided calculated color
 * @param {Vertex} node 
 */
function drawSquare(node) {
    ctx.fillStyle = getSquareColor(node);
    ctx.fillRect(window.alpha*node.x, window.beta*node.y, window.alpha, window.beta);
}

/**
 * Calculates the shade of blue for a vertex based on its walkability
 * @param {Vertex} node 
 * @returns {String} rgba(0, 0, proper shade of blue)
 */
function getSquareColor(node) {
  switch (node.walkability) {

    case Infinity:
      return "black";

    case 0:
      return "orange";

    default:
      return `rgb(${255 - (node.walkability-1)*27}, ${255 - 15*node.walkability}, 255)`;
  }
}

/**
 * Tries to draw amount of random squares in the grid, makes no guarantee that all will be drawn
 * @param {number} amount 
 */
function someSquares(amount) {
  const x = (ctxWidth/window.alpha) + 1;
  const y = (ctxHeight/window.beta) + 1;
  for (var i = 0; i < amount; i++){
    var row = makeRandomInt(0, x);
    var col = makeRandomInt(0, y);
    grid[row][col].walkable = false;
    grid[row][col].walkability = Infinity;
    drawSquare(grid[row][col]);
  }
}


function fillHorizontalLine(xStart, xEnd, y) {
  //should call checkHrzLineAvailable() before being used
  //@params inclusive, exlusive
  if (xStart === xEnd) {
    throw new  Exception("There must be range, i,e, start must != end");
  }
  if (xStart > xEnd) {
    var temp = xStart;
    xStart = xEnd;
    xEnd = temp;
  } 
  for (var i = xStart; i < xEnd; i += window.alpha) {
    drawSquare(i, y);
  }
}

function fillVerticalLine(yStart, yEnd, x) {
  //should call checkHrzLineAvailable() before being used
  //@params inclusive, exlusive
  if (yStart === yEnd){
    throw new  Exception("There must be range, i,e, start must != end");
  }
  if (yStart > yEnd){
    var temp = yStart;
    yStart = yEnd;
    yEnd = temp;
  } 
  for (var i = yStart; i < yEnd; i += window.beta) {
    drawSquare(x, i);
  }
}

function fillDiagonalLine(xStart, yStart, xEnd, yEnd) {
  if (!arePointsDiagonal(xStart, yStart, xEnd, yEnd)){
    alert("NEIN! NEIN! We cansnot havse a diagjional Leine througggh thizze pointzhe!\nShceisse!");
  }
  if (xStart > xEnd) {
    tempX = xEnd;
    xEnd = xStart;
    xStart = tempX;
  }
  if (yStart > yEnd){
    y = yStart - 1;
    for (var x = xStart; x < xEnd; x ++) {
      drawSquare(x, y);
      y--;
    }
  }
  else { 
    y = yStart;
    for (var x = xStart; x < xEnd; x ++) {
      drawSquare(x, y);
      y++;
    }
  }
}



//--Utils Section--

/**
 * Provides a random integer in the range provided (inclusive, inclusive)
 * @param {number} lower 
 * @param {number} upper 
 */
function makeRandomInt(lower, upper) {
  let seed = Math.random();
  return Math.ceil(seed * (upper - lower - 1) + lower - 1);
}

function checkHrzLineAvailable(xStart, xEnd, y) {
  //returns false an x value where tile is occupied, if occupied
  //returns true and null if line can be filled
  if (xStart > xEnd) {
    var temp = xStart;
    xStart = xEnd;
    xEnd = temp;
  } 
  for (var i = xStart; i < xEnd; i++) {
    if (grid[i][y] != 0) {
      return false;
    }
  }
  return true;
}

function checkVtcLineAvailable(yStart, yEnd, x) {
  //returns false an x value where tile is occupied, if occupied
  //returns true and null if line can be filled
  if (yStart > yEnd) {
    var temp = yStart;
    yStart = yEnd;
    yEnd = temp;
  } 
  for (var i = yStart; i < yEnd; i++) {
    if (grid[x][i] != 0) {
      return false;
    }
  }
  return true;
}

function checkLineDiagonalAvailable(xStart, yStart, xEnd, yEnd) {
  if (xStart > xEnd) {
    tempX = xEnd;
    xEnd = xStart;
    xStart = tempX;
  }
  if (yStart > yEnd){
    y = yStart - 1;
    for (var x = xStart; x < xEnd; x ++) {
      if (grid[x][y] != 0) return false;
      y--;
    }
  }
  y = yStart;
  for (var x = xStart; x < xEnd; x ++) {
      if (grid[x][y] != 0) return false;
      y++;
  }
  return true;
}

function arePointsDiagonal(xStart, yStart, xEnd, yEnd){
  if (xStart > xEnd) {
    tempX = xEnd;
    xEnd = xStart;
    xStart = tempX;
  }
  if (yStart > yEnd) {
    var temp = yStart;
    yStart = yEnd;
    yEnd = temp;
  } 
  return (xEnd - xStart) === (yEnd - yStart); 
}

function makeOwnGrid(){
  let x = document.getElementById("provX").value;
  let y = document.getElementById("provY").value;
  make(x, y);
}

document.addEventListener('DOMContentLoaded', function() {
  make(40, 40);
}, false);

/**
 * 
 * @param {String} input
 */
function parseCoordinate(input) {
  input.trim();
  if (input.includes(",")) {
    let coordinate = []
    let commaPos = input.indexOf(",");
    coordinate.push(Number.parseInt(input.substring(0, commaPos)));
    coordinate.push(Number.parseInt(input.substring(commaPos+1)));
    if (coordinate.includes(NaN)) {
      alert(`${input} is invalid, must use the format x, y`);
      return NaN;
    }
    let x = coordinate[0];
    let y = coordinate[1];

    if (x < 0 || x > 39 || y < 0 || y > 39) {
      alert("Position provided is outside the grid");
      return NaN;
    }

    return coordinate;
  }
  else {
    alert(`${input} is invalid, must use the format (x, y)`);
  }
  
}


//<--Pathfinding-->

/**
 * A class for creating vertex objects used in pathfinding algorithms.
 * Each object has a x and y position and a boolean attribute declaring its walkability
 */
class Vertex {
  /**
   * 
   * @param {number} xPos 
   * @param {number} yPos 
   */
  constructor(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
    this.lastVertex = null;
    this.distance = null;
    this.walkable = true;
    this.walkability = Vertex.createWalkability();
  }

  /**
   * Returns whether two vertex objects are the same. Determined by their respective positions in the grid
   * @param {Vertex} obj1
   * @param {Vertex} obj2
   */
  static equals(obj1, obj2) {
    return obj1.x === obj2.x && obj1.y === obj2.y; 
  }

  /**
   * @returns {number} between 1 and 10
   */
  static createWalkability() {
    return makeRandomInt(1, 10);
  }

  /**
   * Compares two vertecies by their distance 
   * @param {Vertex} other
   * @return {number} 1 if this is greater, 0 if equal and -1 if other is larger
   */
  compareTo(other) {
    return 1 * (this.distance > other.distance) + -1 * (this.distance < other.distance) + 0;
  }

  /**
   * @returns {array} an array containing all (in most cases) 8 neighbours surounding this
   */
  getNeihbours() {
    var neighbours = [];
    for (var xPos = this.x - 1; xPos <= this.x + 1; xPos++) {
      for (var yPos = this.y - 1; yPos <= this.y + 1; yPos++) {
        if (xPos < 0 || xPos >= (ctxWidth/window.alpha) + 1 ||
         yPos < 0 || yPos >= (ctxHeight/window.beta) + 1) {
           continue;
         }
        if (this.x == xPos && this.y == yPos){
          continue;
        }
        neighbours.push([xPos, yPos]);
      }
    }
    console.log(neighbours);
    return neighbours;
  }

  /**
   * 
   * @param {Vertex} lastVertex 
   */
  setLastVertex(lastVertex) {
    this.lastVertex = lastVertex;
  }

  /**
   * Uncolors the vertex whilst redrawing the removed lines from the grid
   */
  uncolor() {

    drawSquare(this.x, this.y, "#f4ebfa", true);

    ctx.lineWidth = 0.5;
    ctx.beginPath();

    ctx.moveTo(this.x*window.alpha, this.y*window.beta);
    ctx.lineTo((this.x+1)*window.alpha, this.y*window.beta);

    ctx.moveTo(this.x*window.alpha, (this.y+1)*window.beta);
    ctx.lineTo((this.x+1)*window.alpha, (this.y+1)*window.beta);

    ctx.moveTo(this.x*window.alpha, this.y*window.beta);
    ctx.lineTo(this.x*window.alpha, (this.y+1)*window.beta);

    ctx.moveTo((this.x+1)*window.alpha, this.y*window.beta);
    ctx.lineTo((this.x+1)*window.alpha, (this.y+1)*window.beta);

    ctx.stroke();
  }
}



//<--User interaction-->

function setStartNode() {
  let input = document.getElementById("startPos").value;
  let position = parseCoordinate(input);
  xPos = position[0];
  yPos = position[1];
  drawSquare(xPos, yPos, "yellow", true);
  //Temporary:
  if (startNode instanceof Vertex) {
    startNode.uncolor();
  }
  startNode = grid[xPos][yPos];
}

function setGoalNode() {
  let input = document.getElementById("goalPos").value;
  let position = parseCoordinate(input);
  xPos = position[0];
  yPos = position[1];
  drawSquare(xPos, yPos, "orange", true);
  if (goalNode instanceof Vertex) {
    goalNode.uncolor();
  }
  goalNode = grid[xPos][yPos];
}

/**
 * Finds the shortest walkable path from the start node to the goal node using best first search
 */
function astar() {

  /**
   * Finds the euclidian distance between the goal node and node
   * @param {Vertex} node
   * @returns {number}
   */
  function h_cost(node) {
    return Math.sqrt(Math.pow(node.x - goalNode.x, 2) + Math.pow(node.y - goalNode.y, 2));
  }

  /**
   * Finds an estimate for the total distance of the path from the start node, through node, to the goal node
   * @param {Vertex} node 
   * @returns {number}
   */
  function f_cost(node) {
    return node.distance + h_cost(node);
  }
}