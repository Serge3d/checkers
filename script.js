var myGame = new MyGame();

// Целочисленное деление
function div(val, by) {
  return (val - val % by) / by;
}
// Вычисление середины отрезка
function calcMiddle(start, width, pos) {
  return (start + width * pos - width / 2);
}

// Находится ли точка в прямоугольнике
function inRect(x, y, startX, startY, endX, endY) {
  return (x > startX - 1 && x < endX + 1 && y > startY - 1 && y < endY + 1);
}
// Случайное число в диапазоне
function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}
// Функция поиска элемента в массиве, возвращает его номер или -1
if ([].indexOf) {
  var find = function(array, value) {
    return array.indexOf(value);
  };
} else {
  var find = function(array, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === value) return i;
    }
    return -1;
  };
}

// Конструктор объекта "Шашки"
function Checkers() {

  // Чей текущий ход
  var currentPlayer = 0;
  // Смена хода
  function changePlayer() {
    currentPlayer = currentPlayer ? 0 : 1;
  }

  // Конструктор объекта "Шашка"
  // player - номер игрока: 0 - игрок 1, 1 - игрок 2
  // x, y - текущие координаты на поле
  // type - тип шашки: checker, king
  function Checker(checkerParam) {
    this.player = checkerParam.player;
    this.x = checkerParam.x;
    this.y = checkerParam.y;
    this.type = checkerParam.type;
    this.possibleMoves = [];
  }
  // Массив шашек
  var checkers = [];
  // Номер выбранной шашки
  var selectChecker = -1;
  // Заполнение массива шашек по умолчанию
  this.newGame = function() {
    checkers = [];
    var i;
    var checkerParam = {};
    checkerParam.player = 1;
    checkerParam.type = "checker";
    for (i = 0; i < 12; i++) {
      checkerParam.x = (i * 2 % 8) + 2;
      checkerParam.y = div(i * 2, 8) + 1;
      if (checkerParam.y == 2) {
        checkerParam.x -= 1;
      }
      addChecker(checkerParam);
    }
    checkerParam.player = 0;
    for (i = 0; i < 12; i++) {
      checkerParam.x = (i * 2 % 8) + 1;
      checkerParam.y = 8 - div(i * 2, 8);
      if (checkerParam.y == 7) {
        checkerParam.x += 1;
      }
      addChecker(checkerParam);
    }
    allPossibleMoves();
  };
  // Расчет возможных ходов для всех шашек
  function allPossibleMoves() {
    for (var i = 0; i < checkers.length; i++) {
      checkers[i].possibleMoves = searchPossibleMoves(i);
    }
  }

  // Заполнение списка возможных ходов
  function searchPossibleMoves(checkerIndex) {
    var possibleMoves = [];
    if (checkerIndex == -1) {
      return possibleMoves;
    }
    var x = checkers[checkerIndex].x;
    var y = checkers[checkerIndex].y;
    var player = checkers[checkerIndex].player;
    // В какую сторону ходит шашка
    var moveX = 1;
    var moveY = player ? 1 : -1;
    // Добавление ходов
    addMove(x - moveX, y + moveY);
    addMove(x + moveX, y + moveY);
    if (checkers[checkerIndex].type == "king") {
      addMove(x - moveX, y - moveY);
      addMove(x + moveX, y - moveY);
    }
    // addKillMove(x - 2 * moveX, y + 2 * moveY, x - moveX, y + moveY);
    // addKillMove(x + 2 * moveX, y + 2 * moveY, x + moveX, y + moveY);
    // addKillMove(x - 2 * moveX, y - 2 * moveY, x - moveX, y - moveY);
    // addKillMove(x + 2 * moveX, y - 2 * moveY, x + moveX, y - moveY);

    addKillMoves(x, y);

    // Добавляет ход, если он возможен, с учетом цепного убийство
    function addMove(x, y) {
      if (findChecker(x, y) != -1) {
        return false;
      }
      var chekerParam = {
        x: x,
        y: y
      };
      possibleMoves.push(new Checker(chekerParam));
      possibleMoves[possibleMoves.length - 1].kill = [];
      return true;
    }
    // Добавляет ход с взятием шашки противника
    function addKillMove(x, y, killX, killY, chainIndex) {
      if (chainIndex === undefined) {
        chainIndex = -1;
      }
      if (findChecker(x, y) != -1) {
        return -1;
      }
      var killChecker = findChecker(killX, killY);
      if (killChecker == -1) {
        return -1;
      }
      if (player == checkers[killChecker].player) {
        return -1;
      }
      if (chainIndex + 1 && find(possibleMoves[chainIndex].kill, killChecker) + 1) {
        return -1;
      }
      var chekerParam = {
        x: x,
        y: y
      };
      possibleMoves.push(new Checker(chekerParam));
      possibleMoves[possibleMoves.length - 1].kill = [];
      if (chainIndex + 1) {
        possibleMoves[possibleMoves.length - 1].kill = possibleMoves[chainIndex].kill;
      }
      possibleMoves[possibleMoves.length - 1].kill.push(killChecker);
      return (possibleMoves.length - 1);
    }

    function addKillMoves(x, y, chainIndex) {
      if (chainIndex === undefined) {
        chainIndex = -1;
      }
      var newChainIndex;
      newChainIndex = addKillMove(x - 2 * moveX, y + 2 * moveY, x - moveX, y + moveY, chainIndex);
      if (newChainIndex + 1) {
        addKillMoves(x - 2 * moveX, y + 2 * moveY, newChainIndex);
      }
      newChainIndex = addKillMove(x + 2 * moveX, y + 2 * moveY, x + moveX, y + moveY, chainIndex);
      if (newChainIndex + 1) {
        addKillMoves(x + 2 * moveX, y + 2 * moveY, newChainIndex);
      }
      newChainIndex = addKillMove(x - 2 * moveX, y - 2 * moveY, x - moveX, y - moveY, chainIndex);
      if (newChainIndex + 1) {
        addKillMoves(x - 2 * moveX, y - 2 * moveY, newChainIndex);
      }
      newChainIndex = addKillMove(x + 2 * moveX, y - 2 * moveY, x + moveX, y - moveY, chainIndex);
      if (newChainIndex + 1) {
        addKillMoves(x + 2 * moveX, y - 2 * moveY, newChainIndex);
      }
    }

    // Возвращает возможные ходы
    return possibleMoves;
  }

  // Добавление шашки
  function addChecker(checkerParam) {
    checkers.push(new Checker(checkerParam));
  }
  // Удаление шашки по индексу
  function removeChecker(index) {
    checkers.splice(index, 1);
  }
  // Поиск шашки в заданной клетке, 
  // возвращает ее индекс или -1 если клетка пустая
  // -2 если клетка не на поле
  function findChecker(x, y) {
    if (!cellInTable(x, y)) {
      return -2;
    }
    for (var i = 0; i < checkers.length; i++) {
      if (checkers[i].x == x && checkers[i].y == y) {
        return i;
      }
    }
    return -1;
  }
  // Выполнение действия в зависимости от выбранной игроком клетки
  // при изменении состояния поля возвращает true
  this.selectCell = function(x, y) {
    var i, j;
    var killCheckerList = [];
    var checkerIndex = findChecker(x, y);
    // Проверка на нахождение выбранной клетки на поле 
    if (checkerIndex == -2) {
      return false;
    }
    // Если выбрана шашка другого игрока то ничего не делать
    if (checkerIndex + 1 && currentPlayer - checkers[checkerIndex].player) {
      return false;
    }
    // Если выбрана таже шашка - снять выделение и очистить возможные ходы
    if (selectChecker == checkerIndex) {
      selectChecker = -1;
      return true;
    }
    // Если выбрана шашка игрока, выделить ее
    if (checkerIndex + 1) {
      selectChecker = checkerIndex;
      return true;
    }
    // Совершить ход шашкой и передать ход
    if (selectChecker + 1) {
      for (i = 0; i < checkers[selectChecker].possibleMoves.length; i++) {
        if (x == checkers[selectChecker].possibleMoves[i].x && y == checkers[selectChecker].possibleMoves[i].y) {
          checkers[selectChecker].x = x;
          checkers[selectChecker].y = y;
          // Сделать шашку дамкой при достижении последней линии
          if (y == 7 * checkers[selectChecker].player + 1) {
            checkers[selectChecker].type = "king";
          }
          // Добавить в список индексы убитых шашек
          for (j = 0; j < checkers[selectChecker].possibleMoves[i].kill.length; j++) {
            killCheckerList.push(checkers[selectChecker].possibleMoves[i].kill[j]);
          }
          // Снять выделение шашки, сменить игрока и пересчитать возможные ходы
          selectChecker = -1;
          changePlayer();
          // Сортируем список убитыш шашек по убыванию индекса 
          killCheckerList.sort(function(a, b) {
            return b - a;
          });
          // Убераем убитые шашки
          for (j = 0; j < killCheckerList.length; j++) {
            removeChecker(killCheckerList[j]);
          }
          // Пересчитываем возможные ходы
          allPossibleMoves();
          return true;
        }
      }
      return false;
    }
  };
  // Отрисовка шашек
  this.draw = function() {
    var i, j;
    // Состояние игры
    var gameCondition = {
      status: "",
      elements: []
    };

    // Добавление всех шашек
    for (i = 0; i < checkers.length; i++) {
      gameCondition.elements.push({
        x: checkers[i].x,
        y: checkers[i].y,
        type: "player" + (checkers[i].player + 1) + checkers[i].type
      });
      if (checkers[i].player == currentPlayer && checkers[i].possibleMoves.length) {
        gameCondition.elements.push({
          x: checkers[i].x,
          y: checkers[i].y,
          type: "canMove"
        });
      }
    }
    // Добавление выделения выбранной шашки
    if (selectChecker > -1) {
      gameCondition.elements.push({
        x: checkers[selectChecker].x,
        y: checkers[selectChecker].y,
        type: "select"
      });
      // Добавление возможных ходов выделенной шашки
      for (i = 0; i < checkers[selectChecker].possibleMoves.length; i++) {
        gameCondition.elements.push({
          x: checkers[selectChecker].possibleMoves[i].x,
          y: checkers[selectChecker].possibleMoves[i].y,
          type: "move"
        });
        for (j = 0; j < checkers[selectChecker].possibleMoves[i].kill.length; j++) {
          gameCondition.elements.push({
            x: checkers[checkers[selectChecker].possibleMoves[i].kill[j]].x,
            y: checkers[checkers[selectChecker].possibleMoves[i].kill[j]].y,
            type: "kill"
          });
        }
      }
    }
    gameCondition.status = "player" + (currentPlayer + 1) + "move";
    var player1 = false;
    var player2 = false;
    var canMove = false;
    for (i = 0; i < checkers.length; i++) {
      if (checkers[i].player === 0) player1 = true;
      if (checkers[i].player === 1) player2 = true;
      if (checkers[i].possibleMoves.length) canMove = true;
    }
    if (!player1) gameCondition.status = "player2win";
    if (!player2) gameCondition.status = "player1win";
    if (!canMove) gameCondition.status = "draw";
    return gameCondition;
  };
  // Находится ли клетка с данными координатами на доске 8 на 8
  function cellInTable(x, y) {
    return inRect(x, y, 1, 1, 8, 8);
  }
  // Ход компьютера
  this.aiMove = function(player) {
    var moves = [];
    var checkerX, checkerY, x, y, rating;

    function Move(checkerX, checkerY, x, y, rating) {
      this.checkerX = checkerX;
      this.checkerY = checkerY;
      this.x = x;
      this.y = y;
      this.rating = rating;
    }

    for (var i = 0; i < checkers.length; i++) {
      if (checkers[i].player == player) {
        for (var j = 0; j < checkers[i].possibleMoves.length; j++) {
          checkerX = checkers[i].x;
          checkerY = checkers[i].y;
          x = checkers[i].possibleMoves[j].x;
          y = checkers[i].possibleMoves[j].y;
          rating = 0;
          rating += checkers[i].possibleMoves[j].kill.length * 100;
          // rating += (x == 1 || x == 8) ? 0 : 1;
          rating += (checkerX == 1 || checkerX == 8) ? 0 : -1;
          rating += ((y == 7 * player + 1) && checkers[i].type == "checker") ? 0 : 10;

          moves.push(new Move(checkerX, checkerY, x, y, rating));
        }
      }
    }
    moves.sort(function(a, b) {
      return b.rating - a.rating;
    });
    moves = moves.filter(function(move) {
      return move.rating == moves[0].rating;
    });
    i = randomInteger(0, moves.length - 1);
    return moves[i];
  };

}

// Объект Игры
function MyGame() {
  var canvas = document.createElement("canvas");
  var backGround = document.createElement("canvas");
  var checkers = new Checkers();
  var context, cellLeft, cellTop, cellWidth;
  cellLeft = 40;
  cellTop = 40;
  cellWidth = 40;
  canvas.width = 400;
  canvas.height = 440;
  var cellColor = "#70430a";
  var fildColor = "#ffde91";
  var gameStatus = {
    "player1move": "Ход первого игрока",
    "player2move": "Ход второго игрока",
    "player1win": "Победил первый игрок",
    "player2win": "Победил второй игрок",
    "draw": "Ничья"
  };
  var status = "";
  var elementType = {
    "player1checker": {
      color: "#d5ddf2",
      r: cellWidth / 2 - 5,
      type: "fill"
    },
    "player2checker": {
      color: "#5691ef",
      r: cellWidth / 2 - 5,
      type: "fill"
    },
    "player1king": {
      color: "#939aa5",
      r: cellWidth / 2 - 5,
      type: "fill"
    },
    "player2king": {
      color: "#063582",
      r: cellWidth / 2 - 5,
      type: "fill"
    },
    "select": {
      color: "#f9ed45",
      r: cellWidth / 2 - 3,
      type: "stroke"
    },
    "move": {
      color: "#1ce011",
      r: cellWidth / 2 - 3,
      type: "stroke"
    },
    "kill": {
      color: "#fc021b",
      r: cellWidth / 2 - 3,
      type: "stroke"
    },
    "canMove": {
      color: "#e88bef",
      r: cellWidth / 2 - 10,
      type: "stroke"
    },
  };
  var aiSpeed = 400;

  function start(parentElem) {
    backGround.width = canvas.width;
    backGround.height = canvas.height;
    context = backGround.getContext("2d");
    context.fillStyle = fildColor;
    context.fillRect(0, 0, backGround.width, backGround.height);
    context.fillStyle = cellColor;
    var i, x, y;
    for (i = 1; i < 65; i++) {
      x = (i % 8) + 1;
      y = div(i, 8) + 1;
      if ((x + y) % 2) {
        context.fillRect(cellWidth * x, cellWidth * y, cellWidth, cellWidth);
      }
    }
    context.strokeStyle = cellColor;
    context.strokeRect(cellWidth, cellWidth, cellWidth * 8, cellWidth * 8);
    context.font = "30px Arial";
    for (i = 1; i < 9; i++) {
      context.fillText(i, cellWidth - 30, cellWidth * (9 - i) + 30);
      context.fillText(i, cellWidth * 9 + 10, cellWidth * (9 - i) + 30);
      context.fillText(String.fromCharCode(64 + i), cellWidth * i + 10, 30);
      context.fillText(String.fromCharCode(64 + i), cellWidth * i + 10, 390);
    }
    context = canvas.getContext("2d");
    parentElem.appendChild(canvas);
  }
  // Очистка поля
  function clear() {
    context.fillStyle = fildColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  // Отрисовка поля
  function draw() {
    context.drawImage(backGround, 0, 0);
  }
  // Отображение статуса игры
  function drawGameStatus(status) {
    context.font = "30px Arial";
    context.fillStyle = cellColor;
    context.fillText(status, cellWidth, cellWidth * 10 + 25);
  }
  // Обновление поля
  function updateGame(x, y) {
    // clear();
    checkers.selectCell(x, y);
    draw();
    var gameCondition = checkers.draw();
    drawGameStatus(gameStatus[gameCondition.status]);
    for (var i = 0; i < gameCondition.elements.length; i++) {
      drawElement(gameCondition.elements[i]);
    }
    if (!(status === gameCondition.status)) {
      status = gameCondition.status;
      var move = {};
      if (gameCondition.status === "player2move") {
        move = checkers.aiMove(1);
        setTimeout(updateGame, aiSpeed, move.checkerX, move.checkerY);
        setTimeout(updateGame, aiSpeed * 2, move.x, move.y);
      }
      if (gameCondition.status === "player1move") {
        move = checkers.aiMove(0);
        setTimeout(updateGame, aiSpeed, move.checkerX, move.checkerY);
        setTimeout(updateGame, aiSpeed * 2, move.x, move.y);
      }
    }
  }
  // Отрисовка элемента
  function drawElement(element) {
    var color, r, x, y, type;
    x = calcMiddle(cellLeft, cellWidth, element.x);
    y = calcMiddle(cellTop, cellWidth, element.y);
    r = elementType[element.type].r;
    context.strokeStyle = elementType[element.type].color;
    context.fillStyle = elementType[element.type].color;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI);
    if (elementType[element.type].type == "fill") {
      context.fill();
    } else {
      context.stroke();
    }
  }
  // При нажатии мыши передает координаты клетки
  canvas.onmousedown = function(event) {
    var elemCoords = canvas.getBoundingClientRect();
    var x = event.clientX - elemCoords.left;
    var y = event.clientY - elemCoords.top;
    if (x < cellLeft || x > cellLeft + cellWidth * 8 || y < cellTop || y > cellTop + cellWidth * 8) {
      return;
    }
    x = div(x - cellLeft, cellWidth) + 1;
    y = div(y - cellTop, cellWidth) + 1;
    updateGame(x, y);
  };
  // Запуск игры внутри элемента
  this.startGame = function(parentElem) {
    start(parentElem);
    checkers.newGame();
    // Запуск ИИ для первого хода
    updateGame(1, 8);
  };
}