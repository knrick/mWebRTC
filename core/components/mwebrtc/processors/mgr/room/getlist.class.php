<?php
//$modx->addPackage('mwebrtc', MODX_CORE_PATH.'components/mwebrtc/model/');
class mWebRTCRoomGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'WebrtcRoom';
    public $classKey = 'WebrtcRoom';
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
        $c->select($this->modx->getSelectColumns($this->classKey, $this->classKey));
		$c->select('User.username as admin_name, WebrtcQueue.client_name');
		$c->leftJoin('modUser', 'User', array('WebrtcRoom.admin_id =User.id'));
		$c->leftJoin('WebrtcQueue', 'WebrtcQueue', array('WebrtcRoom.client_id =WebrtcQueue.id'));
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
            'title' => $this->modx->lexicon('mwebrtc_room_update'),
            //'multiple' => $this->modx->lexicon('mwebrtc_items_update'),
            'action' => 'updateRoom',
            'button' => true,
            'menu' => true,
        ];

        if (!$array['active']) {
            $array['actions'][] = [
                'cls' => '',
                'icon' => 'icon icon-power-off action-green',
                'title' => $this->modx->lexicon('mwebrtc_room_enable'),
                'multiple' => $this->modx->lexicon('mwebrtc_rooms_enable'),
                'action' => 'enableRoom',
                'button' => true,
                'menu' => true,
            ];
        } else {
            $array['actions'][] = [
                'cls' => '',
                'icon' => 'icon icon-power-off action-gray',
                'title' => $this->modx->lexicon('mwebrtc_room_disable'),
                'multiple' => $this->modx->lexicon('mwebrtc_rooms_disable'),
                'action' => 'disableRoomm',
                'button' => true,
                'menu' => true,
            ];
        }

        // Remove
        $array['actions'][] = [
            'cls' => '',
            'icon' => 'icon icon-trash-o action-red',
            'title' => $this->modx->lexicon('mwebrtc_room_remove'),
            'multiple' => $this->modx->lexicon('mwebrtc_rooms_remove'),
            'action' => 'removeRoom',
            'button' => true,
            'menu' => true,
        ];

        return $array;
    }

}

return 'mWebRTCRoomGetListProcessor';