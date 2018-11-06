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
        $name = trim($this->getProperty('name'));
        if (empty($name)) {
            $this->modx->error->addField('name', $this->modx->lexicon('mwebrtc_room_err_name'));
        } elseif ($this->modx->getCount($this->classKey, ['name' => $name])) {
            $this->modx->error->addField('name', $this->modx->lexicon('mwebrtc_room_err_ae'));
        }

        return parent::beforeSet();
    }

}

return 'mWebRTCRoomCreateProcessor';