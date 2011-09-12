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
    				'action' => 'hello-world',
    				'controller' => 'example',
    				'module' => 'default',
    			),
    			'title' => 'Hello world'
    		)
    	);
    	
    }


}

