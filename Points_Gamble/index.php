<!DOCTYPE html>
<html lang="en">
<head>
    <title>Point Incrementer</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <script>
        let points = 0;
        let pointsperclick = 1;
        let pointsgambled = 0;
        let gamblepoints = 0;
        let pointsperclickextra = 0;

        // Function to set a cookie
        function setCookie(name, value, days) {
            const d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }

        // Function to get a cookie by name
        function getCookie(name) {
            let nameEQ = name + "=";
            let ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        // Initialize points and pointsperclick from cookies (if they exist)
        function init() {
            let savedPoints = getCookie("points");
            let savedPointsPerClick = getCookie("pointsperclick");

            if (savedPoints) points = parseFloat(savedPoints);
            if (savedPointsPerClick) pointsperclick = parseFloat(savedPointsPerClick);

            document.getElementById("points").innerHTML = points.toFixed(2);
            document.getElementById("pointsperclick").innerHTML = pointsperclick.toFixed(2);
            document.getElementById("pointsperclickextra").innerHTML = pointsperclickextra.toFixed(2);
        }

        function addPoint() {
            points += pointsperclick;
            document.getElementById("points").innerHTML = points.toFixed(2);
            setCookie("points", points, 365); 
        }

        function gamble() {
            pointsgambled = points;
            gamblepoints = points / 1000;
            pointsperclickextra = Math.random() * gamblepoints;
            pointsperclick += pointsperclickextra;
            pointsperclickextraprocent = pointsperclickextra / gamblepoints * 100;
            points = 0;
            document.getElementById("points").innerHTML = points.toFixed(2);
            document.getElementById("pointsperclick").innerHTML = pointsperclick.toFixed(2);
            document.getElementById("pointsgambled").innerHTML = pointsgambled.toFixed(2);
            document.getElementById("pointsperclickextra").innerHTML = pointsperclickextra.toFixed(2);
            document.getElementById("pointsperclickaxtraprocent").innerHTML = pointsperclickextraprocent.toFixed(2);
            setCookie("points", points, 365);
            setCookie("pointsperclick", pointsperclick, 365);
        }

        window.onload = init;
    </script>
</head>
<body>
    <h1>Current Points: <span id="points">0.00</span></h1>
    <h2>Points per Click: <span id="pointsperclick">1.00</span></h2>
    <h4>Points gambled: <span id="pointsgambled">0.00</span></h4>
    <h4>Points per Click added: <span id="pointsperclickextra">0.00</span> / <span id="pointsperclickaxtraprocent">0</span>%</h4>
    <button id="addpoint" onclick="addPoint()">Click me</button><br><br>
    <button id="gamble" onclick="gamble()">Gamble</button>
</body>
</html>
