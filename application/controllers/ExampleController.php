<?php

class ExampleController extends Zend_Controller_Action
{
	protected $_xmppConfig = null;
	protected $_xmppConnection = null;
	
	public function init ()
	{
		/* Initialize action controller here */
	}

	/**
	 * send message example with javascript
	 * 
	 */
	public function sendMessageJavascriptAction ()
	{
		$this->view->xmppConfig = $this->_getXmppConfig()->toArray();
	}
	
	/**
	 * send message example with php
	 * 
	 */
	public function sendMessagePhpAction ()
	{
		$library = $this->getRequest()->getParam('library');
		
		switch ($library) {
			case 'xmpphp':
				$this->_sendMessageXmpphp();
				$this->view->sent = true;
			break;
			case 'jaxl':
				$this->_sendMessageJaxl();
				$this->view->sent = true;
			break;
			default:
				$this->view->sent = false;
			break;
		}
	}

	/**
	 * Send message with XMPPPHP library
	 * 
	 */
	protected function _sendMessageXmpphp()
	{
		$message = $this->getRequest()->getParam('message', 'Hello world from XMPPHP');
		
		$connection = $this->_getXmpphpConnection();
	    $connection->connect();
	    $connection->processUntil('session_start');
	    $connection->message('support@demo', $message);
	    $connection->disconnect();
	    
	    ob_start();
	    $connection->getLog()->printout();
	    
	    $this->view->log =  htmlentities(ob_get_contents());
		ob_end_clean();
	}

	/**
	 * Send message with Jaxl library
	 * 
	 */
	protected function _sendMessageJaxl()
	{
		$connection = $this->_getJaxlConnection();
		
		 // Register callback on required hooks
	    $connection->addPlugin('jaxl_post_auth', array($this, '_postAuthHook'));

	    // Fire start Jaxl core
	    $connection->startCore("stream");
	}
	
	/**
	 * Post auth hook
	 * 
	 * @param mixed $payload
	 * @param JAXL $jaxl
	 */
	public function _postAuthHook ($payload, $jaxl)
	{
		$message = $this->getRequest()->getParam('message', 'Hello world from Jaxl');
		
		$jaxl->sendMessage('support@demo', $message);
        $jaxl->shutdown();
	}
	
	/**
	 * Ping Pong example
	 * 
	 */
	public function pingPongAction ()
	{
		$this->view->xmppConfig = $this->_getXmppConfig()->toArray();
	}
	
	/**
	 * Support example
	 * 
	 */
	public function supportAction()
	{
		$this->view->xmppConfig = $this->_getXmppConfig()->toArray();
	}
	
	/**
	 * Statistic example
	 * 
	 */
	public function statisticAction()
	{
		$this->view->xmppConfig = $this->_getXmppConfig()->toArray();
		
		$list = array(
			'Firefox' => 1,
			'IE' => 1,
			'Chrome' => 1,
			'Safari' => 1,
			'Opera' => 1,
			'Others' => 1);
		
		$this->view->chartData = $this->_convertToChartData($list);
		$chart = new Zend_Session_Namespace('chart');
		$chart->data = $list;
	}
	
	protected function _convertToChartData($list)
	{
		$chartData = array();
		
		foreach ($list as $k => $v) {
			$chartData[] = array($k, $v);
		}
		
		return $chartData;
	}
	
	/**
	 * Statistic admin example
	 * 
	 */
	public function statisticAdminAction()
	{
		if ($this->getRequest()->isXmlHttpRequest()) {
			$chart = new Zend_Session_Namespace('chart');
			$list = $chart->data;
			
			$list[$this->getRequest()->getParam('browser')]++;
			
			$chart->data = $list;
			
			$json = json_encode($this->_convertToChartData($list));
			
			$connection = $this->_getXmpphpConnection();
		    $connection->connect();
		    $connection->processUntil('session_start');
		    
		    $message = '<message from="server@demo" to="demo1@demo" type="json">';
			$message .= '<body>'.$json.'</body>';
			$message .= '</message>';
			
			$connection->send($message);
		    
		    $connection->disconnect();

		    $this->getHelper("Json")->sendJson(true);
		}
	}
	
	public function preBindAction()
	{
		$this->view->xmppConfig = $this->_getXmppConfig()->toArray();
		$boshBootstrap = new Application_Model_BoshBootstrap('demo', 'http://xmpp.dev.becoded.be/bind');
		
		$boshBootstrap->connect('demo1', 'demo1');
		$this->view->boshBootstrap = array(
			'jid' => $boshBootstrap->getJid(),
			'sid' => $boshBootstrap->getSid(),
			'rid' => $boshBootstrap->getRid(),
		);
	}
	
	/**
	 * Get a connection using XMPPHP
	 * 
	 */
	protected function _getXmpphpConnection()
	{
		if (is_null($this->_xmppConnection)) {
			$config = $this->_getXmppConfig();
			$this->_xmppConnection =  new XMPPHP_XMPP(
                    $config->host,
                    $config->port, 
                    $config->identifier->node,
                    $config->identifier->password, 
                    $config->identifier->resource,
                    $config->domain,
                    $config->printlog,
                    $config->loglevel);
		}
		
		return $this->_xmppConnection;
	}
	
	/**
	 * Get a connection using Jaxl
	 * 
	 */
	protected function _getJaxlConnection($options = array())
	{
		if (is_null($this->_xmppConnection)) {
			$config = $this->_getXmppConfig();
			
			require_once APPLICATION_PATH.'/../library/JAXL/core/jaxl.class.php';			
			
			$defaultOptions = array(
	       		'user'		=> $config->identifier->node,
	        	'pass'		=> $config->identifier->password,
	            'host' 		=> $config->host,
	            'domain' 	=> $config->domain,
	            'port' 		=> $config->port,
	            'authType'	=> 'PLAIN',
	            'logLevel'	=> $config->loglevel,
				'logPath'	=> '/tmp/jaxl.log',
				'pidPath'	=> '/tmp/jaxl.pid',
				'mode'		=> 'cli' 
	        );
	        
	        $options = array_merge($defaultOptions, $options);
	        
			$this->_xmppConnection = new JAXL($options);
        }
        
		return $this->_xmppConnection;
	}
	
	/**
	 * Get the XMPP config 
	 * 
	 */
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

