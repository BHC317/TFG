function configuracion()
		{
           //ocultar('comenzar');
		  // ocultar('configuracion');
		   ocultar('splash');
			var node = document.getElementById('niveles');
			mxUtils.write(node, 'Niveles de dificultad: ');
			//mxUtils.linkAction(node, 'Todo', editor, 'selectAll');
          // mostrar('facil');
		 //  mostrar('medio');
		 var facil = mxUtils.button('Fácil');
		 estilos(facil);
		node.appendChild(facil);
		 var medio = mxUtils.button('Medio');
		 estilos(medio);
		node.appendChild(medio);		
		 var dif = mxUtils.button('Difícil');
		 estilos(dif);
		node.appendChild(dif);
		}
		
function ocultar(id){
document.getElementById(id).style.display = 'none';
}

function mostrar(id){
document.getElementById(id).style.display = 'block';
}
function estilos(boton){
	boton.style.margin='14px';
	boton.style.padding='5px 10px';
	boton.style.width='185';
	boton.style.height='60';
	boton.style.fontsize='16px';
	boton.style.color='white';
	boton.style.backgroundColor='#73a0c5';
	//return boton;
}


function crearAreaTexto() {
  var graph = document.getElementById("graph");
  var x = graph.createElement("TEXTAREA");
  //var x = document.createElement("TEXTAREA");
  var t = document.createTextNode("At w3schools.com you will learn how to make a website.");
  x.appendChild(t);
  document.body.appendChild(x);
}


function inicio(){
/*ocultar("textoComprension");
mostrar("tabla");
mostrar("status");
mostrar("source");*/
//document.getElementById("textoComprension").style.display = 'none';
createEditor('config/diagrameditor.xml');

}

//document.getElementById("xml").style='display:inline';

function guardar(){
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Start file download.
document.getElementById("guardar").addEventListener("click", function(){
    
 var textNode = document.getElementById("xml");
  var source = document.getElementById('source');
 source.click();
    var filename = document.getElementById("titulo").value+".xml";
    var text = document.getElementById("xml").value; 
    download(filename, text);
}, false);
}
/*function guardar(){
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Start file download.
document.getElementById("guardar").addEventListener("click", function(){
    
 var textNode = document.getElementById("xml");
  var source = document.getElementById('source');
 source.click();
    var filename = document.getElementById("titulo").value+".xml";
    var text = document.getElementById("xml").value; 
    download(filename, text);
}, false);
}*/
function guardar_alumno(){
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Start file download.
document.getElementById("terminar").addEventListener("click", function(){
    
 console.log(document.getElementById('graph'));
 var textNode = document.getElementById('xml');
 var source = document.getElementById('source');
 source.click();
  var filename = document.getElementById("titulo").value+".xml";
  var text = document.getElementById("xml").value;   
   console.log(text);
    download(filename, text);
}, false);
}

function actualizar(t){
	
	console.log("ACTUALIZANDO");
	//console.log(mxGraph.getSelectionCell);
}

	