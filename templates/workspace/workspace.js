M.AutoInit();

// Available colors of card
const colors = ['teal','pink','indigo','blue', 'cyan', 'lime', 'grey'];

// Initialise modal for creating new cards
document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems);
});

// Prototype to randomize color
Array.prototype.randomElement = function () {
return this[Math.floor(Math.random() * this.length)]
};

let workspaceName = {{ workspace_name_json }}; // current workspace name

// CREATE SOCKET CONNECTION
const Socket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/workspace/' + workspaceName + '/'); // Server routes connection using routing.py

// When socket recive message involved this function
Socket.onmessage = function(e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    let component = "    <div class=\"col s3\">\n" +
        "      <div class=\"card-panel " + colors.randomElement() +"\">\n" +
        "        <span class=\"white-text\">\n" +
                    message +
        "        </span>\n" +
        "      </div>\n" +
        "    </div>\n";
    document.querySelector('#task-history').innerHTML += (component);

};

// Send message if server close connection
Socket.onclose = function(e) {
    console.error('Web Socket closed unexpectedly');
};

// If in focused input user input enter - message will send
document.querySelector('#modal-task-input').onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#modal-task-submit').click();
    }
};

// Send message to server socket
document.querySelector('#modal-task-submit').onclick = function(e) {
    const messageInputDom = document.querySelector('#modal-task-input');
    const message = messageInputDom.value;
    const elem = document.querySelector('#modal1');
    const instance = M.Modal.getInstance(elem);
    console.log("get modal event");
    instance.close();
    Socket.send(JSON.stringify({
        'message': message
    }));

    messageInputDom.value = '';
};