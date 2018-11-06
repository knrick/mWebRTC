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
                    <div id="mwebrtc_section"> <!-- by default new client chunks (like tpl.mWebRTC.client.call chunk) will be put in this tag-->
                        <div id="front_section">
                            <input type="text" autocorrect="off" autocapitalize="off" size="20" value="" placeholder="Ваше имя" id="user_name"></input> <!-- by default the client types his name here -->
                            <button type="button" class="btn btn-danger" id="open_room">Позвонить</button> <!-- by default this button subscribes the client to push notifications to current browser on admin's call and puts him in the queue -->
                            <button type="button" class="btn btn-danger" id="close_room" style="display: none;">Покинуть очередь</button> <!-- by default this button removes the client from the queue -->
                        </div>
                        <div id="timer_section" hidden> <!-- by default this section is showed if the client is in the queue -->
                            <div><span id="timer_text">01:00</span></div> <!-- by default the timer starts when the client joins the queue. It stops if an admin reacts to notification or if it drops to zero. If it drops to zero the client leaves the queue callback chunk will be shown. -->
                        </div>
                    </div>
                    <div id="chat_section" hidden> <!-- by default everything chat related is in this tag. -->
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
                            <select id="chat_receiver_combobox" hidden> <!-- by default this combox is used to choose client for chat -->
                                <option>All</option><!-- by default the client writes to all admins until one sends him a message -->
                            </select>
                            <textarea placeholder="Please write..." id="chat_textarea"></textarea> <!-- by default user writes messages here -->
                            <button type="button" class="btn btn-danger" id="chat_send">send</button> <!-- by default this button sends message to admin chosen in chat_receiver_combobox -->
                        </div>
                    </div>
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
<script src="[[++assets_url]]components/mwebrtc/js/client.js"></script> <!-- A js file made specially for this chunk -->
<script src="[[++assets_url]]components/mwebrtc/js/XHRConnection.js"></script> <!-- This file defines signaling for RTCMultiConnection. Removing it if you will be using another signaling method  -->
<script src="[[++assets_url]]components/mwebrtc/js/animations.js"></script> <!-- All style related is here -->