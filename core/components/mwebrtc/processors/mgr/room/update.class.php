<?php

class mWebRTCRoomUpdateProcessor extends modObjectUpdateProcessor
{
    public $objectType = 'WebrtcRoom';
    public $classKey = 'WebrtcRoom';
    public $languageTopics = ['mwebrtc'];
    //public $permission = 'save';


    /**
     * We doing special check of permission
     * because of our objects is not an instances of modAccessibleObject
     *
     * @return bool|string
     */
    public function beforeSave()
    {
        if (!$this->checkPermissions()) {
            return $this->modx->lexicon('access_denied');
        }

        return true;
    }


    /**
     * @return bool
     */
    public function beforeSet()
    {
        $id = (int)$this->getProperty('id');
        if (empty($id)) {
            return $this->modx->lexicon('mwebrtc_room_err_ns');
        }
        
        return parent::beforeSet();
    }
}

return 'mWebRTCRoomUpdateProcessor';
