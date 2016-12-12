var fieldsGame = {

    vertical: 7,
    horizontal: 7,

    gameHead: document.getElementById('gameHead'),
    gameBody: document.getElementById('gameBody'),

    init: function () {
        this.gameHead.innerHTML = fieldsGame.generateHead();
        this.gameBody.innerHTML = fieldsGame.generateBody();
    },

    generateHead: function () {

        var head = '';

        for (row = 1; row <= this.vertical; ++row) {
            head += '<th data-row="' + row + '"></th>'
        }

        return head;
    },

    generateBody: function () {

        var body = '';

        for (row = 1; row <= this.vertical; ++row) {
            body += '<tr data-row="' + row + '">';
            for (column = 1; column <= this.horizontal; ++column) {
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
            ball.setAttribute('data-x', rowPosition);
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
        var t = this;

        rows.forEach(function (row) {
            var columns = row.childNodes;

            columns.forEach(function (column) {

                if (column.hasChildNodes() === false) {
                    return;
                }

                var x = column.childNodes[0].getAttribute('data-x');
                var y = column.childNodes[0].getAttribute('data-y');
                var currentColor = column.childNodes[0].getAttribute('id');

                t.checkTopVertical(x,y,currentColor);

            })
        });
    },

    checkTopVertical: function (x,y, color) {

        var success = 1;

        if ((y - 3) < 1) {
            return;
        }

        var test = this.gameBody.querySelector('[data-y="' + (y-3) + '"][data-x="'+ x +'"]');

        console.log(test);
        if (color === 1) {
            ++success;
        } // x, y -3


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
};





