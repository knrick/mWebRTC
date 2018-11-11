<?php

class mWebRTCRoomCreateProcessor extends modObjectCreateProcessor
{
    public $objectType = 'WebrtcRoom';
    public $classKey = 'WebrtcRoom';
    public $languageTopics = ['mwebrtc'];
    //public $permission = 'create';


    /**
     * @return bool
     */
    public function beforeSet()
    {
        return parent::beforeSet();
    }

}

return 'mWebRTCRoomCreateProcessor';