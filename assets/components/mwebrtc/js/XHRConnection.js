/*
    This file defines XHR as signaling for RTCMultiConnection.
*/
 // enable adapter.js
window.enableAdapter = true;



var roomid = '',
    // assigned with an interval that requests signaling messages
    timer;

var connection = new RTCMultiConnection(window.location.hostname);
    
    // you can falsify it to merge all ICE in SDP and share only SDP!
    // such mechanism is useful for SIP/XMPP and XMLHttpRequest signaling
    connection.trickleIce = false;
    connection.session = {
        audio: true, // mic
        video: true, // camera
        data: true,  // webrtc data channels
    };

// a function that sends post requests made specially for this file
function xhr(url, callback, data) {
    if (!window.XMLHttpRequest || !window.JSON) return;

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (callback && request.readyState == 4 && request.status == 200) {
            // server MUST return JSON text
            callback(JSON.parse(request.responseText));
        }
    };
    request.open('POST', document.location.href);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    body = 'mwebrtc_action=' + encodeURIComponent(url) + 
        '&room_id=' + encodeURIComponent(roomid) + 
        '&message=' + encodeURIComponent(data);
    

    request.send(body);
}

// this object is used to store "onmessage" callbacks from "openSignalingChannel handler
var onMessageCallbacks = {};

// this object is used to make sure identical messages are not used multiple times
var messagesReceived = {};

// if server says nothing; wait.
function repeatedlyCheck() {
    xhr('getSignal', function (data) {
        if (data == false) return timer = setTimeout(repeatedlyCheck, 2000);
        
        // if already receied same message; skip.
        if (messagesReceived[data.ID]) return timer = setTimeout(repeatedlyCheck, 2000);
        messagesReceived[data.ID] = data.Message;
        
        // "Message" property is JSON-ified in "openSignalingChannel handler
        data = JSON.parse(data.Message);
        
        // don't pass self messages over "onmessage" handlers
        if (data.sender != connection.userid && onMessageCallbacks[data.channel]) {
            onMessageCallbacks[data.channel](data.message);
        }
        
        // repeatedly check the database
        timer = setTimeout(repeatedlyCheck, 2000);
    });
}



// overriding "openSignalingChannel handler
connection.openSignalingChannel = function (config) {
    var channel = config.channel || this.channel;
    onMessageCallbacks[channel] = config.onmessage;

    // let RTCMultiConnection know that server connection is opened!
    if (config.onopen) setTimeout(config.onopen, 1);

    // returning an object to RTCMultiConnection
    // so it can send data using "send" method
    return {
        send: function (data) {
            data = {
                channel: channel,
                message: data,
                sender: connection.userid
            };

            // posting data to server
            // data is also JSON-ified.
            xhr('postSignal', null, JSON.stringify(data));
        },
        channel: channel
    };
};

// ask browser to apply these conditions; otherwise fail
connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

// add webcam video on connect
connection.onstream = function(event) {
    event.mediaElement.id = event.streamid;
    // don't add self video
    if (event.type !== 'local' && connection.videosContainer.innerHTML === '') {
        connection.videosContainer.appendChild(event.mediaElement);
    }
};

// remove webcam video on disconnect
connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement && mediaElement.parentNode) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
};

window.addEventListener("beforeunload", function (event) {
        if (roomid !== '') {
            endCall();
        }
    });
