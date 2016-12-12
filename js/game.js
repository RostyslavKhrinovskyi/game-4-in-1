var fieldsGame = {

    vertical: 7,
    horizontal: 7,
    lastNumberInSuccessCombination: 3,
    successCount: 4,
    win: false,
    gameHead: document.getElementById('gameHead'),
    gameBody: document.getElementById('gameBody'),

    init: function () {
        this.gameHead.innerHTML = fieldsGame.generateHead();
        this.gameBody.innerHTML = fieldsGame.generateBody();
    },

    generateHead: function () {

        var head = '';

        for (var row = 1; row <= this.vertical; ++row) {
            head += '<th data-row="' + row + '"></th>'
        }

        return head;
    },

    generateBody: function () {

        var body = '';

        for (var row = 1; row <= this.vertical; ++row) {
            body += '<tr data-row="' + row + '">';
            for (var column = 1; column <= this.horizontal; ++column) {
                body += '<td data-column="' + column + '"></td>';
            }
            body += '</tr>';
        }

        return body;
    },

    setField: function (ball, rowPosition) {

        var ballPosition = ball.getAttribute('data-position');
        var rows = this.gameBody.querySelectorAll('[data-row]');
        var lastRow = rows[rows.length - rowPosition];
        var currentColumn = lastRow.querySelector('[data-column="' + ballPosition + '"]');

        if (currentColumn.hasChildNodes() === false) {
            ball.setAttribute('data-x', ballPosition);
            ball.setAttribute('data-y', lastRow.getAttribute('data-row'));

            currentColumn.innerHTML = ball.outerHTML;
        } else {

            if (rowPosition !== this.vertical) {
                this.setField(ball, ++rowPosition)
            }
        }

    },

    checkWinCombinations: function () {

        var rows = this.gameBody.querySelectorAll('[data-row]');
        var self = this;

        rows.forEach(function (row) {
            var columns = row.childNodes;

            columns.forEach(function (column) {

                if (column.hasChildNodes() === false) {
                    return;
                }

                var x = column.childNodes[0].getAttribute('data-x');
                var y = column.childNodes[0].getAttribute('data-y');
                var currentColor = column.childNodes[0].getAttribute('id');

                self.checkVertical(x, y, currentColor);
                self.checkHorizontal(x, y, currentColor);
                self.checkDiagonalRight(x, y, currentColor);
                self.checkDiagonalLeft(x, y, currentColor);

            })
        });
    },

    checkVertical: function (x, y, color) {

        var success = 1;
        var lastNumber = this.lastNumberInSuccessCombination;

        if ((y - lastNumber) < 1) {
            return;
        }

        for (var i = lastNumber; i >= 1; --i) {
            var winnerColor = this.findAndCheckWinnerColor(x, (y - i));
            if (winnerColor !== null && color === winnerColor) {
                success++;
            }
        }

        if (success === this.successCount) {
            this.win = true;
        }

    },

    checkHorizontal: function (x, y, color) {

        var success = 1;
        var lastNumber = this.lastNumberInSuccessCombination;

        if ((x - lastNumber) < 1) {
            return;
        }

        for (var i = lastNumber; i >= 1; --i) {
            var winnerColor = this.findAndCheckWinnerColor((x - i), y);
            if (winnerColor !== null && color === winnerColor) {
                success++;
            }
        }

        if (success === this.successCount) {
            this.win = true;
        }
    },

    checkDiagonalRight: function (x, y, color) {

        var success = 1;
        var lastNumber = this.lastNumberInSuccessCombination;

        if ((y - lastNumber) < 1 && (x + lastNumber) < lastNumber) {
            return;
        }

        for (var i = lastNumber; i >= 1; --i) {
            var winnerColor = this.findAndCheckWinnerColor((Number(x) + i), (y - i));
            if (winnerColor !== null && color === winnerColor) {
                success++;
            }
        }

        if (success === this.successCount) {
            this.win = true;
        }
    },

    checkDiagonalLeft: function (x, y, color) {

        var success = 1;
        var lastNumber = this.lastNumberInSuccessCombination;


        if ((y + lastNumber) < lastNumber && (x + lastNumber) < lastNumber) {
            return;
        }

        for (var i = lastNumber; i >= 1; --i) {
            var winnerColor = this.findAndCheckWinnerColor((Number(x) + i), (Number(y) + i));
            if (winnerColor !== null && color === winnerColor) {
                success++;
            }
        }

        if (success === this.successCount) {
            this.win = true;
        }
    },

    findAndCheckWinnerColor: function (positionX, positionY) {

        var winnerColor = null;
        var winnerBall = this.gameBody.querySelector('[data-y="' + positionY + '"][data-x="' + positionX + '"]');

        if (winnerBall !== null) {
            winnerColor = winnerBall.getAttribute('id');
        }

        return winnerColor;
    }

};

var ball = {

    ball: document.createElement('div'),
    color: 'red',

    get: function () {
        this.ball.setAttribute('id', this.color);
        return this.ball;
    },

    set: function (color) {
        this.color = color;
    },

    switchBall: function (color) {

        if (color === 'red') {
            this.set('blue')
        }

        if (color === 'blue') {
            this.set('red')
        }
    }
};

fieldsGame.init();


fieldsGame.gameHead.onmouseover = function (event) {

    var target = event.target;
    var row = target.getAttribute('data-row');

    if (!row) return;

    var currentBall = ball.get();
    currentBall.dataset.position = row;
    currentBall.dataset.type = 'ball';

    target.appendChild(currentBall);
};


fieldsGame.gameHead.onclick = function (event) {

    var currentBall = event.target;
    var ballColor = currentBall.getAttribute('id');

    if (!ballColor) return;

    currentBall.remove();
    ball.switchBall(ballColor);

    fieldsGame.setField(currentBall, 1);
    fieldsGame.checkWinCombinations(currentBall);

    if (fieldsGame.win) {
        alert(ballColor + ' Winner!');
    }
};





