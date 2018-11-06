// sends Service Worker message to specific browser tab (client)
function sendMessageToClient(client, msg){
    return new Promise(function(resolve, reject){
        var msg_chan = new MessageChannel();

        msg_chan.port1.onmessage = function(event){
            if(event.data.error){
                reject(event.data.error);
            }else{
                resolve(event.data);
            }
        };

        client.postMessage(msg, [msg_chan.port2]);
    });
}

// sends Service Worker message to ALL browser tabs bound to this Service Worker (clients)
function sendMessageToAllClients(msg){
    clients.matchAll().then(clients => {
        clients.forEach(client => {
            sendMessageToClient(client, msg);
        })
    })
}

// push handler, mostly it just sends messages to clients and shows notifications
self.addEventListener('push', function(event) {
    var title, options;
    if (event.data) {
        const payload = JSON.parse(event.data.text());
        if (payload.target === 'admins') {
            if (payload.tag) {
                if (payload.tag === 'queue_add' || payload.tag === 'queue_remove') {
                    sendMessageToAllClients('update');
                }
                if (payload.tag === 'queue_add') {
                    title = 'Звонок от '+payload.name;
                    options = {
                        body: 'Нажмите на уведомление, чтобы ответить.',
                        // this JSON will be sent to notificationclick and notificationclose event handlers
                        data: {
                            tag: payload.tag,
                            link: payload.link
                        }
                    };
                    event.waitUntil(self.registration.showNotification(title, options));
                }
            }
        } else if (payload.target === 'client') {
            if (payload.tag === 'call') {
                title = 'Администратор готов вас принять.';
                options = {
                    body: 'Нажмите на уведомление, чтобы ответить.',
                    // this JSON will be sent to notificationclick and notificationclose event handlers
                    data: {
                        tag: payload.tag
                    }
                };
                sendMessageToAllClients('call:'+payload.roomid);
                event.waitUntil(
                    Promise.resolve()
                    .then(function() {
                        return self.registration.showNotification(title, options);
                    })
                );
            } else if (payload.tag === 'queue_accept') {
                sendMessageToAllClients('queue_accept');
            }
        }
    }
});

// triggers when user clicks on notification
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    // when admin clicks on the notification inform clients that an admin is online
    if (event.notification.data.tag === 'queue_add') {
        sendMessageToAllClients('queue_add');
        fetch(event.notification.data.link, {
            method: 'post',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'mwebrtc_action='+encodeURIComponent('acceptQueue')
        });
    }
    // when user clicks on the notification open link
    if ((event.notification.data.tag === 'queue_add' || event.notification.data.tag === 'call') && event.notification.data.link !== null) {
        event.waitUntil(
            clients.openWindow(event.notification.data.link)
        );
    }
});

self.addEventListener('notificationclose', function(event) {
    // when admin closes the notification inform clients that an admin is online
    if (event.notification.data.tag === 'queue_add') {
        sendMessageToAllClients('queue_add');
        fetch(event.notification.data.link, {
            method: 'post',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'mwebrtc_action='+encodeURIComponent('acceptQueue')
        });
    }
});