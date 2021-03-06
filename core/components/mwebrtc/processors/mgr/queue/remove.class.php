<?php

class mWebRTCQueueRemoveProcessor extends modObjectProcessor
{
    public $objectType = 'WebrtcQueue';
    public $classKey = 'WebrtcQueue';
    public $languageTopics = ['mwebrtc'];
    //public $permission = 'remove';


    /**
     * @return array|string
     */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        $ids = $this->modx->fromJSON($this->getProperty('ids'));
        if (empty($ids)) {
            return $this->failure($this->modx->lexicon('mwebrtc_queue_err_ns'));
        }

        foreach ($ids as $id) {
            /** @var mWebRTCItem $object */
            if (!$object = $this->modx->getObject($this->classKey, $id)) {
                return $this->failure($this->modx->lexicon('mwebrtc_queue_err_nf'));
            }

            $object->remove();
        }

        return $this->success();
    }

}

return 'mWebRTCQueueRemoveProcessor';