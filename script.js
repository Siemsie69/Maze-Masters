// Genereert een willekeurig getal tussen 0 (inclusief) en het opgegeven maximum (exclusief)
function rand(max) {
  return Math.floor(Math.random() * max);
}

// Schudt een array door met behulp van de Fisher-Yates shuffle-algoritme
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Verandert de helderheid van een sprite door de kleurenwaarden van elk pixel aan te passen
function changeBrightness(factor, sprite) {
  var virtCanvas = document.createElement("canvas");
  virtCanvas.width = 500;
  virtCanvas.height = 500;
  var context = virtCanvas.getContext("2d");
  context.drawImage(sprite, 0, 0, 500, 500);
  // Hier komt de code om de helderheid van de sprite aan te passen

  // Haal de pixelgegevens op van het canvas
  var imgData = context.getImageData(0, 0, 500, 500);

  // Pas de kleurwaarden van elk pixel aan met de opgegeven factor
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = imgData.data[i] * factor;
    imgData.data[i + 1] = imgData.data[i + 1] * factor;
    imgData.data[i + 2] = imgData.data[i + 2] * factor;
  }
  // Plak de gewijzigde pixelgegevens terug op het canvas
  context.putImageData(imgData, 0, 0);

  // Maak een nieuw Image-object aan met de data van het virtuele canvas
  var spriteOutput = new Image();
  spriteOutput.src = virtCanvas.toDataURL();
  virtCanvas.remove();
  return spriteOutput;
}

function displayVictoryMess(moves) {
  // Toon een bericht met het aantal gemaakte zetten
  document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps.";
  toggleVisablity("Message-Container");
}

function toggleVisablity(id) {
  // Toon of verberg het element met de opgegeven id
  if (document.getElementById(id).style.visibility == "visible") {
    document.getElementById(id).style.visibility = "hidden";
  } else {
    document.getElementById(id).style.visibility = "visible";
  }
}

function Maze(Width, Height) {
  var mazeMap;
  var width = Width;
  var height = Height;
  var startCoord, endCoord;
  var dirs = ["n", "s", "e", "w"];
  var modDir = {
    n: {
      y: -1,
      x: 0,
      o: "s",
    },
    s: {
      y: 1,
      x: 0,
      o: "n",
    },
    e: {
      y: 0,
      x: 1,
      o: "w",
    },
    w: {
      y: 0,
      x: -1,
      o: "e",
    },
  };

  this.map = function () {
    // Geeft de mazeMap terug
    return mazeMap;
  };
  this.startCoord = function () {
    // Geeft de startcoördinaten terug
    return startCoord;
  };
  this.endCoord = function () {
    // Geeft de eindcoördinaten terug
    return endCoord;
  };

  function genMap() {
    // Genereer de mazeMap
    mazeMap = new Array(height);
    for (y = 0; y < height; y++) {
      mazeMap[y] = new Array(width);
      for (x = 0; x < width; ++x) {
        mazeMap[y][x] = {
          n: false,
          s: false,
          e: false,
          w: false,
          visited: false,
          priorPos: null,
        };
      }
    }
  }

  function defineMaze() {
    var isComp = false;
    var move = false;
    var cellsVisited = 1;
    var numLoops = 0;
    var maxLoops = 0;
    var pos = {
      x: 0,
      y: 0,
    };
    var numCells = width * height;
    while (!isComp) {
      move = false;
      mazeMap[pos.x][pos.y].visited = true;

      if (numLoops >= maxLoops) {
        shuffle(dirs);
        maxLoops = Math.round(rand(height / 8));
        numLoops = 0;
      }
      numLoops++;
      for (index = 0; index < dirs.length; index++) {
        var direction = dirs[index];
        var nx = pos.x + modDir[direction].x;
        var ny = pos.y + modDir[direction].y;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          // Controleer of de tile al is bezocht
          if (!mazeMap[nx][ny].visited) {
            // Maak een doorgang tussen de twee tiles
            mazeMap[pos.x][pos.y][direction] = true;
            mazeMap[nx][ny][modDir[direction].o] = true;

            // Stel de vorige positie van de nieuwe tile in
            mazeMap[nx][ny].priorPos = pos;
            // Verplaats de positie naar de nieuwe tile
            pos = {
              x: nx,
              y: ny,
            };
            cellsVisited++;
            // Roep deze functie opnieuw aan voor de nieuwe tile, totdat alle cellen zijn bezocht
            move = true;
            break;
          }
        }
      }

      if (!move) {
        // Als er geen richting is gevonden, verplaats de positie terug naar de vorige tile en roep deze functie opnieuw aan
        pos = mazeMap[pos.x][pos.y].priorPos;
      }
      if (numCells == cellsVisited) {
        isComp = true;
      }
    }
  }

  // Definieert start- en eindcoördinaten van het labyrint
  function defineStartEnd() {
    // Kiest willekeurig een getal tussen 0 en 3
    switch (rand(4)) {
      case 0:
        // Startcoördinaten zijn (0,0) en eindcoördinaten zijn (hoogte - 1, breedte - 1)
        startCoord = {
          x: 0,
          y: 0,
        };
        endCoord = {
          x: height - 1,
          y: width - 1,
        };
        break;
      case 1:
        // Startcoördinaten zijn (0, breedte - 1) en eindcoördinaten zijn (hoogte - 1, 0)
        startCoord = {
          x: 0,
          y: width - 1,
        };
        endCoord = {
          x: height - 1,
          y: 0,
        };
        break;
      case 2:
        startCoord = {
          x: height - 1,
          y: 0,
        };
        endCoord = {
          x: 0,
          y: width - 1,
        };
        break;
      case 3:
        startCoord = {
          x: height - 1,
          y: width - 1,
        };
        endCoord = {
          x: 0,
          y: 0,
        };
        break;
    }
  }

  // Genereer het labyrint
  genMap();
  // Definieer start- en eindcoördinaten
  defineStartEnd();
  // Creëer het doolhof
  defineMaze();
}

// Tekent het doolhof op het canvas
function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    //OM HET DOOLHOF TE TEKENEN
  var map = Maze.map();
  //OF OM DE MAP TE MAKEN OF OP TEHALEN
  var cellSize = cellsize;
  var drawEndMethod;
  ctx.lineWidth = cellSize / 40;

  this.redrawMaze = function (size) {
    cellSize = size;
    ctx.lineWidth = cellSize / 50;
    drawMap();
    drawEndMethod();
  };

  // Tekent een cel in het doolhof op basis van de muren
  function drawCell(xCord, yCord, cell) {
    //OM ELKE LOSSE CEL TE TEKENEN 1 VOOR 1
    var x = xCord * cellSize;
    var y = yCord * cellSize;

    if (cell.n == false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    if (cell.s === false) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.e === false) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.w === false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
  }

  // Tekent het volledige doolhof door alle cellen te doorlopen
  function drawMap() {
    for (x = 0; x < map.length; x++) {
      for (y = 0; y < map[x].length; y++) {
        drawCell(x, y, map[x][y]);
      }
    }
  }

  // Tekent het eindvlaggetje op de eindcoördinaten van het doolhof
  function drawEndFlag() {
    var coord = Maze.endCoord();
    var gridSize = 4;
    var fraction = cellSize / gridSize - 2;
    var colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 == 0) {
        colorSwap = !colorSwap;
      }
      for (let x = 0; x < gridSize; x++) {
        ctx.beginPath();
        ctx.rect(
          coord.x * cellSize + x * fraction + 4.5,
          coord.y * cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        if (colorSwap) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        }
        ctx.fill();
        colorSwap = !colorSwap;
      }
    }
  }

  // Tekent het eind-sprite op de eindcoördinaten van het doolhof
  function drawEndSprite() {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    var coord = Maze.endCoord();
    ctx.drawImage(
      endSprite,
      2,
      2,
      endSprite.width,
      endSprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  // Maakt het canvas leeg
  function clear() {
    var canvasSize = cellSize * map.length;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  }

  // Bepaalt welke methode gebruikt moet worden om het eind te tekenen (vlaggetje of sprite)
  if (endSprite != null) {
    drawEndMethod = drawEndSprite;
  } else {
    drawEndMethod = drawEndFlag;
  }
  // Maakt het canvas leeg, tekent het doolhof en het eind
  clear();
  drawMap();
  drawEndMethod();
}

function Player(maze, c, _cellsize, onComplete, sprite = null) {
  var ctx = c.getContext("2d");
  var drawSprite;
  var moves = 0;
  // Bepaalt welke methode gebruikt moet worden om de speler te tekenen (cirkel of sprite)
  drawSprite = drawSpriteCircle;
  if (sprite != null) {
    drawSprite = drawSpriteImg;
  }
  var player = this;
  var map = maze.map();
  var cellCoords = {
    x: maze.startCoord().x,
    y: maze.startCoord().y,
  };
  var cellSize = _cellsize;
  var halfCellSize = cellSize / 2;

  // Tekent de speler opnieuw met aangepaste celgrootte
  this.redrawPlayer = function (_cellsize) {
    cellSize = _cellsize;
    drawSpriteImg(cellCoords);
  };

  // Tekent de speler als een cirkel op de gegeven coördinaten
  function drawSpriteCircle(coord) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(
      (coord.x + 1) * cellSize - halfCellSize,
      (coord.y + 1) * cellSize - halfCellSize,
      halfCellSize - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    // Controleert of de speler de eindcoördinaten heeft bereikt
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  // Tekent de speler als een sprite op de gegeven coördinaten
  function drawSpriteImg(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.drawImage(
      sprite,
      0,
      0,
      sprite.width,
      sprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
    // Controleert of de speler de eindcoördinaten heeft bereikt
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  // Verwijdert de sprite op de gegeven coördinaten
  function removeSprite(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.clearRect(
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  // Controleert de toetsaanslagen en verplaatst de speler indien mogelijk
  function check(e) {
    var cell = map[cellCoords.x][cellCoords.y];
    moves++;
    switch (e.keyCode) {
      case 65:
      case 37: // west
        // Controleert of er een muur naar het westen is
        if (cell.w == true) {
          removeSprite(cellCoords);
          // Verplaatst de speler naar het westen
          cellCoords = {
            x: cellCoords.x - 1,
            y: cellCoords.y,
          };
          drawSprite(cellCoords);
        }
        break;
      case 87:
      case 38: // north
        // Controleert of er een muur naar het noorden is
        if (cell.n == true) {
          removeSprite(cellCoords);
          // Verplaatst de speler naar het noorden
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y - 1,
          };
          drawSprite(cellCoords);
        }
        break;
      case 68:
      case 39: // east
        // Controleert of er een muur naar het oosten is
        if (cell.e == true) {
          removeSprite(cellCoords);
          // Verplaatst de speler naar het oosten
          cellCoords = {
            x: cellCoords.x + 1,
            y: cellCoords.y,
          };
          drawSprite(cellCoords);
        }
        break;
      case 83:
      case 40: // south
        // Controleert of er een muur naar het zuiden is
        if (cell.s == true) {
          removeSprite(cellCoords);
          // Verplaatst de speler naar het zuiden
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y + 1,
          };
          drawSprite(cellCoords);
        }
        break;
    }
  }

  // Bindt de toetsen aan de controlefunctie
  this.bindKeyDown = function () {
    window.addEventListener("keydown", check, false);

    $("#view").swipe({
      swipe: function (
        event,
        direction,
        distance,
        duration,
        fingerCount,
        fingerData
      ) {
        switch (direction) {
          case "up":
            check({
              keyCode: 38,
            });
            break;
          case "down":
            check({
              keyCode: 40,
            });
            break;
          case "left":
            check({
              keyCode: 37,
            });
            break;
          case "right":
            check({
              keyCode: 39,
            });
            break;
        }
      },
      threshold: 0,
    });
  };

  // Ontkoppelt de toetsen van de controlefunctie
  this.unbindKeyDown = function () {
    window.removeEventListener("keydown", check, false);
    $("#view").swipe("destroy");
  };

  // Tekent de sprite op de startcoördinaten van het doolhof
  drawSprite(maze.startCoord());

  // Bindt de toetsen aan de controlefunctie
  this.bindKeyDown();
}

// Haalt het canvas-element op en initialiseert de context
var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
// Initialisatie van variabelen voor sprites, doolhof, tekenen en speler
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;

// Functie die wordt uitgevoerd bij het laden van de pagina
window.onload = function () {
  // Bepaalt de breedte en hoogte van de weergave
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();
  // Pas de grootte van het canvas aan op basis van de weergave
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }

  // Laad en bewerk sprites
  var completeOne = false;
  var completeTwo = false;

  // Functie om te controleren of sprites geladen zijn
  var isComplete = () => {
    if (completeOne === true && completeTwo === true) {
      console.log("Runs");
      // Wacht 500 milliseconden voordat het doolhof wordt gemaakt
      setTimeout(function () {
        makeMaze();
      }, 500);
    }
  };

  // Laad speler sprite
  sprite = new Image();
  sprite.src = "user.png";

  // Laad finish sprite
  finishSprite = new Image();
  finishSprite.src = "home.png";
};

// Functie die wordt uitgevoerd bij het aanpassen van het formaat van het venster
window.onresize = function () {
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();

  // Pas de grootte van het canvas aan op basis van de weergave
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }

  // Bereken nieuwe celgrootte en teken het doolhof en de speler opnieuw
  cellSize = mazeCanvas.width / difficulty;
  if (player != null) {
    draw.redrawMaze(cellSize);
    player.redrawPlayer(cellSize);
  }
};

// Functie om het doolhof te maken
function makeMaze() {
  // Als er al een speler is, ontkoppel de toetsen
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }

  // Haal de moeilijkheidsgraad op en bereken de celgrootte
  var e = document.getElementById("diffSelect");
  difficulty = e.options[e.selectedIndex].value;
  cellSize = mazeCanvas.width / difficulty;
  // Maak een nieuw doolhof, teken het en maak een nieuwe speler
  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
  player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
  // Als het doolhof-container niet volledig zichtbaar is, maak het zichtbaar
  if (document.getElementById("mazeContainer").style.opacity < "100") {
    document.getElementById("mazeContainer").style.opacity = "100";
  }
}

//TIMERS

let timerInterval;
let time = 0;
function startOrResetMaze(length) {
    time = length;
      resetTimer();
    }
    
function resetTimer() {
  clearInterval(timerInterval);
  document.getElementById("timer").innerHTML = "Your time left: " + time;
  timerInterval = setInterval(countback, 1000);
}

function countback() {
  if (time > 0) {
    time--;
    document.getElementById("timer").innerHTML = "Your time left: " + time;
  } else {
    clearInterval(timerInterval);
    alert ("Your time is over");
  }
}
