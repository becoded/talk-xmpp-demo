<?php
class Application_Model_BoshBootstrap
{
	protected $sid;
	protected $rid;
	protected $jid;
	protected $domain;
	protected $httpBindUri;

	public function __construct ($domain, $httpBindUri)
	{
		$this->domain = $domain;
		$this->httpBindUri = $httpBindUri;
	}

	public function getRid ()
	{
		return $this->rid;
	}

	public function getSid ()
	{
		return $this->sid;
	}

	public function getJid ()
	{
		return $this->jid;
	}

	public function connect ($user, $password)
	{
		$hash = base64_encode($user . "@" . $this->domain . "\0" . $user . "\0" . $password) . "\n";
		$rid = rand();
		$jid = $user . "@" . $this->domain;
		
		$body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' to='" . $this->domain . "' xml:lang='en' wait='60' hold='1' window='5' content='text/xml; charset=utf-8' ver='1.6' xmpp:version='1.0' xmlns:xmpp='urn:xmpp:xbosh'/>";
		
		$return = $this->__sendBody($body);
		
		$xml = new SimpleXMLElement($return);
		
		$sid = $xml['sid']->__toString();
		$rid ++;
		$body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' sid='" . $sid . "'><auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" . $hash . "</auth></body>";
		$return = $this->__sendBody($body);
		
		$rid ++;
		$body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' sid='" . $sid . "' to='" . $this->domain . "' xml:lang='en' xmpp:restart='true' xmlns:xmpp='urn:xmpp:xbosh'/>";
		$return = $this->__sendBody($body);
		
		$rid ++;
		$body = "<body rid='" . $rid . "' xmlns='http://jabber.org/protocol/httpbind' sid='" . $sid . "'><iq type='set' id='_bind_auth_2' xmlns='jabber:client'><bind xmlns='urn:ietf:params:xml:ns:xmpp-bind'/></iq></body>";
		
		$return = $this->__sendBody($body);
		
		$rid ++;
		$body = "<body rid='" . $rid . "' xmlns='http://jabber.org/ protocol/httpbind' sid='" . $sid . "'><iq type='set' id='_session_auth_2' xmlns='jabber:client'><session xmlns='urn:ietf:params:xml:ns:xmpp-session'/></iq></body>";
		$return = $this->__sendBody($body);
		$rid ++;
		$this->rid = $rid;
		$this->sid = $sid;
		$this->jid = $jid;
	}

	private function __sendBody ($body)
	{
		$ch = curl_init($this->httpBindUri);
		
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		$header = array('Content-Type: text/xml; charset=utf-8');
		curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		curl_setopt($ch, CURLOPT_VERBOSE, 0);
		$output = '';
		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$output = curl_exec($ch);
		
		curl_close($ch);
		return ($output);
	}

} 