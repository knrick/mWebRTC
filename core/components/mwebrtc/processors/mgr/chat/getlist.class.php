<?php
//$modx->addPackage('mwebrtc', MODX_CORE_PATH.'components/mwebrtc/model/');
class mWebRTCChatGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'WebrtcChat';
    public $classKey = 'WebrtcChat';
    public $defaultSortField = 'id';
    public $defaultSortDirection = 'DESC';
    //public $permission = 'list';


    /**
     * We do a special check of permissions
     * because our objects is not an instances of modAccessibleObject
     *
     * @return boolean|string
     */
    public function beforeQuery()
    {
        if (!$this->checkPermissions()) {
            return $this->modx->lexicon('access_denied');
        }

        return true;
    }


    /**
     * @param xPDOQuery $c
     *
     * @return xPDOQuery
     */
    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $query = trim($this->getProperty('query'));
        if ($query) {
            $c->where([
                'name:LIKE' => "%{$query}%",
                'OR:description:LIKE' => "%{$query}%",
            ]);
        }

        return $c;
    }


    /**
     * @param xPDOObject $object
     *
     * @return array
     */
    public function prepareRow(xPDOObject $object)
    {
        $array = $object->toArray();
        $array['actions'] = [];

        // Edit
        $array['actions'][] = [
            'cls' => '',
            'icon' => 'icon icon-edit',
            'title' => $this->modx->lexicon('mwebrtc_chat_update'),
            //'multiple' => $this->modx->lexicon('mwebrtc_items_update'),
            'action' => 'updateChat',
            'button' => true,
            'menu' => true,
        ];

        if (!$array['active']) {
            $array['actions'][] = [
                'cls' => '',
                'icon' => 'icon icon-power-off action-green',
                'title' => $this->modx->lexicon('mwebrtc_chat_enable'),
                'multiple' => $this->modx->lexicon('mwebrtc_chats_enable'),
                'action' => 'enableChat',
                'button' => true,
                'menu' => true,
            ];
        } else {
            $array['actions'][] = [
                'cls' => '',
                'icon' => 'icon icon-power-off action-gray',
                'title' => $this->modx->lexicon('mwebrtc_chat_disable'),
                'multiple' => $this->modx->lexicon('mwebrtc_chats_disable'),
                'action' => 'disableChat',
                'button' => true,
                'menu' => true,
            ];
        }

        // Remove
        $array['actions'][] = [
            'cls' => '',
            'icon' => 'icon icon-trash-o action-red',
            'title' => $this->modx->lexicon('mwebrtc_chat_remove'),
            'multiple' => $this->modx->lexicon('mwebrtc_chats_remove'),
            'action' => 'removeChat',
            'button' => true,
            'menu' => true,
        ];

        return $array;
    }

}

return 'mWebRTCChatGetListProcessor';