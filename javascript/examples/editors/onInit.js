// Program starts here. The document.onLoad executes the
		// createEditor function with a given configuration.
		// In the config file, the mxEditor.onInit method is
		// overridden to invoke this global function as the
		// last step in the editor constructor.
		function onInit(editor)
		{

editor.graph.addListener(mxEvent.CLICK, function(sender, evt)
  {
	  var source = evt.properties.cell.source;
	  var target = evt.properties.cell.target
	  if(evt.properties.cell.value.tagName == "Connector" && source.style != "rounded;strokeColor=#98E22E;fillColor=#98E22E;gradientColor=none;" && target.style != "rounded;strokeColor=#98E22E;fillColor=#98E22E;gradientColor=none;"){
		  			
				editor.graph.getModel().beginUpdate();
				try
				{			
					swal("Selecciona de qué tipo será este enlace: ", {
					  buttons: {
						cancel: "No visible",
						danger: {
						  text: "Texto no visible",
						  value: "No Texto",
						},
						confirm: {
							text: "Visible",
							value: "visible",
						},
					  },
					  icon: "info"
					})
					.then((value) => {
					  switch (value) {
					 
						case "visible":
						  editor.execute('fijar');
						  break;
					 
						case "No Texto":
						  editor.execute('fijarSinTexto');
						  break;
					 
						default:
						  editor.execute('ocultar');
						  
						  break;
					  }
					});
					editor.graph.refresh();
					
				}		

				finally
				{
					// Updates the display
					editor.graph.getModel().endUpdate();
				}	
	  }
  }
  );
editor.graph.connectionHandler.setCreateTarget(false);
		editor.graph.connectionHandler.addListener(mxEvent.CONNECT, function(sender, evt)
  {
    var edge = evt.getProperty('cell');

    var target = editor.graph.getModel().getTerminal(edge, false);
    if(target == null){
		swal("La conexión no es válida","","error");
		var arr = [];
		arr.push(edge);
		editor.graph.removeCells(arr,true);		
		
	}
  });  
  
  editor.graph.setAllowDanglingEdges(false);
mxConnectionHandler.prototype.connect = function(source, target, evt, dropTarget)
{
	if(target == null){
		console.log("no destino");
	}
	if (target != null ||  (this.isCreateTarget(evt) || this.graph.allowDanglingEdges))
	{
		// Uses the common parent of source and target or
		// the default parent to insert the edge
		var model = this.graph.getModel();
		var terminalInserted = false;
		var edge = null;
        var auxtarget = target;
		model.beginUpdate();
		try
		{
			if (source != null && target == null && !this.graph.isIgnoreTerminalEvent(evt) && this.isCreateTarget(evt))
			{
				target = this.createTargetVertex(evt, source);
				
				if (target != null)
				{
					dropTarget = this.graph.getDropTarget([target], evt, dropTarget);
					terminalInserted = true;
					
					// Disables edges as drop targets if the target cell was created
					// FIXME: Should not shift if vertex was aligned (same in Java)
					if (dropTarget == null || !this.graph.getModel().isEdge(dropTarget))
					{
						var pstate = this.graph.getView().getState(dropTarget);
						
						if (pstate != null)
						{
							var tmp = model.getGeometry(target);
							tmp.x -= pstate.origin.x;
							tmp.y -= pstate.origin.y;
						}
					}
					else
					{
						dropTarget = this.graph.getDefaultParent();
					}
						
					this.graph.addCell(target, dropTarget);
				}
			}

			var parent = this.graph.getDefaultParent();

			if (source != null && target != null &&
				model.getParent(source) == model.getParent(target) &&
				model.getParent(model.getParent(source)) != model.getRoot())
			{
				parent = model.getParent(source);

				if ((source.geometry != null && source.geometry.relative) &&
					(target.geometry != null && target.geometry.relative))
				{
					parent = model.getParent(parent);
				}
			}
			
			// Uses the value of the preview edge state for inserting
			// the new edge into the graph
			var value = null;
			var style = null;


			
			if (this.edgeState != null)
			{
				value = this.edgeState.cell.value;
				style = this.edgeState.cell.style;
			
			}
			
			edge = this.insertEdge(parent, null, value, source, target, style);
			
			if (edge != null)
			{
				// Updates the connection constraints
				this.graph.setConnectionConstraint(edge, source, true, this.sourceConstraint);
				this.graph.setConnectionConstraint(edge, target, false, this.constraintHandler.currentConstraint);
				
				// Uses geometry of the preview edge state
				if (this.edgeState != null)
				{
					model.setGeometry(edge, this.edgeState.cell.geometry);
				}
				
				var parent = model.getParent(source);
				
				// Inserts edge before source
				if (this.isInsertBefore(edge, source, target, evt, dropTarget))
				{
					var index = null;
					var tmp = source;

					while (tmp.parent != null && tmp.geometry != null &&
						tmp.geometry.relative && tmp.parent != edge.parent)
					{
						tmp = this.graph.model.getParent(tmp);
					}

					if (tmp != null && tmp.parent != null && tmp.parent == edge.parent)
					{
						model.add(parent, edge, tmp.parent.getIndex(tmp));
					}
				}
				
				// Makes sure the edge has a non-null, relative geometry
				var geo = model.getGeometry(edge);

				if (geo == null)
				{
					geo = new mxGeometry();
					geo.relative = true;
					
					model.setGeometry(edge, geo);
				}
				
				// Uses scaled waypoints in geometry
				if (this.waypoints != null && this.waypoints.length > 0)
				{
					var s = this.graph.view.scale;
					var tr = this.graph.view.translate;
					geo.points = [];
					
					for (var i = 0; i < this.waypoints.length; i++)
					{
						var pt = this.waypoints[i];
						geo.points.push(new mxPoint(pt.x / s - tr.x, pt.y / s - tr.y));
					}
				}

				if (target == null)
				{
					var t = this.graph.view.translate;
					var s = this.graph.view.scale;
					var pt = (this.originalPoint != null) ?
							new mxPoint(this.originalPoint.x / s - t.x, this.originalPoint.y / s - t.y) :
						new mxPoint(this.currentPoint.x / s - t.x, this.currentPoint.y / s - t.y);
					pt.x -= this.graph.panDx / this.graph.view.scale;
					pt.y -= this.graph.panDy / this.graph.view.scale;
					geo.setTerminalPoint(pt, false);
				}
				
				this.fireEvent(new mxEventObject(mxEvent.CONNECT, 'cell', edge, 'terminal', target,
					'event', evt, 'target', dropTarget, 'terminalInserted', terminalInserted));
			}
		}
		catch (e)
		{
			mxLog.show();
			mxLog.debug(e.message);
		}
		finally
		{
			model.endUpdate();
		}
		
		if (this.select)
		{
			this.selectCells(edge, (terminalInserted) ? target : null);
		}
	}
	    if(auxtarget == null){
		swal("La conexión no es válida","","error");
		var arr = [];
		arr.push(edge);
		arr.push(target);
		editor.graph.removeCells(arr,true);		
		
	}
	if(auxtarget != null){
	  if(edge.value.tagName == "Connector" && source.style != "rounded;strokeColor=#98E22E;fillColor=#98E22E;gradientColor=none;" && target.style != "rounded;strokeColor=#98E22E;fillColor=#98E22E;gradientColor=none;"){
		  			
				editor.graph.getModel().beginUpdate();
				try
				{			
					swal("Selecciona de qué tipo será este enlace: ", {
					  buttons: {
						cancel: "No visible",
						danger: {
						  text: "Texto no visible",
						  value: "No Texto",
						},
						confirm: {
							text: "Visible",
							value: "visible",
						},
					  },
					  icon: "info"
					})
					.then((value) => {
					  switch (value) {
					 
						case "visible":
						  editor.execute('fijar');
						  break;
					 
						case "No Texto":
						  editor.execute('fijarSinTexto');
						  break;
					 
						default:
						  editor.execute('ocultar');
						  
						  break;
					  }
					});
					editor.graph.refresh();
					
				}		

				finally
				{
					// Updates the display
					editor.graph.getModel().endUpdate();
				}	
	  }	
	}
};










		
			// Para poner checkbox en las celdas
			
			// Enables HTML labels
				editor.graph.setHtmlLabels(true);
				
				// Creates a user object that stores the state
				var doc = mxUtils.createXmlDocument();
				var obj = doc.createElement('UserObject');
				obj.setAttribute('label', 'Hello, World!');
				obj.setAttribute('checked', 'false');				
			
			// No se permiten autoreferencias
			editor.graph.allowLoops = false;
			
			// Para poner cuadrícula en el editor
		   editor.graph.container.style.backgroundImage = 'url(\'images/grid.gif\')';	

			// Enables rotation handle
			mxVertexHandler.prototype.rotationEnabled = true;

			// Enables guides
			mxGraphHandler.prototype.guidesEnabled = true;
			
		    // Alt disables guides
		    mxGuide.prototype.isEnabledForEvent = function(evt)
		    {
		    	return !mxEvent.isAltDown(evt);
		    };
			
			// Enables snapping waypoints to terminals
			mxEdgeHandler.prototype.snapToTerminals = true;
			
			// Defines an icon for creating new connections in the connection handler.
			// This will automatically disable the highlighting of the source vertex.
			mxConnectionHandler.prototype.connectImage = new mxImage('images/connector.gif', 16, 16);

/*mxConnectionHandler.prototype.createTargetVertex = function(evt, source)
{// Uses the first non-relative source
	
	var geo = this.graph.getCellGeometry(source);

	while (geo != null && geo.relative)
	{
		source = this.graph.getModel().getParent(source);
		geo = this.graph.getCellGeometry(source);
	}
	
	var clone = this.graph.cloneCell(source);
	clone.setAttribute('label', 'Nuevo concepto');
					editor.graph.getModel().beginUpdate();
				try
				{
					console.log("entra");
					swal("Selecciona de qué tipo será el concepto destino: ", {
					  buttons: {
						cancel: "No visible",
						danger: {
						  text: "Texto no visible",
						  value: "No Texto",
						},
						confirm: {
							text: "Visible",
							value: "visible",
						},
					  },
					  icon: "info"
					})
					.then((value) => {
					  switch (value) {
					 
						case "visible":
						  //editor.execute('fijar');
						  clone.style = "rounded;strokeColor=#68C6F9;fillColor=#68C6F9;gradientColor=none;";
						  break;
					 
						case "No Texto":
						clone.style = "rounded;strokeColor=#f5a631;fillColor=#f5a631;gradientColor=none;";
						 // editor.execute('fijarSinTexto');
						  break;
					 
						default:
						clone.style = "rounded;strokeColor=#98E22E;fillColor=#98E22E;gradientColor=none;";
						 // editor.execute('ocultar');
						  
						  break;
					  }
					 
					});	
					 
					console.log("sale");
				}finally{
					editor.graph.getModel().endUpdate();
				}

	//clone.style = "rounded;strokeColor=#98E22E;fillColor=#98E22E;gradientColor=none;";
     
	
	var geo = this.graph.getModel().getGeometry(clone);
	if (geo != null)
	{
		var t = this.graph.view.translate;
		var s = this.graph.view.scale;
		var point = new mxPoint(this.currentPoint.x / s - t.x, this.currentPoint.y / s - t.y);
		geo.x = Math.round(point.x - geo.width / 2 - this.graph.panDx / s);
		geo.y = Math.round(point.y - geo.height / 2 - this.graph.panDy / s);

		// Aligns with source if within certain tolerance
		var tol = this.getAlignmentTolerance();
		
		if (tol > 0)
		{
			var sourceState = this.graph.view.getState(source);
			
			if (sourceState != null)
			{
				var x = sourceState.x / s - t.x;
				var y = sourceState.y / s - t.y;
				
				if (Math.abs(x - geo.x) <= tol)
				{
					geo.x = Math.round(x);
				}
				
				if (Math.abs(y - geo.y) <= tol)
				{
					geo.y = Math.round(y);
				}
			}
		}
	}

	return clone;		
};*/

			
			// Enables connections in the graph and disables
			// reset of zoom and translate on root change
			// (ie. switch between XML and graphical mode).
			editor.graph.setConnectable(true);

			// Clones the source if new connection has no target
			editor.graph.connectionHandler.setCreateTarget(true);
			
	

			// Updates the title if the root changes
			var title = document.getElementById('title');
			
			if (title != null)
			{
				var f = function(sender)
				{
					title.innerHTML = 'Diseño Mapa Conceptual';
				};
				
				editor.addListener(mxEvent.ROOT, f);
				f(editor);
			}
			
		    // Changes the zoom on mouseWheel events
		    mxEvent.addMouseWheelListener(function (evt, up)
		    {
			    if (!mxEvent.isConsumed(evt))
			    {
			    	if (up)
					{
			    		editor.execute('zoomIn');
						
					}
					else
					{
						editor.execute('zoomOut');
					}
					
					mxEvent.consume(evt);
			    }
		    });

			// Defines a new action to switch between
			// XML and graphical display
			var textNode = document.getElementById('xml');
			var graphNode = editor.graph.container;
			var sourceInput = document.getElementById('source');
			sourceInput.checked = false;

			var funct = function(editor)
			{
				//if (sourceInput.checked)
				//{
					//graphNode.style.display = 'none';
					//textNode.style.display = 'inline';
					
					var enc = new mxCodec();
					
					var t = document.getElementById("titulo").value;
					if(t==""){
						t = document.getElementById("titulo").placeholder;	
					}
					editor.graph.getModel().cells[5].value.attributes.text.value = t;

					var c = document.getElementById("textoComprensionText").value;
					
					if(c==""){
						c = document.getElementById("textoComprensionText").placeholder;	
					}
					
					editor.graph.getModel().cells[7].value.attributes.text.value = c;

					if(restringido){
						editor.graph.getModel().cells[9].value.attributes.text.value = true;
						
					}else{
						editor.graph.getModel().cells[9].value.attributes.text.value = false;
					}
					
					// Contador de conceptos en caso de limitar al alumno
				var cont = 0;
				var cells = editor.graph.getModel().cells;
				for (var c in editor.graph.getModel().cells){
					    if(cells[c].value.tagName == "Roundrect"){
							cont++;		
						}
				}
				
				editor.graph.getModel().cells[9].value.attributes.cont.value = cont;
				
				
					if(mostrado){
						editor.graph.getModel().cells[11].value.attributes.text.value = true;
					
					}else{
						editor.graph.getModel().cells[11].value.attributes.text.value = false;
					}
					if(mostradoEnlaces){
						editor.graph.getModel().cells[13].value.attributes.text.value = true;
					
					}else{
						editor.graph.getModel().cells[13].value.attributes.text.value = false;
					}					
					var node = enc.encode(editor.graph.getModel());
					
					textNode.value = mxUtils.getPrettyXml(node);
					textNode.originalValue = textNode.value;
					textNode.focus();
					
			};
			
			editor.addAction('switchView', funct);
			
			// Defines a new action to switch between
			// XML and graphical display
			mxEvent.addListener(sourceInput, 'click', function()
			{
				editor.execute('switchView');
			});
			
		
	var vistaAlumno=document.getElementById('vistaAlumno');

		vistaAlumno.checked=false;

			
			
			// Defines a new action to switch between
			// XML and graphical display
			mxEvent.addListener(vistaAlumno, 'click', function()
			{
				if(vistaAlumno.checked){
				editor.execute('zoomIn');
				var modelo=editor.graph.getModel();				
				
				var cont=0;
				var cells=modelo.cells;
				var temp=cells[0];
				while(temp!=undefined){
					if(temp.style!=undefined){
						if(String(temp.style).includes("#98E22E")){						
								temp.setVisible(true);						
						}
					}

					cont++;
					temp=cells[cont];
				}
				
				}else{
					editor.execute('zoomOut');
				var modelo=editor.graph.getModel();				
				
				var cont=0;
				var cells=modelo.cells;
				var temp=cells[0];
				while(temp!=undefined){
					if(temp.style!=undefined){
						if(String(temp.style).includes("#98E22E")){
							temp.setVisible(false);
						}
					}

					cont++;
					temp=cells[cont];
				}					
				}
			});


			function ocultar(id){
				document.getElementById(id).style.display = 'none';
			}
			
			// Create select actions in page
			var node = document.getElementById('mainActions');
			var buttons = ['cut', 'copy', 'paste', 'delete', 'undo', 'redo', 'show','help'];
		   // var buttons = ['Cortar', 'Copiar', 'Pegar', 'Borrar', 'Deshacer', 'Rehacer', 'Imprimir', 'Mostrar'];
			
			// Only adds image and SVG export if backend is available
			// NOTE: The old image export in mxEditor is not used, the urlImage is used for the new export.
			if (editor.urlImage != null)
			{
				// Client-side code for image export
				var exportImage = function(editor)
				{
					var graph = editor.graph;
					var scale = graph.view.scale;
					var bounds = graph.getGraphBounds();
					
		        	// New image export
					var xmlDoc = mxUtils.createXmlDocument();
					var root = xmlDoc.createElement('output');
					xmlDoc.appendChild(root);
					
				    // Renders graph. Offset will be multiplied with state's scale when painting state.
					var xmlCanvas = new mxXmlCanvas2D(root);
					xmlCanvas.translate(Math.floor(1 / scale - bounds.x), Math.floor(1 / scale - bounds.y));
					xmlCanvas.scale(scale);
					
					var imgExport = new mxImageExport();
				    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);
				    
					// Puts request data together
					var w = Math.ceil(bounds.width * scale + 2);
					var h = Math.ceil(bounds.height * scale + 2);
					var xml = mxUtils.getXml(root);
					
					// Requests image if request is valid
					if (w > 0 && h > 0)
					{
						var name = 'export.png';
						var format = 'png';
						var bg = '&bg=#FFFFFF';
						
						new mxXmlRequest(editor.urlImage, 'filename=' + name + '&format=' + format +
		        			bg + '&w=' + w + '&h=' + h + '&xml=' + encodeURIComponent(xml)).
		        			simulate(document, '_blank');
					}
				};
				
				editor.addAction('exportImage', exportImage);
				
				// Client-side code for SVG export
				var exportSvg = function(editor)
				{
					var graph = editor.graph;
					var scale = graph.view.scale;
					var bounds = graph.getGraphBounds();

				    // Prepares SVG document that holds the output
				    var svgDoc = mxUtils.createXmlDocument();
				    var root = (svgDoc.createElementNS != null) ?
				    	svgDoc.createElementNS(mxConstants.NS_SVG, 'svg') : svgDoc.createElement('svg');
				    
					if (root.style != null)
					{
						root.style.backgroundColor = '#FFFFFF';
					}
					else
					{
						root.setAttribute('style', 'background-color:#FFFFFF');
					}
				    
				    if (svgDoc.createElementNS == null)
				    {
				    	root.setAttribute('xmlns', mxConstants.NS_SVG);
				    }
				    
				    root.setAttribute('width', Math.ceil(bounds.width * scale + 2) + 'px');
				    root.setAttribute('height', Math.ceil(bounds.height * scale + 2) + 'px');
				    root.setAttribute('xmlns:xlink', mxConstants.NS_XLINK);
				    root.setAttribute('version', '1.1');
				    
				    // Adds group for anti-aliasing via transform
				    var group = (svgDoc.createElementNS != null) ?
					    	svgDoc.createElementNS(mxConstants.NS_SVG, 'g') : svgDoc.createElement('g');
					group.setAttribute('transform', 'translate(0.5,0.5)');
					root.appendChild(group);
				    svgDoc.appendChild(root);

				    // Renders graph. Offset will be multiplied with state's scale when painting state.
				    var svgCanvas = new mxSvgCanvas2D(group);
				    svgCanvas.translate(Math.floor(1 / scale - bounds.x), Math.floor(1 / scale - bounds.y));
				    svgCanvas.scale(scale);
				    
				    var imgExport = new mxImageExport();
				    imgExport.drawState(graph.getView().getState(graph.model.root), svgCanvas);

					var name = 'export.svg';
				    var xml = encodeURIComponent(mxUtils.getXml(root));
					
					new mxXmlRequest(editor.urlEcho, 'filename=' + name + '&format=svg' + '&xml=' + xml).simulate(document, "_blank");
				};
				
				editor.addAction('exportSvg', exportSvg);
				
				buttons.push('exportImage');
				buttons.push('exportSvg');
			};
				var imgs = ['images/cut.jpg', 'images/copy.jpg', 'images/paste.jpg','images/delete.jpg', 'images/undo.jpg', 'images/redo.jpg','images/image.jpg','images/help.jpg'];
				var nombres = ['Cortar','Copiar','Pegar','Borrar','Deshacer','Rehacer','Ver en otra pestaña','Ayuda'];			
			for (var i = 0; i < buttons.length; i++)
			{
				var button = document.createElement('button');
				var img = document.createElement('img');
				img.setAttribute("src", imgs[i]);
				img.setAttribute('title', nombres[i]);
				node.appendChild(img);				
				mxUtils.write(button, mxResources.get(buttons[i]));
			
				var factory = function(name)
				{
					return function()
					{
						editor.execute(name);
					};
				};
				mxEvent.addListener(img, 'click', factory(buttons[i]));			
				mxEvent.addListener(button, 'click', factory(buttons[i]));
				//node.appendChild(button);
				var espacio = document.createTextNode("\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0");
				node.appendChild(espacio);				
			}
			

			
			var div = document.createElement('div');
			div.setAttribute("id",'checkboxs');
			div.setAttribute("style","left;height:20px;width:100%");
			node.appendChild(div);
			node = document.getElementById('checkboxs');
			var checkbox = document.createElement('input');
			checkbox.setAttribute("type","checkbox");
			checkbox.setAttribute("id","restringir");
			checkbox.setAttribute("value","Restringir dimensión mapa conceptual a la solución");
			
			node.appendChild(checkbox);
			
			
			var newtext = document.createTextNode("Limitar dimensión mapa conceptual a la solución");
			node.appendChild(newtext);
			//node.appendChild(document.createElement("&nbsp;"));
			var espacio = document.createTextNode("\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0");
			node.appendChild(espacio);

		
	     //4/05 Checkbox para restringir

			var restringir = document.getElementById('restringir');
			restringir.checked = false;
            var restringido = false;
			
			var rest = function(editor)
			{


						if (restringir.checked)
						{	
							  restringido = true;		
						}
						else
						{					
							  restringido = false;
						}
					
					
			};
			
			editor.addAction('restringir', rest);
			

			mxEvent.addListener(restringir, 'click', function()
			{
				editor.execute('restringir');
			});
			
			
			
			
			
			var checkbox = document.createElement('input');
			checkbox.setAttribute("type","checkbox");
			checkbox.setAttribute("id","mostrarListaConceptos");	
			checkbox.setAttribute("value","Mostrar Lista Conceptos al alumno");
			
			node.appendChild(checkbox);
			var newtext = document.createTextNode("Mostrar Lista Conceptos al alumno");
			node.appendChild(newtext);

			
	     //4/05 Checkbox para mostrarListaConceptos

			var mostrarListaConceptos = document.getElementById('mostrarListaConceptos');
			var mostrado = false;
			mostrarListaConceptos.checked = false;

			var mLista = function(editor)
			{
				if (mostrarListaConceptos.checked)
				{
					mostrado = true;								
				}
				else
				{
					mostrado = false;					
				}
			};
			
			editor.addAction('mLista', mLista);
			

			mxEvent.addListener(mostrarListaConceptos, 'click', function()
			{
				editor.execute('mLista');
			});
	
			
			// 18/05 Mostrar lista enlaces
			var espacio = document.createTextNode("\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0");
			node.appendChild(espacio);
			
			var checkbox = document.createElement('input');
			checkbox.setAttribute("type","checkbox");
			checkbox.setAttribute("id","mostrarListaEnlaces");
			//checkbox.setAttribute("style","padding-left:50px;");			
			checkbox.setAttribute("value","Mostrar Lista Enlaces al alumno");
			
			node.appendChild(checkbox);
			var newtext = document.createTextNode("Mostrar Lista Enlaces al alumno");
			node.appendChild(newtext);			

			var mostrarListaEnlaces = document.getElementById('mostrarListaEnlaces');
			var mostradoEnlaces = false;
			mostrarListaEnlaces.checked = false;

			var mListaEnlaces = function(editor)
			{
				if (mostrarListaEnlaces.checked)
				{
					mostradoEnlaces = true;								
				}
				else
				{
					mostradoEnlaces = false;					
				}
			};
			
			editor.addAction('mListaEnlaces', mListaEnlaces);
			

			mxEvent.addListener(mostrarListaEnlaces, 'click', function()
			{
				editor.execute('mListaEnlaces');
			});			




			
			// Create select actions in page
			var node = document.getElementById('selectActions');
			mxUtils.write(node, 'Seleccionar: ');
			mxUtils.linkAction(node, 'Todo', editor, 'selectAll');
			mxUtils.write(node, ', ');
			mxUtils.linkAction(node, 'Nada', editor, 'selectNone');
			mxUtils.write(node, ', ');
			mxUtils.linkAction(node, 'Conceptos', editor, 'selectVertices');
			mxUtils.write(node, ', ');
			mxUtils.linkAction(node, 'Enlaces', editor, 'selectEdges');

			// Create select actions in page
			var node = document.getElementById('zoomActions');
			mxUtils.write(node, 'Zoom: ');
			mxUtils.linkAction(node, 'Acercarse', editor, 'zoomIn');
			mxUtils.write(node, ', ');
			mxUtils.linkAction(node, 'Alejarse', editor, 'zoomOut');
			mxUtils.write(node, ', ');
			mxUtils.linkAction(node, 'Actual', editor, 'actualSize');
			mxUtils.write(node, ', ');
			mxUtils.linkAction(node, 'Ajustar', editor, 'fit');
		}

		window.onbeforeunload = function() { return mxResources.get('changesLost'); };