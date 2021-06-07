<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 	<link rel="stylesheet" href="css/wordpress.css" type="text/css" media="screen" />
 	<link rel="explorer" href="css/explorer.css" type="text/css" media="screen" />
 	<link rel="common" href="css/common.css" type="text/css" media="screen" />	
    <style type="text/css" media="screen">
#page { background: url("images/draw/drawbgcolor.jpg") repeat-x repeat-y top; border: none; }
    </style>
    <script type="text/javascript">
        var mxBasePath = '';
        
        var urlParams = (function(url)
        {
            var result = new Object();
            var params = window.location.search.slice(1).split('&');
            
            for (var i = 0; i < params.length; i++)
            {
                idx = params[i].indexOf('=');
                
                if (idx > 0)
                {
                    result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
                }
            }
            
            return result;
        })(window.location.href);
        
        var mxLanguage = urlParams['lang'];
    </script>
    <script type="text/javascript" src="mxClient.js"></script>
    <script type="text/javascript" src="js/app.js"></script>
    <script type="text/javascript" src="onInit.js"></script>

    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <script type="text/javascript" src="configuracion.js"></script>

	<tr>
			<td id="patronCorr" style="display:none" colspan="2"></td>
		</tr>
		<tr>
			<td id="patronCorrAlMenos" style="display:none" colspan="2"></td>
		</tr>
 <tr>
 <td colspan="2">
   <div id="page" style="width:100%">

       <span id="span" style="float:center;">
               
         <div id="mainActions"
           style="width:100%;padding-left:98px;padding-top:8px;padding-center:24px;padding-bottom:8px;box-sizing: border-box;">
           
          <input id="vistaAlumno" type="checkbox" style="right;display:none;"/><!--Vista Alumno -->
                      
         </div>
         <div id="selectActions" style="width:100%;padding-left:98px;box-sizing: border-box;padding-center:54px;padding-bottom:4px;">
         </div>
 
       </span>


       <table id="tabla"  border="0" width="100%">
           <tr>
               <td id="t" style="width:16px;padding-center:20px;" valign="top">
                   <!-- Toolbar Here -->
               <div id="toolbar">
               </div>
               </td>

               <td valign="top" style="border-width:1px;border-style:solid;border-color:black;">

                   <div id="graph" style="position:relative;height:480px;width:100%;overflow:hidden;cursor:default;">
                       <!-- Graph Here -->
                       <center id="splash" style="padding-top:230px;">
                           <button type="button" id="diseño" onclick="inicio();" autofocus style="display:none;padding: 5px 10px; width: 185; height: 60; font-size: 16px; color: white;  background-color: #73a0c5;">Diseño solución</button>
                       </center>
                   </div>
                   <textarea id="xml" style="height:480px;width:684px;display:none;border-style:none;"></textarea>

               </td>
           </tr>
       </table>
       <span style="float:right;padding-right:36px;">
           <input id="source" type="checkbox"  text="Source" style="display:none;"/>
           <button type="button" id="guardar" onclick="guardar();" style="color: white;  background-color: #73a0c5; border-radius: 8px;">Guardar</button>
       </span>
       <div id="zoomActions" style="width:100%;padding-left:98px;box-sizing: border-box;padding-center:54px;padding-bottom:4px;">
       </div>
       <div id="footer" style="height:20px">
           <p id="status">
               <!-- Status Here -->..
           </p>
           <br/>
       </div>
   </div>
 </td>
 </tr>
<script>
inicio(true);
</script>


							
							
