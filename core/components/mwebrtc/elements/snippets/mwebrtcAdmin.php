<?php
// checks if user is a member of admin group or if request was from Service Worker
if (!$modx->user->isMember($scriptProperties['group']) && $_POST['mwebrtc_action'] == 'acceptQueue') return;

// These two lines return admin chunk without any property
//$res = $modx->getChunk('tpl.mWebRTC.admin');
//if (empty($_POST['mwebrtc_action'])) return $res;

// this if statement returns admin chunk with properties
if (empty($_POST['mwebrtc_action'])){
    
    $output = array();
     
    $animModalArr = array(
        'slideRightBigIn',
        'slideLeftBigIn',
        'slideDownBigIn',
        'slideUpBigIn',
        'slideRightIn',
        'slideLeftIn',
        'slideDownIn',
        'slideUpIn',
        'bounceRightIn',
        'bounceLeftIn',
        'bounceDownIn',
        'bounceUpIn',
        'bounceIn',
        'expandIn',
        'shrinkIn',
        'whirlIn',
        'swoopIn',
        'flipBounceYIn',
        'flipBounceXIn',
        'flipYIn',
        'flipXIn',
        'fadeIn',
        'flash',
        'bounce',
        'swing',
        'tada',
        'shake',
        'perspectiveRightIn',
        'perspectiveLeftIn',
        'perspectiveDownIn',
        'perspectiveUpIn'
        );
    foreach ($animModalArr as $row) {
        $row == !empty($animModal) ? : $animModal = 'noAnim';  
        $output = $modx->getChunk('tpl.mWebRTC.admin', array( 
             'animModal' => $animModal,
             'icon' => $icon
             ));
             
    }
    return  $output;
}
// allows to work with database tables
$modx->addPackage('mwebrtc', MODX_CORE_PATH.'components/mwebrtc/model/');

// adds WebPush library
require_once MODX_CORE_PATH.'components/mwebrtc/web_push/vendor/autoload.php';
use Minishlink\WebPush\WebPush;
// set VAPID for WebPush
$auth = array(
    'VAPID' => array(
        'subject' => $modx->getOption('mwebrtc_webpush_vapid_subject_email'), // can be a mailto: or your website address
        'publicKey' => $modx->getOption('mwebrtc_webpush_vapid_public_key'), // (recommended) uncompressed public key P-256 encoded in Base64-URL
        'privateKey' => $modx->getOption('mwebrtc_webpush_vapid_private_key'), // (recommended) in fact the secret multiplier of the private key encoded in Base64-URL
    ),
);
// push $jsonStringDecoded tp $subscription
function sendNotification($subscription, $jsonStringDecoded, $auth) {
    //decode subscription
    $subscription_decoded = json_decode($subscription->get('endpoint'));
    $notification = array(
        'endpoint' => $subscription_decoded->{'endpoint'},
        'payload' => json_encode($jsonStringDecoded),
        'user_public_key' => $subscription_decoded->{'keys'}->{'p256dh'},
        'user_auth_token' => $subscription_decoded->{'keys'}->{'auth'}
    );
    // send one notification and flush directly
    $web_push = new WebPush($auth);
    var_dump($web_push->sendNotification(
        $notification['endpoint'],
        $notification['payload'], // optional (defaults null)
        $notification['user_public_key'], // optional (defaults null)
        $notification['user_auth_token'], // optional (defaults null)
        true // optional (defaults false)
    ));
    
}


switch ($_POST['mwebrtc_action']) {
    // sends push to notify clients in the queue that the admin is online
    case 'acceptQueue':
        // get all clients in the queue
	    $subscriptions = $modx->getCollection('WebrtcQueue', $modx->newQuery('WebrtcQueue')->where(array('end_datetime:IS' => null)));
        foreach($subscriptions as $subscription) {
            $json_string_decoded = array(
                'target' => 'client',
                'client_id' => $subscription->get('id'),
                'tag' => 'queue_accept');
            sendNotification($subscription, $json_string_decoded, $auth);
        }
        $res = true;
		break;
	// sends chat message
	case 'chatSend':
        $response = json_encode(false);
        if (!empty($_POST['message']) && !empty($_POST['receiver'])) {
            $message = $modx->newObject('WebrtcChat');
            $message->set('sender_id', $modx->getUser()->get('id'));
            if (is_numeric($_POST['receiver'])) {
                $message->set('receiver_id', $_POST['receiver']);
            }
            $message->set('message', $_POST['message']);
            $message->set('from_admin', 1);
            if ($message->save()) {
                $response = true;
            }
            
        }
        $res = $response;
        break;
    // gets chat message
    case 'chatGet':
        $response = false;
        if (!empty($_POST['interlocutor_id'])) {
            $response = array();
            $user = $modx->getUser();
            $query = $modx->newQuery('WebrtcChat');
            if (is_numeric($_POST['seconds'])) {
                //echo 'numeric';
                $query->where(array('receiver_id' => $user->get('id'), 'OR:receiver_id:IS' => null));
                $query->andCondition(array('sender_id' => $_POST['interlocutor_id'], 'from_admin' => 0, 'datetime:>' => date('Y-m-d H:i:s', time() - $_POST['seconds'])));
            } else {
                $query->where(array('sender_id' => $user->get('id'), 'receiver_id' => $_POST['interlocutor_id'], 'from_admin' => 1));
                $query->orCondition(array('receiver_id' => $user->get('id'), 'receiver_id:IS' => null));
                $query->andCondition(array('sender_id' => $_POST['interlocutor_id'], 'from_admin' => 0));
            }
            foreach($modx->getCollection('WebrtcChat', $query->sortBy('id', 'ASC')) as $message) {
                $response[$message->get('id')] = array(
                    'message' => $message->get('message'),
                    'sender_id' => $message->get('sender_id'),
                    'sender_name' => $message->get('sender_id') == $user->get('id') ? 'You' : $modx->getObject('WebrtcQueue', $message->get('sender_id'))->get('client_name'));
            }
        }
        $res = json_encode($response);
        break;
    // called after ending mWebRTC call
	case 'closeRoom':
	    if (isset($_POST['room_id']) && $_POST['room_id'] != '') {
        
            $rows=$modx->getCollection('WebrtcRoom', $modx->newQuery('WebrtcRoom')->where(array('room_id' => $_POST['room_id'], 'end_datetime:IS' => null)));
            foreach($rows as $row) {
                $query = $modx->newQuery('WebrtcQueue')->where(array('admin_id' => $row->get('admin_id'), 'end_datetime:IS' => null));
                foreach($modx->getCollection('WebrtcQueue', $query) as $queue) {
                    $queue->set('end_datetime', time());
                    $queue->save();
                }
                $row->set('end_datetime', time());
                $row->save();
            }
        }
		$res = true;
		break;
	// called when the admin calls the client
	case 'createRoom':
	    // needed to generate room id
	    function generateRandomString($length = 10) {
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $characters_length = strlen($characters);
            $random_string = '';
            for ($i = 0; $i < $length; $i++) {
                $random_string .= $characters[rand(0, $characters_length - 1)];
            }
            return $random_string;
        }
        
        do {
            $room_id = generateRandomString();
            $rows=$modx->getCollection('WebrtcRoom', $modx->newQuery('WebrtcRoom')->where(array('room_id' => $room_id)));
        // while the room id isn't unique
        } while(count($rows) > 0);
        
        if (isset($_POST['client_id']) && $_POST['client_id'] != '') {
            $user_id = $modx->getUser()->get('id');
            $queue = $modx->getObject('WebrtcQueue', $_POST['client_id']);
            $query = $modx->newQuery('WebrtcQueue')->where(array('admin_id' => $user_id, 'end_datetime:IS' => null));
            // don't let the admin to have more than 1 client
            if (($queue->get('admin_id') == '' && count($modx->getCollection('WebrtcQueue', $query)) == 0) || ($queue->get('admin_id') == $user_id && $queue->get('end_datetime') == '')) {
                $room = $modx->newObject('WebrtcRoom');
                $room->set('room_id', $room_id);
                $queue->set('admin_id', $user_id);
                $room->set('admin_id', $user_id);
                $room->set('admin_device', $_SERVER['HTTP_USER_AGENT']);
                $room->set('client_id', $queue->get('id'));
                $queue->save();
                $room->save();
            }
            else {
                $room_id = json_encode(false);
            }
        }
        $res = $room_id;
		break;
	// returns requested chunk
	case 'getChunk':
	    $res = !empty($_POST['chunk_name']) ? $modx->getChunk('tpl.mWebRTC.admin.'.$_POST['chunk_name']) : '';
	    if ($res == '') {
	        $res = json_encode(false);
	    }
	    break;
	// returns an array of clients in the queue
	case 'getQueue':
	    $rows=$modx->getCollection('WebrtcQueue', $modx->newQuery('WebrtcQueue')->where(array('end_datetime:IS' => null))->sortBy('id', 'ASC'));
        $response = array();
        foreach ($rows as $row) {
            if (empty($row->get('admin_id')) || $row->get('admin_id') == $modx->getUser()->get('id')) {
                $response[$row->get('id')] = array(
                    'datetime' => $row->get('start_datetime'),
                    'name' => $row->get('client_name'));
            }
        }
        $res = json_encode($response);
		break;
	// returns client_sdp of current room
	case 'getSignal':
	    $response = json_encode(false);
        if( isset( $_POST['room_id'] ) )
        {
            $rows=$modx->getCollection('WebrtcRoom', $modx->newQuery('WebrtcRoom')->where(array('room_id' => $_POST['room_id'], 'end_datetime:IS' => null)));
            foreach($rows as $row) {
                if (!empty($row->get('client_sdp'))) {
                    $response = $row->get('client_sdp');
        	    }
        	}
        	
        }
	    
	    $res = $response;
	    break;
	//sets admin_sdp of current room
	case 'postSignal':
        if( isset( $_POST['message'] ) ) {
            $rows=$modx->getCollection('WebrtcRoom', $modx->newQuery('WebrtcRoom')->where(array('room_id' => $_POST['room_id'], 'end_datetime:IS' => null)));
            foreach($rows as $row) {
                $row->set('admin_sdp', json_encode(array('Message' => $_POST['message'], 'ID' => microtime(true))));
                $row->save();
        	}
        	
        }
	    
	    $res = true;
	    break;
	// push notification to target user(s)
	case 'sendNotification':
	    if (isset($_POST['json_string'])) {
            
            $json_string_decoded = json_decode($_POST['json_string']);
            if (isset($json_string_decoded->{'target'}))
            {
                if($json_string_decoded->{'target'} == 'admins') {
                    $subscriptions = $modx->getCollection('WebrtcSubscription');
                    foreach($subscriptions as $subscription) {
                        sendNotification($subscription, $json_string_decoded, $auth);
                    }
                }
                else if ($json_string_decoded->{'target'} == 'client') {
                    if ($json_string_decoded->{'tag'} == 'call' && !empty($modx->getOption('mwebrtc_client_url'))) {
                        $json_string_decoded->{'link'} = is_numeric($modx->getOption('mwebrtc_client_url')) ? $modx->makeUrl($modx->getOption('mwebrtc_client_url')) : $modx->getOption('mwebrtc_client_url');
                    }
                    $subscription = $modx->getObject('WebrtcQueue', $json_string_decoded->{'client_id'});
                    sendNotification($subscription, $json_string_decoded, $auth);
                }
            }
        }
		$res = true;
		break;
	// subscribes user to push notifications
	case 'subscribe':
	    if (isset($_POST['endpoint'])) {
            $subscription = $modx->newObject('WebrtcSubscription');
            $subscription->set('admin_id', $modx->user->get('id'));
            $subscription->set('endpoint', $_POST['endpoint']);
            $subscription->save();
            $res = $modx->lastInsertId();
        }
        else {
		    $res = json_encode(false);
        }
		break;
	// unsubscribes user from push notifications
	case 'unsubscribe':
	    if (!empty($_POST['client_id'])) {
            $subscription = $modx->getObject('WebrtcQueue', $_POST['client_id']);
            if ($subscription->get('end_datetime') == '')
            $subscription->set('end_datetime', time());
            $subscription->save();
        } else {
    	    $subscriptions = $modx->getCollection('WebrtcSubscription', $modx->newQuery('WebrtcSubscription')->where(array('admin_id' => $modx->user->get('id'))));
    	    foreach($subscriptions as $subscription) {
                $subscription->remove();
    	    }
        }
		$res = true;
		break;
}

// if there is response return it and skip other snippets
if (!empty($res)) {
	die($res);
}