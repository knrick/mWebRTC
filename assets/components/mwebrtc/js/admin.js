/*
    This file is made specially for 'tpl.mWebRTC.admin' chunk
*/
// assigned with an interval that requests chat messages
var chat_interval = null;

// install Service Worker and subscribe the admin to push notifications
document.getElementById('subscribe').addEventListener('click', function()  {
    // if the browser doesn't support notifications
	if(!window.Notification){
		console.log('Not supported');
	}else{
	    // request for the browser to allow show notifications
		Notification.requestPermission().then(function(p){
		    // if permission denied
			if(p === 'denied'){
				console.log('You denied to show notification');
			}else if(p === 'granted'){
				subscribeUserToPush(null, function() {
                    setupServiceWorker();
                });
			}
		});
	}
});

// unsubscribe the admin from push on ALL browsers
document.getElementById('unsubscribe').addEventListener('click', function()  {
    sendPost('unsubscribe');
});

// send chat message
document.getElementById('chat_send').addEventListener('click', function()  {
    sendChatMessage();
});

// triggered when admin switches between clients in chat
// clear chat_messages table and load messages between new chosen client
document.getElementById('chat_receiver_combobox').addEventListener('change', function() {
    var combobox = document.getElementById('chat_receiver_combobox');
    // request to receive all messages between the admin and chosen client
    sendPost('chatGet', 'interlocutor_id=' + encodeURIComponent(combobox.options[combobox.selectedIndex].value), function(response) {
        // if new chosen client has a new messsage unnotify about it
        if (combobox.options[combobox.selectedIndex].textContent.slice(-4) === ' new') {
            // remove ' new' from the client's name
            combobox.options[combobox.selectedIndex].textContent = combobox.options[combobox.selectedIndex].textContent.slice(0, -4);
            document.getElementById('chat_notification').hidden = true;
            
        }
        var data;
        if (data = JSON.parse(response)) {
            // stop chat_interval
            if (chat_interval) clearInterval(chat_interval);
            // add messages
            for (var i in data) {
                document.getElementById('chat_messages').innerHTML += '<tr><td>'+''+data[i].sender_name+':</td><td>'+data[i].message+'</td></tr>';
            }
            // set interval that constantly requests new messages and shows them
            chat_interval = setInterval(function() {
                // if a client is selected
                if (combobox.selectedIndex !== -1) {
                    // request to receive messages from selected client to the admin or from any client to ALL admins in last interval delay seconds
                    var body='interlocutor_id=' + encodeURIComponent(combobox.options[combobox.selectedIndex].value) +
                        '&seconds=' + encodeURIComponent(2);
                    sendPost('chatGet', body, function(response) {
                        var data;
                        if (data = JSON.parse(response)) {
                            for (var i in data) {
                                // if the sender is selected client
                                if (i == combobox.options[combobox.selectedIndex].value) {
                                    // add the message
                                    document.getElementById('chat_messages').innerHTML += '<tr><td>'+''+data[i].sender_name+':</td><td>'+data[i].message+'</td></tr>';
                                } else {
                                    // if the message is from different client notify about it
                                    document.getElementById('chat_notification').removeAttribute('hidden');
                                    // tag the client
                                    combobox.options[combobox.selectedIndex].textContent += ' new';
                                }
                            }
                        }
                    });
                }
            }, 2000);
        }
    });
});

// load the queue
getQueue();
// request to receive all messages between the admin and chosen client
setTimeout(function() {
    var combobox = document.getElementById('chat_receiver_combobox');
    // if a client is selected
    if (combobox.selectedIndex !== -1) {
        sendPost('chatGet', 'interlocutor_id=' + encodeURIComponent(combobox.options[combobox.selectedIndex].value), function(response) {
            var data;
            if (data = JSON.parse(response)) {
                // add messages
                for (var i in data) {
                    document.getElementById('chat_messages').innerHTML += '<tr><td>'+''+data[i].sender_name+':</td><td>'+data[i].message+'</td></tr>';
                }
            }
        });
    }
}, 100);
// set interval that constantly requests new messages and shows them
chatInterval = setInterval(function() {
    var combobox = document.getElementById('chat_receiver_combobox');
    // if a client is selected
    if (combobox.selectedIndex !== -1) {
        // request to receive messages from selected client to the admin or from any client to ALL admins in last interval delay seconds
        var body='interlocutor_id=' + encodeURIComponent(combobox.options[combobox.selectedIndex].value) +
            '&seconds=' + encodeURIComponent(2);
        sendPost('chatGet', body, function(response) {
            var data;
            if (data = JSON.parse(response)) {
                for (var i in data) {
                    // if the sender is selected client
                    if (i == combobox.options[combobox.selectedIndex].value) {
                        // add the message
                        document.getElementById('chat_messages').innerHTML += '<tr><td>'+''+data[i].sender_name+':</td><td>'+data[i].message+'</td></tr>';
                    } else {
                        // if the message is from different client notify about it
                        document.getElementById('chat_notification').removeAttribute('hidden');
                        // tag the client
                        combobox.options[combobox.selectedIndex].textContent += ' new';
                    }
                }
            }
        });
    }
}, 2000);
setupServiceWorker();