
		
function ocultar(id){
document.getElementById(id).style.display = 'none';
}

function mostrar(id){
document.getElementById(id).style.display = 'block';
}


function inicio(profesor){
	if (profesor){
		createEditor('config/diagrameditor.xml');
	}else{
		createEditor('config/diagrameditor_alumno.xml');
	}
}


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


	