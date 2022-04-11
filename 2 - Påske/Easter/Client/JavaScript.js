﻿//vars---------------------------------------------------------------------
var connection;

var moveRight;
var moveLeft;

var myTimerVar;

//timer---------------------------------------------------------------------
function myTimer()
{
    if (moveRight)
    {
        connection.invoke('move', 'right');
    }
    else if (moveLeft)
    {
        connection.invoke('move', 'left');
    }
}

//get element---------------------------------------------------------------------
function element(id)
{
    return document.getElementById(id);
}

//functions---------------------------------------------------------------------
function wireEvents()
{
    // button event
    element('close').addEventListener('click', function ()
    {
        clearInterval(myTimerVar);
        connection.close();
    });

    // button event
    element('open').addEventListener('click', function ()
    {
        if (typeof connection == 'undefined')
        {
            var log = element('log');
            myTimerVar = setInterval(function () { myTimer() }, 10);

            moveRight = false;
            moveLeft = false;

            var connection = new signalR.HubConnectionBuilder()
                .withUrl('/game')
                .build();
            
            connection.onerror = function (e)
            {
                log.innerHTML += 'Problem with connection: ' + e.message + '<br/>';
            };

            connection.onopen = function ()
            {
                log.innerHTML += 'Client connected! <br/>';
            };
            
            connection.on('move', function (e) {
                var dto = JSON.parse(e.data.toString()); // JSON (JavaScript Object Notation)

                var c = element("myCanvas");
                var ctx = c.getContext("2d");

                ctx.clearRect(0, 0, c.width, c.height);

                // player 1
                ctx.beginPath();
                ctx.moveTo(dto.xStartPlayer1, dto.yStartPlayer1);
                ctx.lineTo(dto.xEndPlayer1, dto.yEndPlayer1);
                ctx.lineWidth = 10;
                ctx.lineCap = "round";
                ctx.strokeStyle = "red";
                ctx.stroke();

                // player 2
                ctx.beginPath();
                ctx.moveTo(dto.xStartPlayer2, dto.yStartPlayer2);
                ctx.lineTo(dto.xEndPlayer2, dto.yEndPlayer2);
                ctx.lineWidth = 10;
                ctx.lineCap = "round";
                ctx.strokeStyle = "blue";
                ctx.stroke();

                // ball
                ctx.beginPath();
                // x- and y-coordinates of the center of the circle.
                // the radius of the circle.
                // the arc’s starting and ending angles in radians.
                ctx.arc(dto.ballX, dto.ballY, 5, 0, Math.PI * 2)
                ctx.fillStyle = "green";
                ctx.fill();

                var p1Score = element("player1");
                p1Score.innerHTML = dto.player1Score;

                var p2Score = element("player2");
                p2Score.innerHTML = dto.player2Score;
            })
            
            connection.start();

            connection.onclose = function ()
            {
                log.innerHTML += 'Closed connection! <br/>';
            };
        }
    });

    // button down event
    document.onkeydown = function ()
    {
        switch (window.keyCode)
        {
            case 37:
                moveLeft = true;
                break;
            case 39:
                moveRight = true;
                break;
        }
    };

    // button up event
    document.onkeyup = function ()
    {
        switch (window.keyCode)
        {
            case 37:
                moveLeft = false;
                break;
            case 39:
                moveRight = false;
                break;
        }
    };
}

//start---------------------------------------------------------------------
window.onload = function ()
{
    wireEvents();
};