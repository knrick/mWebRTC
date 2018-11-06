<!--style(can be removed) begin-->
<link rel="stylesheet" type="text/css" href="[[++assets_url]]components/mwebrtc/css/mwebrtc.css">

<div class="rtsBtn">
    <div class="boxmWebRTC">
        <a class="btn btn-white  btn-animation-1" href="#" data-toggle="modal" data-target="#[[+animModal]]" role="button"><img class="mx-auto imf-fluid" src="[[+icon]]" alt="VideoCall"></a>
    </div>
    <div class="modal fade mmWebRTC" id="[[+animModal]]" tabindex="-1" data-easein="[[+animModal]]" role="dialog" aria-labelledby="myModal32Label" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="[[+animModal]]Label">mWebRTC</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!--style end-->
                    <!--main(changing might be crucial) begin-->
                    <div>
                        <button button type="button" class="btn btn-danger" id="subscribe">Subscribe</button> <!-- by default this button subscribes admin to push notifications to current browser on client joining the queue -->
                        <button button type="button" class="btn btn-danger" id="unsubscribe">Unsubscribe</button> <!-- by default this button unsubcribes admin from pushing notifications from ALL browsers -->
                    </div>
                    <div id="mwebrtc_section"></div> <!-- by default new admin chunks (like tpl.mWebRTC.admin.call chunk) will be put in this tag-->
                    <div id="chat_section"> <!-- by default everything chat related is in this tag. -->
                        <table class="rtcTable">
                            <tbody id="chat_messages">  <!-- by default this table contains chat messages -->
                            <!-- by default a row looks like this:
                            <tr>
                                <td>sender's name (or 'You' if it's your message):</td>
                                <td>message</td>
                            </tr>
                            -->
                            </tbody>
                        </table>
                        <div>
                            <span id="chat_notification" hidden>Новое сообщение!</span> <!-- by default this span is shown when a new message from another client is received -->
                            <select id="chat_receiver_combobox"></select> <!-- by default this combox is used to choose client for chat -->
                            <textarea placeholder="Please write..." id="chat_textarea"></textarea> <!-- by default user writes messages here -->
                            <button button type="button" class="btn btn-danger" id="chat_send">send</button> <!-- by default this button sends message to client chosen in chat_receiver_combobox -->
                        </div>
                    </div>
                    <table class="rtcTable">
                        <tbody id="mwebrtc_queue_table"> <!-- by default this table shows clients in queue -->
                            <!-- by default a row looks like this:
                            <tr>
                                <td name="queue_time">datetime when client joined the queue</td>
                                <td name="queue_name">client's name</td>
                                <td><button button type="subscribe button's type" class="subscribe button's class" name="call_button" onclick=callUser("client's id")>Call</button></td>
                                <td><button button type="subscribe button's type" class="subscribe button's class" onclick=removeQueue("client's id")>Remove</button></td>
                            </tr>
                            It can be changed in mwebrtc-functions.js:function getQueue()-->
                        </tbody>
                    </table>
                    <!--main end-->
                    <!--style begin-->
                </div>
            </div>
        </div>
    </div>
</div>
<!--style end-->

<script>
    //get needed system settings
    var mwebrtcWebPushPublicKey = '[[++mwebrtc_webpush_vapid_public_key]]', // needed to subscribe to push notifications
        mwebrtcServiceWorker = '[[++mwebrtc_service_worker]]'; // need to locate Service Worker
</script>
<script src="[[++assets_url]]components/mwebrtc/js/adapter.js"></script> <!-- RTCMultiConnection requires it -->
<script src="[[++assets_url]]components/mwebrtc/js/FileBufferReader.js"></script> <!-- RTCMultiConnection requires it -->
<script src="[[++assets_url]]components/mwebrtc/js/RTCMultiConnection.min.js"></script> <!-- A mWebRTC wrapper for videocalls -->
<script src="[[++assets_url]]components/mwebrtc/js/mwebrtc-functions.js"></script> <!-- Contains all custom functions that are put in here -->
<script src="[[++assets_url]]components/mwebrtc/js/admin.js"></script> <!-- A js file made specially for this chunk -->
<script src="[[++assets_url]]components/mwebrtc/js/XHRConnection.js"></script> <!-- This file defines signaling for RTCMultiConnection. Removing it if you will be using another signaling method  -->
<script src="[[++assets_url]]components/mwebrtc/js/animations.js"></script> <!-- All style related is here -->