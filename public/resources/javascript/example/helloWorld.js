HelloWord = function (options) {
	this.options = options;
	this.connection = null;
	
	this.init = function ()
	{
		var me = this;
		$(function() {
			me.initDialog();
		});
	};

	this.initDialog = function ()
	{
		var me = this;
		$('#loginDialog').dialog({
			resizable: false,
			autoOpen: true,
			height:200,
			modal: true,
			buttons: {
				Connect: function() {
					var username=$('#username').val();
					var password=$('#password').val();
					
					if (username.length > 0 && password.length > 0) {
						me.options.service.username = username;
						me.options.service.password = password;
						$('#password').val('');
						$( this ).dialog( "close" );
						
						me.initConnection();
						
					} else {
						alert('Please provide a username and password');
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	};
	
	this.initConnection = function ()
	{
		var me = this;
		
		me.connection = new Strophe.Connection(me.options.service.url);
		
		var jid = me.options.service.username+'@'+me.options.service.domain;

		me.connection.connect(
			jid, 
			me.options.service.password, 
			function (status) { 
				me.statusHandler(status);
			});
	};
	
	this.statusHandler = function (status)
	{
		var me = this;
		me.logStatus(status);
	
		if (status == Strophe.Status.CONNECTED) {
			me.connection.addHandler(
				function(msg) {								//(Function) handler	The user callback.
					return me.handleHelloWorld(msg); 
				}, 
				null, 										//(String) ns	The namespace to match.
				'iq', 										//(String) name	The stanza name to match.
				null, 										//(String) type	The stanza type attribute to match.
				'helloWorld1');								//(String) id	The stanza id attribute to match.
			
			me.sendHelloWorld(Strophe.getDomainFromJid(me.connection.jid));
		}
	};
	
	this.sendHelloWorld = function (to)
	{
		var me = this;
		
		var iq = $iq({
			to	: to,
			type : 'get',
			id : 'helloWorld1'
			}).c('HelloWorld', {xmlns: 'urn:xmpp:ping'});
		
		me.log('Sending stanza helloWorld to "'+ to +'".');
		me.connection.send(iq);
	};
	
	this.handleHelloWorld = function (msg)
	{
		var me = this;
		
		var objMsg = $(msg);
		var from = objMsg.attr('from');
		
		me.log('Receiving ' + objMsg.attr('type') + ' from "' + objMsg.attr('from') + '" with id "' + objMsg.attr('id') + '"');
		me.connection.disconnect();
	};
	
	this.logStatus = function (status)
	{
		var me = this;
		var tag = 'Status: ';
		switch(status) {
			case Strophe.Status.ERROR: //An error has occurred
				tag += 'error';
				break;
			case Strophe.Status.CONNECTING: //The connection is currently being made
				tag += 'connecting';
				break;
			case Strophe.Status.CONNFAIL: //The connection attempt failed
				tag += 'connection failed';
				break;
			case Strophe.Status.AUTHENTICATING: //The connection is authenticating
				tag += 'authenticating';
				break;
			case Strophe.Status.AUTHFAIL: //The authentication attempt failed
				tag += 'authentication failed';
				break;
			case Strophe.Status.CONNECTED: //The connection has succeeded
				tag += 'connected';
				break;
			case Strophe.Status.DISCONNECTED: //The connection has been terminated
				tag += 'disconnected';
				break;
			case Strophe.Status.DISCONNECTING: //The connection is currently being terminated
				tag += 'disconnecting';
				break;
			case Strophe.Status.ATTACHED: //The connection has been attached
				tag += 'attached';
				break;
		}
		
		me.log(tag);
	};
	
	this.log = function(msg) 
	{
		var me = this;
		$('#log').append('<dt>'+me.getFormattedTime()+'</dt><dd>'+msg+'</dd>');
	};

	this.getFormattedTime = function ()
	{
		var dateTime = new Date();
		return [dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds() + '.' + dateTime.getMilliseconds()].join(':');
	}
	
	this.init();
};