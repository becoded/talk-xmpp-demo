Statistic = function (options) {
	this.options = options;
	
	this.init = function ()
	{
		var me = this;
		$(function() {
			me.initConnection();
			me.initGraph();
		});
	};

	this.initConnection = function ()
	{
		var me = this;
		
		me.connection = new Strophe.Connection(me.options.service.url);
		
		var jid = me.options.service.username + '@' + me.options.service.domain;

		me.connection.connect(
			jid, 
			me.options.service.password, 
			function (status) { 
				me.statusHandler(status);
			});
	};
	
	this.initGraph = function()
	{
		var me = this;
		me.chart = new Highcharts.Chart({
		      chart: {
		         renderTo: 'chart',
		         plotBackgroundColor: null,
		         plotBorderWidth: null,
		         plotShadow: false,
		         height: 200
		      },
		      title: {
		         text: 'Example browser market shares at a specific website'
		      },
		      tooltip: {
		         formatter: function() {
		            return '<b>'+ this.point.name +'</b>: '+ (Math.round(this.percentage * 100)/100) +' %';
		         }
		      },
		      plotOptions: {
		         pie: {
		            allowPointSelect: true,
		            cursor: 'pointer',
		            dataLabels: {
		               enabled: true,
		               color: '#000000',
		               connectorColor: '#000000',
		               formatter: function() {
		                  return '<b>'+ this.point.name +'</b>: '+ (Math.round(this.percentage * 100)/100) +' %';
		               }
		            }
		         }
		      },
		       series: [{
		         type: 'pie',
		         name: 'Browser share',
		         data: me.options.chartData
		      }]
		   });
	};
	
	this.statusHandler = function (status)
	{
		var me = this;
	
		if (status == Strophe.Status.CONNECTED) {
			me.connection.send($pres().c('priority').t('1'));
			
			me.connection.addHandler(
				function(msg) {								//(Function) handler	The user callback.
					return me.handleHighChartData(msg); 
				}, 
				null, 										//(String) ns	The namespace to match.
				'message', 									//(String) name	The stanza name to match.
				'json'); 									//(String) type	The stanza type attribute to match.
		}
		
	};
	
	this.handleHighChartData = function (msg)
	{
		var me = this;
		
		var objMsg = $(msg);
		var body = objMsg.children('body').text();
		
		me.chart.series[0].setData(jQuery.parseJSON(body));
		return true;
	};
	
	
	this.init();
};