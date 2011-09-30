<?php

class IndexController extends Zend_Controller_Action
{

	public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
    	$this->view->examples = array(
    		array(
    			'url' => array(
    				'action' => 'send-message-php',
    				'controller' => 'example',
    				'module' => 'default',
    				'library' => 'xmpphp'
    			),
    			'title' => 'Send message XMPPHP'
    		),
    		array(
    			'url' => array(
    				'action' => 'send-message-php',
    				'controller' => 'example',
    				'module' => 'default',
    				'library' => 'jaxl'
    			),
    			'title' => 'Send message Jaxl'
    		),
    		array(
    			'url' => array(
    				'action' => 'send-message-javascript',
    				'controller' => 'example',
    				'module' => 'default',
    				'library' => 'xmpphp'
    			),
    			'title' => 'Send message Strophe'
    		),
    		array(
    			'url' => array(
    				'action' => 'ping-pong',
    				'controller' => 'example',
    				'module' => 'default',
    			),
    			'title' => 'IQ - Ping Pong'
    		),
    		array(
    			'url' => array(
    				'action' => 'support',
    				'controller' => 'example',
    				'module' => 'default',
    			),
    			'title' => 'Support chat'
    		),
    		array(
    			'url' => array(
    				'action' => 'statistic',
    				'controller' => 'example',
    				'module' => 'default',
    			),
    			'title' => 'Statistic'
    		),
    		array(
    			'url' => array(
    				'action' => 'statistic-admin',
    				'controller' => 'example',
    				'module' => 'default',
    			),
    			'title' => 'Statistic admin'
    		),
    		array(
    			'url' => array(
    				'action' => 'pre-bind',
    				'controller' => 'example',
    				'module' => 'default',
    			),
    			'title' => 'Pre-bind'
    		),
    	);
    	
    }


}

