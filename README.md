## Installation

### Quick start

* Install MODX Revolution

* Upload this package into the `Extras` directory in the root of site
```
php ~/www/Extras/mWebRTC/rename_it.php anyOtherName
```
*path on your site may differs*

* Then install it on dev site
```
php ~/www/Extras/mWebRTC/_build/build.php
``` 

### Settings

See `_build/config.inc.php` for editable package options.

All resolvers and elements are in `_build` path. All files that don't begin with `.` or `_` will be added automatically. 

If you will add a new type of element, you will need to add the method with that name into `build.php` script as well.

### Build and download

You can build package at any time by opening `http://dev.site.com/Extras/mWebRTC/_build/build.php`

If you want to download built package - just add `?download=1` to the address.

## Setup

### Quick Start

Move `/assets/components/mwebrtc/js/sw.js` to `~/www/`

Use mWebRTC.main page template.

On client page add `[[!mwebrtcClient? &icon='assets/images/RTCICON1.png']]`

On admin page add `[[!mwebrtcAdmin? &icon='assets/images/RTCICON1.png']]`

### System Settings

* **Service Worker** - Path to Service Worker that will handle the extra's web pushes. `/sw.js` by default. Notice, that the service worker will intercept only requests from files within its location.  So if the service worker's file is located in the root directory, it will control requests from all files at this domain. If you already have a service worker then put `sw.js` code in your service worker file or use [importScripts][1].

* **Admin and Client URLs** - When users will click on notifications they will be redirected to their corresponding links. You can enter either URLs or ids of modx documents. These settings are optional.

* **VAPID public and private keys** - WebPush uses VAPID standard to restrict the validity of a subscription to a specific application server (so, by using VAPID, only your server will be able to send notifications to a subscriber). So I highly recommend to generate your own VAPID keys. You can do it [here][2] or by using this php script:
```
require_once MODX_CORE_PATH.'components/mwebrtc/web_push/vendor/autoload.php';
use Minishlink\WebPush\VAPID;

var_dump(VAPID::createVapidKeys());
```

* **VAPID subject** - This string needs to be either a URL or a mailto email address. This piece of information will actually be sent to web push service as part of the request to trigger a push. The reason this is done is so that if a web push service needs to get in touch with the sender, they have some information that will enable them to.

### Snippets Properties

* **animModal** - Defines animation of UI form. You can look up animations in the snippets.

* **icon** - path to UI icon.

* **group** - Only for webrtcAdmin. A UserGroup that gets admin status and access to the snippet's functionality.

## Usage

1. As an admin subscribe to push notifications on admin page by clicking *subscribe* button. If the browser asks for push-notification permissions, accept. You need to do it only once.
2. As a client click *open_room* button on client page to join the waiting queue. Again, if You are asked for the permissions, accept them.
3. When a client joins the queue all browsers subscribed to push will get a notification. You should click or close the notification in less than a minute or else the admins will be considered offline and the client will be kicked out of the queue and will be asked to leave a callback message.
4. At this moment client and admin will be able to communicate via a simple built-in chat.
5. To create a WebRTC room and invite a client to videocall click a *call_button* button near the client's name. The browser will ask for Camera and Microphone permissions. Then after couple seconds the client will get an invite notification.
6. After client gets an notification, *call* button will pop up on his page. After clicking it the browser will ask for camera and microphone access. Then begins the connection.
7. A connection should take a few seconds. When admin and client are connected they can see each other's camera and talk to each other via their microphones. Each one can disconnect by clicking *hangup* button.
8. A client can connect back after disconnecting. But when An admin does it, the room closes.

[1]: https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts
[2]: https://tools.reactpwa.com/vapid