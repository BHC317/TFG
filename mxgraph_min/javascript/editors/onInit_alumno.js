// Program starts here. The document.onLoad executes the
		// createEditor function with a given configuration.
		// In the config file, the mxEditor.onInit method is
		// overridden to invoke this global function as the
		// last step in the editor constructor.
		function onInit(editor)
		{
mxGraph.prototype.validationAlert = function(message)
{
	//mxUtils.alert(message);
};
			
mxGraph.prototype.getEdgeValidationError = function(edge, source, target)
{
	if (edge != null && !this.isAllowDanglingEdges() && (source == null || target == null))
	{
		return '';
	}
	
	if (edge != null && this.model.getTerminal(edge, true) == null &&
		this.model.getTerminal(edge, false) == null)	
	{
		return null;
	}
	
	// Checks if we're dealing with a loop
	if (!this.allowLoops && source == target && source != null)
	{
		return '';
	}
	
	// Checks if the connection is generally allowed
	if (!this.isValidConnection(source, target))
	{
		return '';
	}

	if (source != null && target != null)
	{
		var error = '';

		// Checks if the cells are already connected
		// and adds an error message if required			
		if (!this.multigraph)
		{
			var tmp = this.model.getEdgesBetween(source, target, true);
			
			// Checks if the source and target are not connected by another edge
			if (tmp.length > 1 || (tmp.length == 1 && tmp[0] != edge))
			{
				error += " ";
		        swal("Los conceptos ya están conectados","","error");
			}
		}

		// Gets the number of outgoing edges from the source
		// and the number of incoming edges from the target
		// without counting the edge being currently changed.
		var sourceOut = this.model.getDirectedEdgeCount(source, true, edge);
		var targetIn = this.model.getDirectedEdgeCount(target, false, edge);

		// Checks the change against each multiplicity rule
		if (this.multiplicities != null)
		{
			for (var i = 0; i < this.multiplicities.length; i++)
			{
				var err = this.multiplicities[i].check(this, edge, source,
					target, sourceOut, targetIn);
				
				if (err != null)
				{
					error += err;
				}
			}
		}

		// Validates the source and target terminals independently
		var err = this.validateEdge(edge, source, target);
		
		if (err != null)
		{
			error += err;
		}
		
		return (error.length > 0) ? error : null;
	}
	
	return (this.allowDanglingEdges) ? null : '';
};			
	
			mxGraph.prototype.validationAlert = function(message)
{
	//swal(message,"","error");
};
			
			// Clones the source if new connection has no target
			editor.graph.connectionHandler.setCreateTarget(false);
			
			
			// 29/04
			
					// Parses the mxGraph XML file format
					var layout = new mxFastOrganicLayout(editor.graph);
		function read(graph, filename)
		{
			var req = mxUtils.load(filename);
			var codigo = req.request.response;
			console.log(codigo);
			var doc = mxUtils.parseXml(codigo);
			var codec = new mxCodec(doc);
			var t = codec.getObject("5");
			codec.decode(doc.documentElement, editor.graph.getModel());	
			
		};
				// Load cells and layouts the graph
				editor.graph.getModel().beginUpdate();
				try
				{			
					 //Loads the mxGraph file format (XML file)
					read(editor.graph, 'Ser vivo.xml');	
					editor.graph.refresh();
					
				}
				finally
				{
					// Updates the display
					editor.graph.getModel().endUpdate();
				}


				// Enables HTML labels
				editor.graph.setHtmlLabels(true);

							
            var cells = editor.graph.getModel().cells;
            var arrayCeldasBorrar = [];
			
			var textosAMostrarVerde = [];
			var textosAMostrarNaranja = [];	

			var textosConceptos = [];
			var textosEnlaces = [];
			
	
			var mostrado = editor.graph.getModel().cells[11].value.attributes.text.value;	
			var mostradoEnlaces = editor.graph.getModel().cells[13].value.attributes.text.value;		
			
            if(mostrado == "true" || mostradoEnlaces == "true"){

				editor.popupHandler = null;
			}

				
				// Enables HTML labels
				editor.graph.setHtmlLabels(true);
			var graph = editor.graph;
				// Adds optional caching for the HTML label
				var cached = true;
				mxCodecRegistry.getCodec(mxCell).exclude.push('div');
								
				// Overrides method to provide a cell label in the display
				if(mostrado=="true" || mostradoEnlaces =="true"){
				graph.convertValueToString = function(cell)
				{
					
					if (cached && cell.div != null)
					{
						// Uses cached label
						return cell.div;
					}
					else if (mxUtils.isNode(cell.value) && (cell.value.nodeName == 'Roundrect' || cell.value.nodeName == 'Connector'))
					{
						if(mostrado == "true" && cell.value.nodeName == 'Roundrect'){
						// Returns a DOM for the label
						var div = document.createElement('div');
						mxUtils.br(div);
						var selectt = document.createElement('select');					
						selectt.setAttribute('id', 'desplegable'+cell.id);
						div.appendChild(selectt);
																					
						if (cached)
						{
							// Caches label
							cell.div = div;
						}
						
						return div;
						}else if(mostradoEnlaces == "true" && cell.value.nodeName == 'Connector'){
						// Returns a DOM for the label
						var div = document.createElement('div');
						mxUtils.br(div);
						var selectt = document.createElement('select');					
						selectt.setAttribute('id', 'desplegable'+cell.id);
						div.appendChild(selectt);
																					
						if (cached)
						{
							// Caches label
							cell.div = div;
						}
						
						return div;							
						}
					}
					
					return cell.value.getAttribute('label');
				};	
				}
				if(mostrado == "false"){
						graph.getModel().valueForCellChanged = function(cell, value)
						{
						  var previous = cell.value.getAttribute('label');
						  cell.value.setAttribute('label', value);

						  return previous;
						};				
					
				}
				if(mostradoEnlaces == "false"){
						graph.getModel().valueForCellChanged = function(cell, value)
						{
						  var previous = cell.value.getAttribute('label');
						  cell.value.setAttribute('label', value);

						  return previous;
						};				
					
				}					
				
			
			for (var c in editor.graph.getModel().cells){				
				//Aquí se filtran las celdas naranjas
				if(cells[c].style=="rounded;strokeColor=#f5a631;fillColor=#f5a631;gradientColor=none;"){	

					var texto = cells[c].value.attributes.label.value;		
					cells[c].style = 'rounded;';
 
					// Se filtra por concepto y enlaces para mostrar las ayudas					
					if(cells[c].value.tagName == "Roundrect"){						
                        textosConceptos.push(texto);						
					}else if(cells[c].value.tagName == "Connector"){
                        textosEnlaces.push(texto);						
					}				
					//textosAMostrarNaranja.push(texto);					
					cells[c].setAttribute('label','????');
					editor.graph.refresh();						
					// Se filtran las celdas verdes (ocultas)
				}else if (cells[c].style=="rounded;strokeColor=#98E22E;fillColor=#98E22E;gradientColor=none;"){
					var texto = cells[c].value.attributes.label.value;		
					if(cells[c].value.tagName == "Roundrect"){						
                        textosConceptos.push(texto);						
					}else if(cells[c].value.tagName == "Connector"){
                        textosEnlaces.push(texto);						
					}					
					
					//textosAMostrarVerde.push(texto);
					arrayCeldasBorrar.push(cells[c]);

					// Celdas azules (fijar)
				}else if(cells[c].style=="rounded;strokeColor=#68C6F9;fillColor=#68C6F9;gradientColor=none;"){
                    if(mostrado == "true" || mostradoEnlaces == "true"){
						if(mostrado == "true" && cells[c].value.tagName == "Roundrect"){
							
							if(cells[c].div != null){
							cells[c].div.innerHTML = cells[c].getAttribute('label');
							}else{
								var div = document.createElement('div');
								mxUtils.br(div);
								cells[c].div = div;
								cells[c].div.innerHTML = cells[c].getAttribute('label');
								
							}
							
						}else if(mostradoEnlaces == "true" && cells[c].value.tagName == "Connector"){
							cells[c].div.innerHTML = cells[c].getAttribute('label');
						}
					}
					cells[c].style = 'rounded;deletable=0;editable=0;';
					editor.graph.refresh();

				}	
			}

						//Create and append the options
						for (var c in editor.graph.getModel().cells){
							if(mostrado=="true"){
							for (var i = 0; i < (textosConceptos.length); i++) {
								var option = document.createElement("option");
								if(cells[c].value.tagName == "Roundrect"){
									//var option = document.createElement("option");
									option.value =textosConceptos[i];
									option.text = textosConceptos[i];
									
									var div = cells[c].div;
									if(div != null){
										 
										if(div.lastElementChild != null){	

											div.lastElementChild.appendChild(option);
										}
									}
								}

							}
							}else{
								if(cells[c].div != null && cells[c].value.tagName == "Roundrect"){
								cells[c].div.innerHTML = cells[c].getAttribute('label');
								}
							}

							if(mostradoEnlaces=="true"){
							for (var i = 0; i < (textosEnlaces.length); i++) {
								var option = document.createElement("option");
								if(cells[c].value.tagName == "Connector"){
									//var option = document.createElement("option");
									option.value =textosEnlaces[i];
									option.text = textosEnlaces[i];
									var div = cells[c].div;
									if(div != null){										
										if(div.lastElementChild != null){										
											div.lastElementChild.appendChild(option);
										}
								}								
								}

							}
							}else{
								if(cells[c].div != null && cells[c].value.tagName == "Connector"){
								//cells[c].div.innerHTML = cells[c].getAttribute('label');
								}
							}
							
						}
						

			// Controlar al añadir una celda que se muestre la lista con las opciones
			mxGraph.prototype.addCell = function(cell, parent, index, source, target)
			{
				
				if(mostrado == "true" && cell.value.tagName == "Roundrect"){
					
						var div = document.createElement('div');
						mxUtils.br(div);
						var selectt = document.createElement('select');
						selectt.setAttribute('id', 'desplegable'+cell.id);
						div.appendChild(selectt);
						cell.div = div;
							for (var i = 0; i < (textosConceptos.length); i++) {
								if(cell.value.tagName == "Roundrect"){
									var option = document.createElement("option");
									option.value =textosConceptos[i];
									option.text = textosConceptos[i];
									var div = cell.div;
									if(div != null){									 
										if(div.lastElementChild != null){	
											div.lastElementChild.appendChild(option);
										}
									}
								}
							}	
				}
				if(mostradoEnlaces == "true" && cell.value.tagName == "Connector"){
					var div = document.createElement('div');
					mxUtils.br(div);
					var selectt = document.createElement('select');
					selectt.setAttribute('id', 'desplegable'+cell.id);
					div.appendChild(selectt);
					cell.div = div;
							for (var i = 0; i < (textosEnlaces.length); i++){
								if (cell.value.tagName == "Connector"){
									var option = document.createElement("option");
									option.value =textosEnlaces[i];
									option.text = textosEnlaces[i];		
									var div = cell.div;
									if(div != null){									 
										if(div.lastElementChild != null){	
											div.lastElementChild.appendChild(option);
										}
									}									
								}
							}
				}
				return this.addCells([cell], parent, index, source, target)[0];
			};								
						
						
						
			var lista = document.getElementById('lista');
			
			lista.text = textosAMostrarNaranja.concat(textosAMostrarVerde);
			
			// Se eliminan del modelo las celdas Verdes			
            editor.graph.removeCells(arrayCeldasBorrar,true);


			
            var filtrados = editor.graph.getModel().filterCells(cells,function (cell)
		    {
			    return cell.value.tagName=="Connector";
		    });
           	
			
	         // Obtener Titulo y Texto			
			 var t = editor.graph.getModel().cells[5].value.attributes.text.value;
			 var c = editor.graph.getModel().cells[7].value.attributes.text.value;
			
		    document.getElementById("titulo").value = t;	
			document.getElementById("textoComprensionText").value = c;
			
			
			// Obtener restringido y limite nodos solución
			
			var restringido = editor.graph.getModel().cells[9].value.attributes.text.value;
           
			var limiteNodos = editor.graph.getModel().cells[9].value.attributes.cont.value;
			
			
			
			
			
			
			// Restringir creacion de nodos mediante menu lateral
mxDefaultToolbar.prototype.insert = function(vertex, evt, target)
{
	var graph = this.editor.graph;
	
	if (graph.canImportCell(vertex))
	{
		var x = mxEvent.getClientX(evt);
		var y = mxEvent.getClientY(evt);
		var pt = mxUtils.convertPoint(graph.container, x, y);
		
		// Splits the target edge or inserts into target group
		if (graph.isSplitEnabled() &&
			graph.isSplitTarget(target, [vertex], evt))
		{
			return graph.splitEdge(target, [vertex], null, pt.x, pt.y);
		}
		else
		{
			    var contNodosAct = 0;
				var cells = editor.graph.getModel().cells;
				for (var c in editor.graph.getModel().cells){
					    if(cells[c].value.tagName == "Roundrect"){
							contNodosAct++;		
						}
				}
		
			if(restringido=="true" && contNodosAct >= limiteNodos){
				swal("No está permitido crear más conceptos","","error");
				
				return null;
			}else if(restringido=="false" || contNodosAct <= limiteNodos){				
			return this.editor.addVertex(target, vertex, pt.x, pt.y);
			}
		}
	}
	
	return null;
};	
	// Restringir creacion de nodos mediante pegar
	editor.addAction('paste', function(editor)
	{
		if (editor.graph.isEnabled())
		{
			    var contNodosAct = 0;
				var cells = editor.graph.getModel().cells;
				for (var c in editor.graph.getModel().cells){
					    if(cells[c].value.tagName == "Roundrect"){
							contNodosAct++;		
						}
				}
			
			if(restringido=="true" && contNodosAct >= limiteNodos){
				swal("No está permitido crear más conceptos","","error");
			}else{			
			mxClipboard.paste(editor.graph);
			}
		}
	});	

  // Restringir creacion de nodos mediante conexiones

			    var contNodosAct = 0;
				var cells = editor.graph.getModel().cells;
				for (var c in editor.graph.getModel().cells){
					    if(cells[c].value.tagName == "Roundrect"){
							contNodosAct++;		
						}
				}	
	if((restringido=="true" || contNodosAct >= limiteNodos) || mostrado == "true"){
		
		if(mostrado == "true"){
			editor.graph.connectionHandler.setCreateTarget(false);
		}else{
			editor.graph.connectionHandler.setCreateTarget(true);
		}
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

				
	}


				// Obtener mostrado Conceptos (mostrar lista de Conceptos al alumno)
			
			var mostrado = editor.graph.getModel().cells[11].value.attributes.text.value;
			document.getElementById('mostrado').value = mostrado;
           

			// Lista nodos 6/05
			/*var lista = document.getElementById("lista");			
			if(mostrado=="true"){
				lista.style="display:inline;font-size:11px;center";
			}
			

			lista.appendChild(document.createElement("br"));
			lista.appendChild(document.createElement("br"));
			
			for(texto of textosConceptos){
				
			mxUtils.write(lista, '-  ');
			mxUtils.write(lista,texto);	
			lista.appendChild(document.createElement("br"));			
			}*/
		

				// Obtener mostrado Enlaces (mostrar lista de Enlaces al alumno)
			
			/*var mostradoEnlaces = editor.graph.getModel().cells[13].value.attributes.text.value;
			document.getElementById('mostradoEnlaces').value = mostradoEnlaces;				
			lista.appendChild(document.createElement("br"));	
			
			// Lista enlaces 18/05
			var listaEnlaces = document.getElementById("listaEnlaces");			
			if(mostradoEnlaces=="true"){
				listaEnlaces.style="display:inline;font-size:11px;center";
			}
			listaEnlaces.appendChild(document.createElement("br"));	
			for(texto of textosEnlaces){
				
			mxUtils.write(listaEnlaces, '-  ');
			mxUtils.write(listaEnlaces,texto);	
			listaEnlaces.appendChild(document.createElement("br"));			
			}		*/	

			
            // Cambiar color fondo			
           var body = document.getElementById("body");			   
		   //body.style.background = "#675678";
		   var page = document.getElementById("page");
		  // page.style.background = "#ffffff";
		   var header = document.getElementById("header");
		   //header.style.background = "#ffffff";
		   
		   // Para poner cuadrícula en el editor
		   editor.graph.container.style.backgroundImage = 'url(\'images/grid.gif\')';	

		// No se permiten autoreferencias
			editor.graph.allowLoops = false;		   
			
			
							
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
				
			// Crear nodos con estilo por defecto 4/05
			if(mostrado != "true"){
			mxConnectionHandler.prototype.createTargetVertex = function(evt, source)
{// Uses the first non-relative source
	
	var geo = this.graph.getCellGeometry(source);

	while (geo != null && geo.relative)
	{
		source = this.graph.getModel().getParent(source);
		geo = this.graph.getCellGeometry(source);
	}
	var clone = this.graph.cloneCell(source);
	clone.setAttribute('label', 'Nuevo concepto');
	clone.style = "rounded";
	
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
};
			}


// 13/05 Historial comandos

editor.undoManager.clear();


			
			// Enables connections in the graph and disables
			// reset of zoom and translate on root change
			// (ie. switch between XML and graphical mode).
			editor.graph.setConnectable(true);

			
	

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
				if (sourceInput.checked)
				{
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

					
					var node = enc.encode(editor.graph.getModel());
					
					textNode.value = mxUtils.getPrettyXml(node);
					textNode.originalValue = textNode.value;
					textNode.focus();
				}
				else
				{
					graphNode.style.display = '';
					
						var doc = mxUtils.parseXml(textNode.value);
						var dec = new mxCodec(doc);
						dec.decode(doc.documentElement, editor.graph.getModel());

					textNode.originalValue = null;
					
					// Makes sure nothing is selected in IE
					if (mxClient.IS_IE)
					{
						mxUtils.clearSelection();
					}

					textNode.style.display = 'none';

					// Moves the focus back to the graph
					editor.graph.container.focus();
				}
			};
			
			editor.addAction('switchView', funct);
			
			// Defines a new action to switch between
			// XML and graphical display
			mxEvent.addListener(sourceInput, 'click', function()
			{

				var cells = editor.graph.getModel().cells;

				for(var c in editor.graph.getModel().cells){
					
					if(cells[c].value.tagName == "Roundrect" || cells[c].value.tagName == "Connector"){	
						var id = "desplegable"+cells[c].id;
						if(cells[c].div != null && cells[c].div.lastElementChild !=null){
						    // Cambiar de desplegablenull a desplegable+"id"
							cells[c].div.lastElementChild.id = id;						
						}
						if(document.getElementById(id) != null){
                       var des = document.getElementById(id).value;
					   cells[c].setAttribute('label',des);
						
						}
					}				
									
					//document.getElementById("deplegable"+cells[c].
				}
				editor.execute('switchView');
				
			});
			
		
	var vistaAlumno=document.getElementById('vistaAlumno');

	/*var f=function(editor){
			if(vistaAlumno.checked){
				editor.execute('selectAll');
		
	}
	
	}*/
		vistaAlumno.checked=false;

			//editor.addAction('vista', f);
			
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
						;
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
			if(mostrado == "true" || mostradoEnlaces == "true"){
				var buttons = ['delete', 'undo', 'redo','show','help'];
			}else{
				var buttons = ['cut', 'copy', 'paste', 'delete', 'undo', 'redo', 'show','help'];
			}
			
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
			if(mostrado == "true" || mostradoEnlaces == "true"){
				var imgs = ['images/delete.jpg', 'images/undo.jpg', 'images/redo.jpg','images/image.jpg','images/help.jpg'];
				var nombres = ['Borrar','Deshacer','Rehacer','Ver en otra pestaña','Ayuda'];
			}else{
				var imgs = ['images/cut.jpg', 'images/copy.jpg', 'images/paste.jpg','images/delete.jpg', 'images/undo.jpg', 'images/redo.jpg','images/image.jpg','images/help.jpg'];
				var nombres = ['Cortar','Copiar','Pegar','Borrar','Deshacer','Rehacer','Ver en otra pestaña','Ayuda'];
				}			
			for (var i = 0; i < buttons.length; i++)
			{
				var button = document.createElement('button');
				var img = document.createElement('img');
				img.setAttribute("src", imgs[i]);
				img.setAttribute('title', nombres[i]);
				//button.appendChild(img);
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
				//mxEvent.addListener(button, 'click', factory(buttons[i]));
				//node.appendChild(button);
				var espacio = document.createTextNode("\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0");
				node.appendChild(espacio);
			}

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