/*
    Contains all custom functions created for the component
*/
// a function that sends post requests made specially for the component
function sendPost(command, body='', func=function(response) {}) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseText == 'false') {
                func(false);
            }
            else {
                func(xhr.responseText);
            }
        }
    }
    xhr.open("POST", document.location.href, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (body === '') {
        body = 'mwebrtc_action=' + encodeURIComponent(command);
    } else {
        body = 'mwebrtc_action=' + encodeURIComponent(command) + '&' + body;
    }
    xhr.send(body);
}

// request chunk by its name and put it in mwebrtc_section
function changeChunk(chunkName, func=function() {}) {
    sendPost('getChunk', 'chunk_name=' + encodeURIComponent(chunkName), function(response) {
        document.getElementById('mwebrtc_section').innerHTML = response;
        func();
    });
}

// send push notification
function sendNotification(jsonVal) {
    sendPost('sendNotification', 'json_string=' + JSON.stringify(jsonVal));
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const raw_data = window.atob(base64);
  const output_array = new Uint8Array(raw_data.length);

  for (let i = 0; i < raw_data.length; ++i) {
    output_array[i] = raw_data.charCodeAt(i);
  }
  return output_array;
}

// get active Service Worker or registrate one
function getSWRegistration() {
    return navigator.serviceWorker.getRegistration()
    .then(function(registration) {
        // if no Service Worker
        if (!registration) {
            return  navigator.serviceWorker.register(mwebrtcServiceWorker)
            .then(function(registration) {
                return registration;
            })
            .catch(function(err) {
                console.error('Unable to register service worker.', err);
            });
        }
        else {
            return registration;
        }
    });
}

function subscribeUserToPush(clientName=null, func=function() {}) {
    
    return getSWRegistration()
    .then(function(registration) {
        var service_worker;
        // Check Service Worker status
        if (registration.installing) {
            service_worker = registration.installing;
        } else if (registration.waiting) {
            service_worker = registration.waiting;
        } else if (registration.active) {
            service_worker = registration.active;
        }
        if (service_worker) {
            const subscribe_options = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(mwebrtcWebPushPublicKey)
            };
            // if service worker already activated
            if (service_worker.state == "activated") {
                // use pushManger for subscribing here.
                return registration.pushManager.subscribe(subscribe_options)
                .then(function(pushSubscription) {
                    func();
                    var body = 'endpoint=' + encodeURIComponent(JSON.stringify(pushSubscription));
                    if (clientName) {
                        body = body + '&client_name=' + encodeURIComponent(clientName);
                    }
                    sendPost('subscribe', body, function(response){
                        if (clientName !== null) {
                            client_id = response;
                        }
                    });
                });
            }
            // if service worker not activated wait for it
            serviceWorker.addEventListener("statechange", function(e) {
                if (e.target.state == "activated") {
                    // use pushManger for subscribing here.
                    return registration.pushManager.subscribe(subscribe_options)
                    .then(function(pushSubscription) {
                        func();
                        var body = 'endpoint=' + encodeURIComponent(JSON.stringify(pushSubscription));
                        if (clientName) {
                            body = body + '&client_name=' + encodeURIComponent(clientName);
                        }
                        sendPost('subscribe', body, function(response){
                            if (clientName !== null) {
                                client_id = response;
                            }
                        });
                    });
                }
            });
        }
        else {
            return 'no service worker';
        }
    });
}

function sendChatMessage() {
    if (document.getElementById('chat_receiver_combobox').selectedIndex > -1) {
        var message =document.getElementById('chat_textarea').value;
        var body = 'message=' + encodeURIComponent(message) +
            '&receiver=' + encodeURIComponent(document.getElementById('chat_receiver_combobox').options[document.getElementById('chat_receiver_combobox').selectedIndex].value);
        sendPost('chatSend', body, function(response) {
            if (response) {
                document.getElementById('chat_messages').innerHTML += '<tr><td>'+'You:</td><td>'+message+'</td></tr>';
                document.getElementById('chat_textarea').value = '';
            }
        });
    }
}

// get a list of clients in queue
function getQueue() {
    sendPost('getQueue', '', function(response) {
        var data,
            table = document.getElementById('mwebrtc_queue_table'),
            combobox = document.getElementById('chat_receiver_combobox'),
            selected_value = combobox.selectedIndex > -1 ? combobox.options[combobox.selectedIndex].value : -1;
        table.innerHTML = '';
        combobox.innerHTML = '';
        if(data = JSON.parse(response)) {
            for (var i in data) {
                var row = '<tr>';
                row += '<td name="queue_time">'+data[i].datetime+'</td>';
                row += '<td name="queue_name">'+data[i].name+'</td>';
                row += '<td><button button type="'+document.getElementById('subscribe').type+'" class="'+document.getElementById('subscribe').className+'" name="call_button" onclick={callUser("'+i+'")}>Call</button></td>';
                row += '<td><button button type="'+document.getElementById('subscribe').type+'" class="'+document.getElementById('subscribe').className+'" onclick={removeQueue("'+i+'")}>Remove</button></td>';
                row += '</tr>';
                table.innerHTML += row;
            	combobox.innerHTML += '<option value='+i+'>'+data[i].name+'('+i+')</option>';
            	if (i == selected_value) {
            	    combobox.selectedIndex = combobox.length - 1;
            	}
            }
        }
    });
}

// remove client from queue
function removeQueue(userId) {
    sendPost('unsubscribe', 'client_id=' + encodeURIComponent(userId));
    const remove_json = {
        tag: 'queue_remove',
        target: 'admins'
    };
    sendNotification(remove_json);
}

// create videocall room and invite client to it
function callUser(userId) {
    sendPost('createRoom', 'client_id=' + encodeURIComponent(userId), function(response){
        // if target client can't be invited
        if (response === false) {
            alert('этот пользователь недоступен');
        }
        else {
            roomid = response;
            changeChunk('call', function() {
                if (roomid && roomid.length) {
                    // end call
                    document.getElementById('hangup').addEventListener('click', function() {
                        hangup();
                    });
                    document.getElementById('mwebrtc_queue_table').hidden = true;
                    connection.videosContainer = document.getElementById('videos_container');
                    connection.open(roomid);
                    timer = setTimeout(repeatedlyCheck, 1000);
                        setTimeout(function() {
                        // send invitation
                        const invite_json = {
                            target: 'client',
                            tag: 'call',
                            client_id: userId,
                            roomid: roomid,
                            link: 'https://'+location.hostname+'/'
                        };
                        sendNotification(invite_json);
                        // request to update queue
                        const remove_json = {
                            tag: 'queue_remove',
                            target: 'admins'
                        };
                        sendNotification(remove_json);
                    }, 2000);
                }
            });
        }
    });
}

function startTimer(duration, display, func=function() {}) {
    var timer = duration, minutes, seconds;
    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            clearInterval(interval);
            func();
        }
    }, 1000);
}

function sendCallbackMessage() {
    if (document.getElementById('chat_receiver_combobox').selectedIndex > -1) {
        var body = 'client_id='+encodeURIComponent(client_id) +
            '&phone=' + encodeURIComponent(document.getElementById('message_phone').value) +
            '&message=' + encodeURIComponent(document.getElementById('message_text').value);
        sendPost('sendMessage', body, function(response) {
            if (response) {
                document.getElementById('mwebrtc_section').innerHTML = 'Ваше сообщение отправлено.';
            }
        });
    }
}

function endCall() {
    if (connection.isInitiator) {
        sendPost('closeRoom', 'room_id=' + encodeURIComponent(roomid));
        const remove_json = {
            tag: 'queue_remove',
            target: 'admins'
        };
        sendNotification(remove_json);
    }
    connection.close();
    clearInterval(timer);
}

function hangup() {
    connection.attachStreams.forEach(function(localstream) {
        localstream.stop();
    });
    document.getElementById('mwebrtc_section').innerHTML = '';
    if (document.getElementById('mwebrtc_queue_table')) {
        document.getElementById('mwebrtc_queue_table').removeAttribute('hidden');
    }
    endCall();
}

// listen to Service Worker's messages
function setupServiceWorker() {
    if('serviceWorker' in navigator){
        // Handler for messages coming from the service worker
        navigator.serviceWorker.addEventListener('message', function(event) {
            if (!event.data) {
                return;
            }
            // client part
            // stop interval and inform that an admin is online
            if (event.data === 'queue_accept' && interval !== null) {
                clearInterval(interval);
                document.cookie = 'mwebrtc_admin=online';
                document.getElementById('timer_text').textContent = 'Как минимум, один администратор сейчас онлайн. Ожидайте звонка.';
            }
            // stop interval and inform about call invitation
            else if (event.data.slice(0, 5) === 'call:' && interval !== null) {
                // if false then the countdown is stopped and interval is assigned to another timer
                if (document.getElementById('timer_text').textContent !== 'Как минимум, один администратор сейчас онлайн. Ожидайте звонка.') {
                    clearInterval(interval);
                }
                client_id = '';
                if (!document.getElementById('call')) {
                    cookieRoom(event.data.slice(5));
                }
            }
            //admin part
            // reload queue table
            else if (event.data === 'update' && document.getElementById('mwebrtc_queue_table') !== null) {
                getQueue();
            }
            // notify clients that an admin is online
            else if (event.data === 'queue_add') {
                sendPost('acceptQueue');
            }
        });
    }
}

// called after client joins the queue and on pageload if client is already in the queue
function cookieQueue() {
    var time = 60,
        display = document.getElementById('timer_text');
    // if an admin is online
    if (document.cookie.replace(/(?:(?:^|.*;\s*)mwebrtc_admin\s*\=\s*([^;]*).*$)|^.*$/, "$1") === 'online') {
            document.getElementById('timer_text').textContent = 'Как минимум, один администратор сейчас онлайн. Ожидайте звонка.';
    } else {
        // start checking admin status
        startTimer(time, display, function() {
            if (client_id && client_id !== '') {
                removeQueue(client_id);
                changeChunk('callback');
            }
        });
    }
    // show hidden sections
    document.getElementById('timer_section').removeAttribute('hidden');
    document.getElementById('chat_section').removeAttribute('hidden');
}

// called after an admin calls client and on pageload if client is already invited
function cookieRoom(room) {
    // create button that accepts the call
    var button = document.createElement('button');
    button.id = 'call';
    button.textContent = 'Принять звонок';
    // copy open_room button's classes and type
    button.className = document.getElementById('open_room').className;
    button.type = document.getElementById('open_room').type;
    // on click client accepts call and joins WebRTC room
    button.addEventListener('click', function() {
        roomid = room;
        sendPost('joinRoom', 'room_id=' + encodeURIComponent(roomid), function(response){
            if (response && roomid && roomid.length) {
                changeChunk('call', function() {
                    // end call
                    document.getElementById('hangup').addEventListener('click', function() {
                        hangup();
                    });
                    connection.videosContainer = document.getElementById('videos_container');
                    // give the admin some time to post his signal
                    timer = setTimeout(repeatedlyCheck, 3000);
                    setTimeout(function() {
                        connection.join(roomid);
                    }, 2000);
                });
            }
        });
    });
    document.getElementById('timer_text').textContent = 'Администратор готов вас принять.';
    document.getElementById('timer_section').appendChild(button);
}