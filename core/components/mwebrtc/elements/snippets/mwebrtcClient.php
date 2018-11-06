<?php
// These two lines return client chunk without any property
//$res = $modx->getChunk('tpl.mWebRTC.client');
//if (empty($_POST['mwebrtc_action'])) return $res;

// this if statement returns client chunk with properties
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
        $output = $modx->getChunk('tpl.mWebRTC.client', array( 
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
    // gets chat message
    case 'chatGet':
        $response = array();
        $array = array('end_datetime:IS' => null);
        if (!empty($_COOKIE['PHPSESSID'])) {
            $array['session_id'] = $_COOKIE['PHPSESSID'];
        }
        if ($user = $modx->getObject('WebrtcQueue', $modx->newQuery('WebrtcQueue', $array)->sortBy('id', 'DESC'))) {
            $query = $modx->newQuery('WebrtcChat');
            if (!is_numeric($_POST['interlocutor_id'])) {
                if (is_numeric($_POST['seconds'])) {
                    $query->where(array('receiver_id' => $user->get('id'), 'from_admin' => 1, 'datetime:>' => date('Y-m-d H:i:s', time() - $_POST['seconds'])));
                } else {
                    $query->where(array('sender_id' => $user->get('id'), 'from_admin' => 0));
                    $query->orCondition(array('receiver_id' => $user->get('id'), 'AND:from_admin:=' => 1));
                }
            } else {
                if (is_numeric($_POST['seconds'])) {
                    $query->where(array('receiver_id' => $user->get('id'), 'sender_id' => $_POST['interlocutor_id'], 'from_admin' => 1, 'datetime:>' => date('Y-m-d H:i:s', time() - $_POST['seconds'])));
                } else {
                    $query->where(array('receiver_id' => $user->get('id'), 'sender_id' => $_POST['interlocutor_id'], 'from_admin' => 1));
                    $query->orCondition(array('sender_id' => $user->get('id'), 'AND:receiver_id:=' => $_POST['interlocutor_id'], 'AND:from_admin:=' => 0));
                }
            }
            foreach($modx->getCollection('WebrtcChat', $query->sortBy('id', 'ASC')) as $message) {
                $response[$message->get('id')] = array(
                    'message' => $message->get('message'),
                    'sender_id' => $message->get('sender_id'),
                    'sender_name' => $message->get('sender_id') == $user->get('id') ? 'You' : 'admin');
            }
            //$response = $output;
        }
        $res = json_encode($response);
        break;
    // sends chat message
    case 'chatSend':
        $response = json_encode(false);
        if (!empty($_POST['message']) && !empty($_POST['receiver']) && !empty($_COOKIE['PHPSESSID'])) {
            $message = $modx->newObject('WebrtcChat');
            foreach($modx->getCollection('WebrtcQueue',  $modx->newQuery('WebrtcQueue')->where(array('session_id' => $_COOKIE['PHPSESSID'], 'end_datetime:IS' => null))) as $queue) {
                $message->set('sender_id', $queue->get('id'));
            }
            if (is_numeric($_POST['receiver'])) {
                $message->set('receiver_id', $_POST['receiver']);
            }
            $message->set('message', $_POST['message']);
            $message->set('from_admin', 0);
            if ($message->save()) {
                $response = true;
            }
            
        }
        $res = $response;
        break;
    // called on page load and and uses 'PHPSESSID' cookie return the client's queue/room state
    case 'checkSession':
	    $response = array('state' => 'none');
	    if (!empty($_COOKIE['PHPSESSID'])) {
    	    $client_id = -1;
    	    $rows = $modx->getCollection('WebrtcQueue', $modx->newQuery('WebrtcQueue')->where(array('session_id' => $_COOKIE['PHPSESSID'], 'end_datetime:IS' => null)));
    	    foreach($rows as $row) {
    	        $client_id = $row->get('id');
    	        $response = array(
    	            'state' => 'queue',
    	            'client_name' => $row->get('client_name'),
    	            'client_id' => $client_id);
    	    }
    	    $rows = $modx->getCollection('WebrtcRoom', $modx->newQuery('WebrtcRoom')->where(array('client_id' => $client_id, 'end_datetime:IS' => null)));
    	    foreach($rows as $row) {
    	        $response = array(
    	            'state' => 'room',
    	            'room_id' => $row->get('room_id'));
    	    }
	    }
	    $res = json_encode($response);
	    break;
	// returns requested chunk
	case 'getChunk':
	    $res = !empty($_POST['chunk_name']) ? $modx->getChunk('tpl.mWebRTC.client.'.$_POST['chunk_name']) : '';
	    if ($res == '') {
	        $res = json_encode(false);
	    }
	    break;
	// returns admin_sdp of the current room
	case 'getSignal':
	    $response = json_encode(false);
        if( isset( $_POST['room_id'] ) )
        {
            $rows = $modx->getCollection('WebrtcRoom', $modx->newQuery('WebrtcRoom')->where(array('room_id' => $_POST['room_id'], 'end_datetime:IS' => null)));
            foreach($rows as $row) {
                if (!empty($row->get('admin_sdp'))) {
    	            $response = $row->get('admin_sdp');
        	    }
        	}
        	
        }
	    
	    $res = $response;
	    break;
	// adds the client to room on the backend
	case 'joinRoom':
	    $access = false;
        if (isset($_POST['room_id']) && $_POST['room_id'] != '') {
        
            $user = $modx->getUser();
            $rows = $modx->getCollection('WebrtcRoom', $modx->newQuery('WebrtcRoom')->where(array('room_id' => $_POST['room_id'])));
            foreach($rows as $row) {
                if ($row->get('end_datetime') == '') {
                    $row->set('client_device', $_SERVER['HTTP_USER_AGENT']);
                    $access = true;
                    $row->save();
                }
            }
        }
		$res = json_encode($access);
		break;
	//sets admin_sdp of the current room
	case 'postSignal':
        if (isset( $_POST['message'])) {
            $rows = $modx->getCollection('WebrtcRoom', $modx->newQuery('WebrtcRoom')->where(array('room_id' => $_POST['room_id'], 'end_datetime:IS' => null)));
            foreach($rows as $row) {
    	        $row->set('client_sdp', json_encode(array('Message' => $_POST['message'], 'ID' => microtime(true))));
                $row->save();
        	}
        }
	    $res = true;
	    break;
	// sends callback message
	case 'sendMessage':
	    $response = json_encode(false);
        if (!empty($_POST['client_id']) && !empty($_POST['phone']) && isset($_POST['message'])) {
            $subscription = $modx->getObject('WebrtcQueue', $_POST['client_id']);
            $subscription->set('phone_number', $_POST['phone']);
            $subscription->set('message', $_POST['message']);
            $subscription->save();
            $response = true;
        }
        $res = $response;
		break;
	// push notification to target user(s)
	case 'sendNotification':
	    if (isset($_POST['json_string'])) {
            $json_string_decoded = json_decode($_POST['json_string']);
            if (isset($json_string_decoded->{'target'}))
            {
                if($json_string_decoded->{'target'} == 'admins') {
                    if ($json_string_decoded->{'tag'} == 'queue_add' && !empty($modx->getOption('mwebrtc_admin_url'))) {
                        $json_string_decoded->{'link'} = is_numeric($modx->getOption('mwebrtc_admin_url')) ? $modx->makeUrl($modx->getOption('mwebrtc_admin_url')) : $modx->getOption('mwebrtc_admin_url');
                    }
                    $subscriptions = $modx->getCollection('WebrtcSubscription');
                    foreach($subscriptions as $subscription) {
                        sendNotification($subscription, $json_string_decoded, $auth);
                    }
                }
                else if ($json_string_decoded->{'target'} == 'client') {
                    $subscription = $modx->getObject('WebrtcQueue', $json_string_decoded->{'client_id'});
                    sendNotification($subscription, $json_string_decoded, $auth);
                }
            }
        }
		$res = true;
		break;
	// subscribes user to push notifications
	case 'subscribe':
	    if (isset($_POST['endpoint']) && !empty($_POST['client_name'])) {
            $subscription = $modx->newObject('WebrtcQueue');
            $subscription->set('client_name', $_POST['client_name']);
            $subscription->set('endpoint', $_POST['endpoint']);
            if (!empty($_COOKIE['PHPSESSID'])) {
                $subscription->set('session_id', $_COOKIE['PHPSESSID']);
            }
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
        }
		$res = true;
		break;
}

// if there is response return it and skip other snippets
if (!empty($res)) {
	die($res);
}