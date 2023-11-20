const GAME_MATRIX = document.querySelector(".game-matrix"),
    GAME_CONSOLE = document.querySelector(".game-window"),
    PLAYERS = document.querySelectorAll(".player-name"),
    PLAYER_DETAILS = document.querySelector(".player-details");

var playerList,
    totalPlayers = 2,
    playerTurn,
    playCount,
    pointList,
    boxList,
    primePoint,
    primePair,
    pointColumn,
    pointRow,
    boxOccupied = 0;


var startGame = () => {
    //Reset some values
    playCount = 0; playerTurn = 0;

    // get all info of players and matrix 
    let playerArray = [];
    let matrixDuo;

    // for(i = 1; i <= totalPlayers; i++) playArray.push(.value) 
    PLAYERS.forEach(e => e.value ? playerArray.push(e.value) : playerArray.push(e.name));

    playerList = createPLayerList(playerArray);

    matrixDuo = Number(document.querySelector("input[name='matrix']:checked").value);
    pointColumn = matrixDuo;
    pointRow = matrixDuo;

    // remove show from this and add show to game console
    START_MENU.classList.remove("show");
    GAME_CONSOLE.classList.add("show");

    // populate the player stat section
    PLAYER_DETAILS.innerHTML = "";
    playerList.forEach(e => PLAYER_DETAILS.innerHTML += `<div class="pl${e.id} center"><div class="pl${e.id}-avatar center">${e.id}</div><div class="pl${e.id}-name">${e.name}</div></div>`)
    
    //run createMatrix function
    createMatrix(matrixDuo, matrixDuo);
    
    //give all boxes placeholdsr of players avatar
    document.querySelectorAll(".box").forEach(e => e.innerHTML = `<p style= "color:#00ffff2f">${playerList[playerTurn].id}<\p>`)
}

//Create the matrix
var createMatrix = (row, column) => {
    pointList = createPointList(row, column);
    boxList = createBoxList(row - 1, column - 1);

    row === 7 ? GAME_MATRIX.style.transform = "scale(1)" : 
    row === 8 ? GAME_MATRIX.style.transform = "scale(.9)" :
    row === 9 ? GAME_MATRIX.style.transform = "scale(.8)" : '';
    GAME_MATRIX.innerHTML = "";
    GAME_MATRIX.style.width = `${(column - 1) * 50}px`;
    GAME_MATRIX.style.height = `${(row - 1) * 50}px`;
    GAME_MATRIX.style.gridTemplateColumns = `repeat(${column - 1}, 1fr)`;
    GAME_MATRIX.style.gridTemplateRows = `repeat(${row - 1}, 1fr)`;

    for (i = 1; i <= (row - 1) * (column - 1); i++)
        GAME_MATRIX.innerHTML += `<div class="box center" id = "box-${i}"></div>`;
    for (i = 1; i <= row * column; i++)
        GAME_MATRIX.innerHTML += `<div class="point center activated" id = "point-${i}" style="top: ${pointList[i - 1].top}px;left: ${pointList[i - 1].left}px;" onclick = "selectPair(this)"><span></span></div>`;
};

var createPointList = (row, column) => {
    let list = [];
    let rowIndex = 0;
    let columnIndex = 0;
    let interval = 50;
    for (i = 1; i <= row * column; i++) {
        rowPosition = -9 + interval * rowIndex;
        columnPosition = -9 + interval * columnIndex;

        //the point dictionnary
        let point = {};
        point["id"] = i;
        point["top"] = rowPosition;
        point["left"] = columnPosition;
        point["pair"] = [];
        point["boxes"] = [];

        // PairTop
        rowIndex != 0 ? point.pair.push(i - column) : "";
        // PairBottom
        rowIndex != row - 1 ? point.pair.push(i + column) : "";
        // PairLeft
        columnIndex != 0 ? point.pair.push(i - 1) : "";
        // PairRight
        columnIndex != column - 1 ? point.pair.push(i + 1) : "";

        // BoxTopLeft
        rowIndex != 0 && columnIndex != 0 ? point.boxes.push(i - (column + rowIndex)) : "";
        // BoxTopRight
        rowIndex != 0 && columnIndex != column - 1 ? point.boxes.push(i - (column + rowIndex) + 1) : "";
        // BoxBottomleft
        rowIndex != row - 1 && columnIndex != 0 ? point.boxes.push(i - (column + rowIndex) + (column - 1)) : "";
        // BoxBottomRight
        rowIndex != row - 1 && columnIndex != column - 1 ? point.boxes.push(i - (column + rowIndex) + 1 + (column - 1)) : "";

        columnIndex += 1;
        if (i % column == 0) {
            rowIndex += 1;
            columnIndex = 0;
        }

        list.push(point);
    }

    return list;
};

var createBoxList = (row, column) => {
    let list = [];
    for (i = 1; i <= row * column; i++) {
        box = {};
        box["id"] = i;
        box["count"] = 0;

        list.push(box);
    }
    return list;
};

var createPLayerList = (playersData) =>{
    let list = []
    let id = 1;
    playersData.forEach(e => {
        let player = {};
        player.id = id;
        player.name = e;
        player.avatar = null;
        player.score = 0;
        player.wins = 0;

        id++
        list.push(player);
    })

    return list
}

var selectPair = (target) => {
    // console.log(target.id.match(/\d/g)); SAMPLE REGEX EXPRESSION TO RETURN LIST OF ELEMENT ID NUMBER
    splitzID = target.id.split("-");
    resetPoint();

    primePoint = splitzID[1];
    primePair = pointList[parseInt(splitzID[1]) - 1].pair;

    target.classList.add("prime");

    primePair.forEach((e) => {
        let selectedPair = document.getElementById(`point-${e}`);
        selectedPair.classList.add("primepair");
        selectedPair.setAttribute("onclick", "playGame(this)");
    });
};

var playGame = (target) => {
    let splitzID = target.id.split("-");
    splitzID = Number(splitzID[1]);

    // Draw line from PrimePair to PlayerSelectedPair
    Math.abs(primePoint - splitzID) === pointColumn ? 
        primePoint > splitzID ? drawLine(splitzID) : drawLine(primePoint) : 
        primePoint > splitzID ? drawLine(splitzID, false) : drawLine(primePoint, false);

    // remove highlight from both selected points
    resetPoint();

    // Remove splitzID from primepoint pair list
    pointList[primePoint - 1].pair.splice(pointList[primePoint - 1].pair.indexOf(splitzID),1);
    pointList[primePoint - 1].pair.length === 0 ? deactivatePoint(primePoint) : "";

    // Remove primepoint from splitzID pair list
    pointList[splitzID - 1].pair.splice(pointList[splitzID - 1].pair.indexOf(Number(primePoint)), 1);
    pointList[splitzID - 1].pair.length === 0 ? deactivatePoint(splitzID) : "";

    // Add one to all affectedBox count number
    let intersection = pointList[primePoint - 1].boxes.filter((e) =>pointList[splitzID - 1].boxes.includes(e));
    intersection.forEach((e) => {
        boxList[Number(e) - 1].count += 1;
        if(boxList[Number(e) - 1].count === 4) {
            document.getElementById(`box-${e}`).classList.add("found");
            document.getElementById(`box-${e}`).innerHTML = `<p style= "color:cyan">${playerList[playerTurn].id} </p>`
            boxOccupied += 1
            playerList[playerTurn].score += 1;
            document.querySelector(`.score-container .score-${playerList[playerTurn].id}`).innerHTML = playerList[playerTurn].score;
        }
        if(boxOccupied === (pointRow - 1) * (pointColumn - 1)) {
            let winner;
            playerList[0].score > playerList[1].score ? winner = 0 : winner = 1;
            document.querySelector(".winner-popup").style.display = "flex";
            let content = `<div class="winner-container"><div class="trophy-container"></div><div class="win-msg"><span>${playerList[winner].name}</span> Wins</div></div>`;
            document.querySelector(".winner-popup").innerHTML = content;
        };
    });

    // Check if boxes are 4 and give it content to the active player and increase score.

    // switch user to play turn
    playCount += 1;
    playerTurn = playCount % totalPlayers;
    document.querySelectorAll(".box").forEach(e => !e.classList[2] ? e.innerHTML = `<p style= "color: #00ffff2f">${playerTurn + 1}</p>` : '');

    //
};

var drawLine = (point, isVertical = true) => {
    if (isVertical == true) {
        let vLine = `<div class="line" style="top: ${pointList[point - 1].top + 9}px;left: ${pointList[point - 1].left + 9 - 2}px;width: 4px; height: 50px;"></div>`;
        GAME_MATRIX.innerHTML += vLine;
    } else {
        let hLine = `<div class="line" style="top: ${pointList[point - 1].top + 9 - 2}px;left: ${pointList[point - 1].left + 9}px;width: 50px; height: 4px;"></div>`;
        GAME_MATRIX.innerHTML += hLine;
    }
};

var resetPoint = () => {
    primePoint? document.getElementById(`point-${primePoint}`).classList.remove("prime"): "";
    primePair? primePair.forEach((e) => {
            document.getElementById(`point-${e}`).classList.remove("primepair");
            document.getElementById(`point-${e}`).setAttribute("onclick", "selectPair(this)");
        })
        : "";
};

var deactivatePoint = (point) => {
    // add deactivate class and remove onclick attribute
    document.getElementById(`point-${point}`).classList.remove("activated");
    // document.getElementById(`point-${point}`).classList.add("deactivate");
    document.getElementById(`point-${point}`).removeAttribute("onclick");
};
