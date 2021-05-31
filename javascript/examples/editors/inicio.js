function inicio(){
createEditor('config/diagrameditor_alumno.xml');
//ocultar("textoComprension");
}

		// Program starts here. Creates a sample graph in the
		// DOM node with the specified ID. This function is invoked
		// from the onLoad event handler of the document (see below).
		function main(container)
		{
			if (mxClient.isBrowserSupported())
			{
				var divs = document.getElementsByTagName('*');
				
				for (var i = 0; i < divs.length; i++)
				{
					if (divs[i].className.toString().indexOf('mxgraph') >= 0)
					{
						(function(container)
						{
							var xml = mxUtils.getTextContent(container);
							var xmlDocument = mxUtils.parseXml(xml);
							
							if (xmlDocument.documentElement != null && xmlDocument.documentElement.nodeName == 'mxGraphModel')
							{
								var decoder = new mxCodec(xmlDocument);
								var node = xmlDocument.documentElement;
		
								container.innerHTML = '';
		                        
								var graph = new mxGraph(container);
								graph.centerZoom = false;
								graph.setTooltips(true);
								graph.setEnabled(false);
								
								// Changes the default style for edges "in-place"
								var style = graph.getStylesheet().getDefaultEdgeStyle();
								style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
								
								// Enables panning with left mouse button
								graph.panningHandler.useLeftButtonForPanning = true;
								graph.panningHandler.ignoreCell = true;
								graph.container.style.cursor = 'move';
								graph.setPanning(true);
								
								if (divs[i].style.width == '' && divs[i].style.height == '')
								{
									graph.resizeContainer = true;
								}
								else
								{
									// Adds border for fixed size boxes
									graph.border = 20;
								}
								
								decoder.decode(node, graph.getModel());

							}
						})(divs[i]);
					}
				}
			}
		};
		function main2(){
			var graph = document.getElementById('graph');
			console.log(graph);
			            var textNode = graph.innerHTML;
						console.log(textNode);
						var doc = mxUtils.parseXml(textNode);
						var dec = new mxCodec(doc);
						dec.decode(doc.documentElement, graph.getModel());
		}