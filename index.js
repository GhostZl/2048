var board = new Array();
var score = 0;
var hasCollide = new Array();
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;
var boardWidth = '';
$(document).ready(function() {
    newgame();
    boardWidth = $('#grid-container').width();
        document.getElementById('grid-container').addEventListener('touchstart', function(event){
        startx = event.touches[0].pageX;
        starty = event.touches[0].pageY;
    });
    document.getElementById('grid-container').addEventListener('touchend', function(event){
        endx = event.changedTouches[0].pageX;
        endy = event.changedTouches[0].pageY;
        var deltax = endx-startx;
        var deltay = starty-endy;
        if (Math.abs(deltax)<0.3*boardWidth && Math.abs(deltay)<0.3*boardWidth) {
            return false;
        }
        if (Math.abs(deltax)> Math.abs(deltay)) {
            if (deltax>0) {
                if (moveRight()) {
                    setTimeout('generateOneNumber()', 210);
                    setTimeout('isgameover()',500);
                }
            } else {
                if (moveLeft()) {
                    setTimeout('generateOneNumber()', 210);
                    setTimeout('isgameover()',500);
                }
            }
        } else {
            if (deltay>0) {
                if (moveUp()) {
                    setTimeout('generateOneNumber()', 210);
                    setTimeout('isgameover()',500);
                }
            } else {
                if (moveDown()) {
                    setTimeout('generateOneNumber()', 210);
                    setTimeout('isgameover()',500);
                }
            }
        }
    });
});
function newgame() {
    //初始化棋盘
    init();
}
function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var girdCell = $("#grid-cell-"+i+"-"+j);
            girdCell.css('top', getPosTop(i,j)+'rem');
            girdCell.css('left', getPosLeft(i,j)+'rem');
        }
    }
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasCollide[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasCollide[i][j] = false;
        }
    }
    generateOneNumber();
    generateOneNumber();
    updateBoardView();
    score = 0;
}
function updateBoardView() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);
            if (board[i][j]==0) {
                theNumberCell.css('width', '0');
                theNumberCell.css('height', '0');
                theNumberCell.css('top', getPosTop(i,j)+0.8+'rem');
                theNumberCell.css('left', getPosLeft(i,j)+0.8+'rem');
            } else {
                theNumberCell.css('width', '1.6rem');
                theNumberCell.css('height', '1.6rem');
                theNumberCell.css('top', getPosTop(i,j)+'rem');
                theNumberCell.css('left', getPosLeft(i,j)+'rem');
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasCollide[i][j] = false;
        }
    }
}

function generateOneNumber() {
    if (nospace(board)) {
        return false;
    }
    var haveSpace = new Array();
    //随机一个位置
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j]==0) {
                haveSpace.push(new Array(i,j));
            }
        }
    }
    //随机数字
    var pos = parseInt(Math.floor(Math.random() * haveSpace.length));
    var point = haveSpace[pos];
    var num = Math.random() < 0.5 ? 2 : 4;
    board[point[0]][point[1]] = num;
    showNumberWithAnimation(point[0],point[1],num);
    return true;
}
 

$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37:
            if (moveLeft()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()',500);
            }
            break
        case 38:
            if (moveUp()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()',500);
            }
            break
        case 39:
            if (moveRight()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()',500);
            }
            break
        case 40:
            if (moveDown()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()',500);
            }
            break
        default:
            break;
    }
})
function isgameover(argument) {
    if (nospace(board) && nomove(board)) {
        alert('游戏结束！');
    }
}
function moveLeft() {
    if (!canMoveLeft()) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j]!=0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k]==0 && noBlockHorizontal(i, k, j, board) && !hasCollide[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k]==board[i][j] && noBlockHorizontal(i, k, j, board) && !hasCollide[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasCollide[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);
    return true;
}

function moveRight() {
    if (!canMoveRight()) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j]!=0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k]==0 && noBlockHorizontal(i, j, k, board) && !hasCollide[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k]==board[i][j] && noBlockHorizontal(i, j, k, board) && !hasCollide[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasCollide[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);
    return true;
}

function moveUp() {
    if (!canMoveUp()) {
        return false;
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j]!=0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j]==0 && noBlockVertical(j, k, i, board) && !hasCollide[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j]==board[i][j] && noBlockVertical(j, k, i, board) && !hasCollide[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasCollide[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);
    return true;
}
function moveDown() {
    if (!canMoveDown()) {
        return false;
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j]!=0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j]==0 && noBlockVertical(j, i, k, board) && !hasCollide[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j]==board[i][j] && noBlockVertical(j, i, k, board) && !hasCollide[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasCollide[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);
    return true;
}







