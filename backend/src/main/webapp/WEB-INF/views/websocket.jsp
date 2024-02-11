<%--
  ~ Developed by Arastoo Bozorgi.
  ~ a.bozorgi67@gmail.com
  --%>

<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Tester</title>
    <script src="resources/sockjs-0.3.4.js"></script>
    <script src="resources/stomp.js"></script>
    <script type="text/javascript">
	
        var stompClient = null; 

        function setConnected(connected) {
            document.getElementById('connect').disabled = connected;
            document.getElementById('disconnect').disabled = !connected;
            document.getElementById('calculationDiv').style.visibility = connected ? 'visible' : 'hidden';
            document.getElementById('calResponse').innerHTML = '';
        }

        function connect() {
            var token =  document.getElementById('tokenValue').value;
            var username =  document.getElementById('username').value;

            var topic = document.getElementById('topic').value;
            if(topic != '') {
                var socket = new SockJS('/UIWebsocket');
                stompClient = Stomp.over(socket);
                stompClient.connect({token:token}, function (frame) {
                    setConnected(true);
                    console.log('Connected: ' + frame);
                    stompClient.subscribe('/user/queue/' + topic, function (Result) {
                        showResult(Result.body);
                    });
                });
            }
        }

        function disconnect() {
            stompClient.disconnect();
            setConnected(false);
            console.log("Disconnected");
        }

        function sendNum() {
            var num1 = document.getElementById('num1').value;
            var num2 = document.getElementById('num2').value;
            stompClient.send("/rest/v2/provider", {}, JSON.stringify({ 'name': num1, 'description': num2 }));
        }

        function showResult(message) {
            var response = document.getElementById('calResponse');
            var p = document.createElement('p');
            p.style.wordWrap = 'break-word';
            p.appendChild(document.createTextNode(message));
            response.appendChild(p);
        }

        function login() {
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            if(username != '' && password != '') {
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", "http://localhost:8081/loginuser/" + username + "/" + password, false);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send();
                var response = JSON.parse(xhttp.responseText);
                console.log(response);

                if (response.success == true) {
                    var headers = xhttp.getAllResponseHeaders();
//                console.log(headers);

                    var eachLine = headers.split('\n');
                    for (var i = 0, l = eachLine.length; i < l; i++) {
                        console.log(eachLine[i]);
                        if (eachLine[i].search("token") != -1) {
                            var tokenStr = eachLine[i].substring(7);
//                        console.log(tokenStr);
                            document.getElementById('tokenValue').value = tokenStr;
                            return;
                        }
                    }
                }


            }
        }

    </script>
</head>
<body>
<noscript><h2>Enable Java script and reload this page to run Websocket Demo</h2></noscript>
<h1>Testing Spring 4 WebSocket</h1>
<div>
    <div>
        <label>Username:</label><input type="text" id="username" />
        <label>Password:</label><input type="text" id="password" />
        <input type="hidden" id="tokenValue">
        <button id="login" onclick="login();">Login</button>
    </div>
    <div>
        <label>Topic to subscribe:</label><input type="text" id="topic" />
        <button id="connect" onclick="connect();">Connect</button>
        <button id="disconnect" disabled="disabled" onclick="disconnect();">Disconnect</button><br/><br/>
    </div>
    <div id="calculationDiv">
        <label>Number One:</label><input type="text" id="num1" /><br/>
        <label>Number Two:</label><input type="text" id="num2" /><br/><br/>
        <button id="sendNum" onclick="sendNum();">Send</button>
        <p id="calResponse"></p>
    </div>
</div>
</body>
</html>