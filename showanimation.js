function showNumberWithAnimation(x, y ,num) {
    var numberCell = $('#number-cell-'+x+'-'+y);
    numberCell.css('background-color', getNumberBackgroundColor(num));
    numberCell.css('color', getNumberColor(num));
    numberCell.text(num);
    numberCell.animate({
        width: '1.6rem',
        height: '1.6rem',
        top: getPosTop(x, y)+'rem',
        left: getPosLeft(x, y)+'rem'
    }, 200);
}

function showMoveAnimation(x1, y1, x2, y2) {
    var numberCell1 = $('#number-cell-'+x1+'-'+y1);
    numberCell1.animate({
        top: getPosTop(x2, y2)+'rem',
        left: getPosLeft(x2, y2)+'rem'
    }, 200);
}

function updateScore(score) {
    $('#score-text').text(score);
}