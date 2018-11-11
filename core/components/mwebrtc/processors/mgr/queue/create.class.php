<?php

class mWebRTCQueueCreateProcessor extends modObjectCreateProcessor
{
    public $objectType = 'WebrtcQueue';
    public $classKey = 'WebrtcQueue';
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

return 'mWebRTCQueueCreateProcessor';