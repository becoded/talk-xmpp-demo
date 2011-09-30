PreBindMessage = function (options) {
	
	this.options = options;
	
	this.init = function ()
	{
		var me = this;
		$(function() {
			console.time("profile connect and send");
			me.initConnection();
		});
	};

	this.initConnection = function ()
	{
		var me = this;
		
		me.connection = new Strophe.Connection(me.options.service.url);
		
		me.connection.attach(
			me.options.service.jid, 
			me.options.service.sid, 
			me.options.service.rid, 
			function (status) { 
				me.statusHandler(status);
			});
	};
	
	this.statusHandler = function (status)
	{
		var me = this;
		me.logStatus(status);
	
		if (status == Strophe.Status.ATTACHED) {
			me.sendHelloWorld();
		}
		
	};
	
	this.sendHelloWorld = function ()
	{
		var me = this;
		
		var msg = $msg({
			to : 'support@demo',
			type : "chat"
			}).c('body').t('Hello world from Strophe - pre-bind');
		
		me.connection.send(msg);
		console.timeEnd("profile connect and send");
		setTimeout(function () {
			me.connection.disconnect();
		}, 500);
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