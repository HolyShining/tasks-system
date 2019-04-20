    M.AutoInit();

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
    });

    let roomName = {{ room_name_json }};

    const chatSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/workspace/' + roomName + '/');

    chatSocket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var message = data['message'];
        let component = "  <div class=\"row\">\n" +
            "    <div class=\"col s6 m3\">\n" +
            "      <div class=\"card blue-grey darken-1\">\n" +
            "        <div class=\"card-content white-text\">\n" +
            "          <span class=\"card-title\">New message</span>\n" +
            "          <p>" + message +"</p>\n" +
            "        </div>\n" +
            "        <div class=\"card-action\">\n" +
            "          <a href=\"#\">Completed</a>\n" +
            "          <a href=\"#\">Delete</a>\n" +
            "        </div>\n" +
            "      </div>\n" +
            "    </div>\n" +
            "  </div>";
        {#document.querySelector('#workspace-log').value += (message + '\n');#}
        document.querySelector('#workspace-history').innerHTML += (component);

    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#workspace-message-input').focus();
    document.querySelector('#workspace-message-input').onkeyup = function(e) {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('#workspace-message-submit').click();
        }
    };

    document.querySelector('#workspace-message-submit').onclick = function(e) {
        var messageInputDom = document.querySelector('#workspace-message-input');
        var message = messageInputDom.value;
        var elem = document.querySelector('#modal1');
        var instance = M.Modal.getInstance(elem);
        console.log("get event");
        instance.close();
        chatSocket.send(JSON.stringify({
            'message': message
        }));

        messageInputDom.value = '';
    };
    document.querySelector('#modal-message-submit').onclick = function(e) {
        var messageInputDom = document.querySelector('#modal-message-input');
        var message = messageInputDom.value;
        var elem = document.querySelector('#modal1');
        var instance = M.Modal.getInstance(elem);
        console.log("get modal event");
        instance.close();
        chatSocket.send(JSON.stringify({
            'message': message
        }));

        messageInputDom.value = '';
    };