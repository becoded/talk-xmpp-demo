Support = function (options) {
	this.options = options;
	this.connection = null;
	
	this.init = function ()
	{
		var me = this;
		$(function() {
			me.bindSendMessage();
			me.initConnection();
			var chatMsg = $('#message');
			me.resetTextarea(chatMsg);
		});
	};

	this.bindSendMessage = function ()
	{
		var me = this;
		var chatMsg = $('#message');
		
		$('#sendMessage').bind('click', function() {
			me.sendChatMessage(chatMsg.val());
			me.resetTextarea(chatMsg);
		});
		
		chatMsg.keyup(function(event) {
			if (event.keyCode == 13 && event.shiftKey) {
				me.sendChatMessage(chatMsg.val());
				me.resetTextarea(chatMsg);
			}
		});
	};
	
	this.resetTextarea = function (chatMsg)
	{
		chatMsg.val('');
		chatMsg.focus();
	};
	
	this.initConnection = function ()
	{
		var me = this;
		
		var jid = me.options.service.username + '@' + me.options.service.domain;
		
		me.connection = new Strophe.Connection(me.options.service.url);
	
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
			me.connection.send($pres().c('priority').t('1'));
			
			me.connection.addHandler(
				function(msg) {								//(Function) handler	The user callback.
					return me.handleChatMessage(msg); 
				}, 
				null, 										//(String) ns	The namespace to match.
				'message', 									//(String) name	The stanza name to match.
				'chat'); 									//(String) type	The stanza type attribute to match.
		}
	};
	
	this.sendChatMessage = function (message)
	{
		var me = this;
		
		var msg = $msg({
			to : 'support@' + me.options.service.domain,
			type : "chat"
			}).c('body').t(message);
		
		me.log('Sending message to support.');
		
		me.connection.send(msg);
		me.addMessageToChat(me.options.service.username, message);
	};
	
	this.handleChatMessage = function (msg)
	{
		var me = this;
		
		var objMsg = $(msg);
		var from = objMsg.attr('from');
		var nick = Strophe.getNodeFromJid(from);
		var body = objMsg.children('body').text();
		
		me.addMessageToChat(nick, body);
		
		// The handler should return true if it is to be invoked again; 
		// returning false will remove the handler after it returns.
		return true;
	};
	
	this.addMessageToChat = function (nick, body) {
		var me = this;
		var container = $('#chat');
		
		 // detect if we are scrolled all the way down
		var atBottom = container.scrollTop() >= container[0].scrollHeight - container.height();
		container.append('<dt>'+ nick +'</dt><dd>'+ me.nl2br(body, true) +'</dd>');

		// if we were at the bottom, keep us at the bottom
		if (atBottom) {
			container.scrollTop(container[0].scrollHeight);
		}
	};
	
	this.nl2br = function (str, isXhtml)
	{
		var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br />' : '<br>';
	    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
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
		var container = $('#log');
		container.append('<dt>'+me.getFormattedTime()+'</dt><dd>'+msg+'</dd>');
	};

	this.getFormattedTime = function ()
	{
		var dateTime = new Date();
		return [dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds() + '.' + dateTime.getMilliseconds()].join(':');
	}
	
	this.init();
};