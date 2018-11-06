/*
    This file is made specially for 'tpl.mWebRTC.client' chunk
*/
// assigned with an interval that checks admins' online status
var interval = null,
    // assigned with an interval that requests chat messages
    chat_interval = null,
    // assigned with client's id when he is in the queue
    client_id = '';

// install Service Worker, subscribe the client to push notifications and join the queue
document.getElementById('open_room').addEventListener('click', function()  {
    // client's name can't be empty
    if (document.getElementById('user_name').value === '') {
        return;
    }
    // if the browser doesn't support notifications
    if(!window.Notification){
		console.log('Not supported');
	}else{
	    // request for the browser to allow show notifications
		Notification.requestPermission().then(function(p){
		    // if permission denied
			if(p=='denied'){
				console.log('You denied to show notification');
			}else if(p=='granted'){
			    // hide open_room and show close_room buttons
				document.getElementById('open_room').style.display = 'none';
				document.getElementById('close_room').style.display = '';
                subscribeUserToPush(document.getElementById('user_name').value, function() {
                    setupServiceWorker();
                });
                // when we join we assume that all admins are offline until one pops up
                document.cookie = 'mwebrtc_admin=offline';
                // check if an admin is online
                cookieQueue();
                // send a push notification to admins that the client joined the queue
                const json_val = {
                    tag: 'queue_add',
                    target: 'admins',
                    name: document.getElementById('user_name').value,
                    link: 'https://'+location.hostname+'/'
                };
                sendNotification(json_val);
			}
		});
	}
});

// unsubscribe from push notifications and leave the queue
document.getElementById('close_room').addEventListener('click', function()  {
    // if in the queue
    if (clientId && clientId !== '') {
        removeQueue(clientId);
        document.getElementById('chat_section').hidden = true;
        document.getElementById('timer_section').hidden = true;
    }
    // if the interval is going, stop it
    if (interval) {
        clearInterval(interval);
    }
    document.getElementById('open_room').style.display = '';
    document.getElementById('close_room').style.display = 'none';
});

// send chat message
document.getElementById('chat_send').addEventListener('click', function()  {
    sendChatMessage();
});

// check the client's status by his session
sendPost('checkSession', '', function(response) {
    var data = JSON.parse(response);
    // if the client is in the queue but not in the room
    if (data.state === 'queue') {
        setupServiceWorker();
        document.getElementById('open_room').style.display = 'none';
        document.getElementById('close_room').style.display = '';
        document.getElementById('user_name').value = data.client_name;
        client_id = data.client_id;
        cookieQueue();
    }
    // if the client is in the room
    else if (data.state === 'room') {
        setupServiceWorker();
        document.getElementById('timer_section').removeAttribute('hidden');
        document.getElementById('chat_section').removeAttribute('hidden');
        document.getElementById('open_room').style.display = 'none';
        document.getElementById('close_room').style.display = '';
        cookieRoom(data.room_id);
    }
    // request to receive all messages between the client and admins
    setTimeout(function() {
        var combobox = document.getElementById('chat_receiver_combobox');
        if (combobox && combobox.selectedIndex !== -1) {
            sendPost('chatGet', 'interlocutor_id=' + encodeURIComponent(combobox.options[combobox.selectedIndex].value), function(response) {
                var data;
                if (data = JSON.parse(response)) {
                    for (var i in data) {
                        // initially client sends messages to all admins, but the first time an admin sends a message, next messages will be sent to him
                        if (combobox.selectedIndex === 0 && data[i].sender_name === 'admin') {
                            // add the admin to chat_receiver_combobox
                            combobox.innerHTML += '<option value="'+data[i].sender_id+'">'+data[i].sender_name+'</option>';
                            // select the admin
                            combobox.selectedIndex = 1;
                        }
                        if (data[i].sender_name === 'You' || data[i].sender_id == combobox.options[combobox.selectedIndex].value) {
                            // add messages
                            document.getElementById('chat_messages').innerHTML += '<tr><td>'+''+data[i].sender_name+':</td><td>'+data[i].message+'</td></tr>';
                        }
                    }
                }
            });
        }
    }, 100);
    // set interval that constantly requests new messages and shows them
    chat_interval = setInterval(function() {
        var combobox = document.getElementById('chat_receiver_combobox');
        if (combobox && combobox.selectedIndex !== -1) {
            // request to receive messages to the client from selected admin or from ALL admins in last interval delay seconds
            var body='interlocutor_id=' + encodeURIComponent(combobox.options[combobox.selectedIndex].value) +
                '&seconds=' + encodeURIComponent(2);
            sendPost('chatGet', body, function(response) {
                var data;
                if (data = JSON.parse(response)) {
                    for (var i in data) {
                        // initially client sends messages to all admins, but the first time an admin sends a message, next messages will be sent to him
                        if (combobox.selectedIndex === 0 && data[i].sender_name === 'admin') {
                            // add the admin to chat_receiver_combobox
                            combobox.innerHTML += '<option value="'+data[i].sender_id+'">'+data[i].sender_name+'</option>';
                            // select the admin
                            combobox.selectedIndex = 1;
                        }
                        if (data[i].sender_name === 'You' || data[i].sender_id == combobox.options[combobox.selectedIndex].value) {
                            // add messages
                            document.getElementById('chat_messages').innerHTML += '<tr><td>'+''+data[i].sender_name+':</td><td>'+data[i].message+'</td></tr>';
                        }
                    }
                }
            });
        }
    }, 2000);
});