<?php

class ExampleController extends Zend_Controller_Action
{
	protected $_xmppConfig = null;
	
	public function init ()
	{
		/* Initialize action controller here */
	}

	/**
	 * Hello World example
	 * 
	 * @example
	 */
	public function helloWorldAction ()
	{
		$this->view->xmppConfig = $this->_getXmppConfig()->toArray();
	}
	
	protected function _getXmppConfig()
	{
		if (is_null($this->_xmppConfig)) {
			$this->_xmppConfig = new Zend_Config_Ini(
				APPLICATION_PATH . '/configs/xmpp.ini', 
				APPLICATION_ENV);
		}
		
		return $this->_xmppConfig;
	}
}

