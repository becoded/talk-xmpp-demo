StatisticAdmin = function (options) {
	this.options = options;
	
	this.init = function ()
	{
		var me = this;
		$(function() {
			me.initBindAnchors();
		});
	};

	this.initBindAnchors = function ()
	{
		var me = this;
		$('ul a').bind('click', function (e) {
			e.preventDefault();
			var browser = e.currentTarget.href;
			browser = browser.substr(browser.lastIndexOf('#') + 1);
			
			$.ajax({
				  dataType: 'json',
				  data: {browser: browser },
				  type: 'POST',
				  success: function( data, status, xhr ) {
						
				}
			});
		});

	};
	
	this.init();
};