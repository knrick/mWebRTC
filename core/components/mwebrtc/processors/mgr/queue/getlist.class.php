<?php
//$modx->addPackage('mwebrtc', MODX_CORE_PATH.'components/mwebrtc/model/');
class mWebRTCQueueGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'WebrtcQueue';
    public $classKey = 'WebrtcQueue';
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
		$c->select('User.username as admin_name');
		$c->leftJoin('modUser', 'User', array('WebrtcQueue.admin_id =User.id'));
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
            'title' => $this->modx->lexicon('mwebrtc_queue_update'),
            //'multiple' => $this->modx->lexicon('mwebrtc_items_update'),
            'action' => 'updateQueue',
            'button' => true,
            'menu' => true,
        ];

        if (!$array['active']) {
            $array['actions'][] = [
                'cls' => '',
                'icon' => 'icon icon-power-off action-green',
                'title' => $this->modx->lexicon('mwebrtc_queue_enable'),
                'multiple' => $this->modx->lexicon('mwebrtc_queues_enable'),
                'action' => 'enableQueue',
                'button' => true,
                'menu' => true,
            ];
        } else {
            $array['actions'][] = [
                'cls' => '',
                'icon' => 'icon icon-power-off action-gray',
                'title' => $this->modx->lexicon('mwebrtc_queue_disable'),
                'multiple' => $this->modx->lexicon('mwebrtc_queues_disable'),
                'action' => 'disableQueue',
                'button' => true,
                'menu' => true,
            ];
        }

        // Remove
        $array['actions'][] = [
            'cls' => '',
            'icon' => 'icon icon-trash-o action-red',
            'title' => $this->modx->lexicon('mwebrtc_queue_remove'),
            'multiple' => $this->modx->lexicon('mwebrtc_queues_remove'),
            'action' => 'removeQueue',
            'button' => true,
            'menu' => true,
        ];

        return $array;
    }

}

return 'mWebRTCQueueGetListProcessor';