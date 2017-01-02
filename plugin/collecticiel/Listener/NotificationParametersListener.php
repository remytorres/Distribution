<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 4/13/15
 */

namespace Innova\CollecticielBundle\Listener;

use Claroline\CoreBundle\Event\Notification\NotificationParametersEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class NotificationParametersListener.
 *
 * @DI\Service()
 */
class NotificationParametersListener
{
    /**
     * @param NotificationParametersEvent $event
     *
     * @DI\Observe("icap_notification_parameters_event")
     */
    public function onGetTypesForParameters(NotificationParametersEvent $event)
    {
        $children = [
            'create_collecticiel',
            'deletion_collecticiel',
            'Request comment',
            'Answer comment',
        ];
        $event->addTypes('innova_collecticiel', false, 'innova_collecticiel', $children);
        $event->addTypes($children, true, 'innova_collecticiel');
    }
}