function GetInputFormData(e){var a=e;var c=new Array;for(var d=1;d<a.rows.length;d++){var f=a.rows[d].cells;c[d-1]=new Array;for(var b=0;b<f.length-1;b++){c[d-1][b]={RowId:d,Param:f[b].firstElementChild.id,value:f[b].firstElementChild.value}}}return c}function ValidateFunctionalLogic(e){var b=e.length;var c="NO";if(b>30){b=30}for(var f=0;f<b;f++){var a=e[f].length;for(var d=0;d<a;d++){$value=e[f][d].value.trim();$param=e[f][d].Param.trim();switch($param){case ("inSrcFile"):case ("inSrcTable"):$value=$value.replace(/\s/g,"_");e[f][d].value=$value.toUpperCase();break;case ("inSrcFileType"):switch($value){case ("CSV"):e[f][d+1].value=e[f][d-1].value;break;case ("XLSX"):break}e[f][d-1].value=e[f][d-1].value+"."+$value;break;case ("do_save2disk"):if($value.length==0){$value="NO";e[f][d].value=$value}switch($value){case"YES":if(f>0){e[f-1][d].value="NO"}c="YES";break;case"NO":if(c=="YES"){e[f-1][d].value="NO";e[f][d].value=c}break}break}}}return(JSON.stringify(e))}function SubmitForm2SASJobExec(b,f){var g=new FormData();var a=-1;var d;d=bootbox.dialog({message:'<p class="alert alert-light text-center mb-0"><i class="fa fa-spin fa-cog"></i>Loading... Please wait ...</p>',show:true,onEscape:true,backdrop:false,closeButton:false});d.init(function(){setTimeout(function(){},f)});var c=b;g.append("formjsondata",c);g.append("_program","$PROGRAM$");g.append("_timeout","200");g.append("_csrf","$CSRF$");var e=new XMLHttpRequest();e.addEventListener("error",function(h){a="error";alert("Something went wrong.");document.getElementById("waiting").style.display="none";d.modal("hide");return(false)});e.addEventListener("loadstart",function(h){a="loadstart";document.getElementById("waiting").style.display="block";return(true)});e.addEventListener("loadend",function(h){if(a!="error"){document.getElementById("waiting").style.display="none";d.modal("hide");bootbox.alert({message:"Load Done!",centerVertical:true,size:"small"});return(true)}return(false)});e.onreadystatechange=function(){if(this.readyState==4){a="done";d.modal("hide");document.getElementById("waiting").style.display="none";if(this.status==200){document.getElementById("JobResults").innerHTML="XHR Response: "+this.responseText;return(true)}else{document.getElementById("JobResults").innerHTML="XHR Status: "+this.status;return(false)}}};e.open("post","/SASJobExecution/");e.send(g);document.getElementById("waiting").style.display="block";document.getElementById("JobResults").innerHTML="Loading ... please wait...";return(true)}function ProcessSubmitForm(a){var h=document.getElementById(a);var l="";var d=new GetInputFormData(h);json_str=ValidateFunctionalLogic(d);var b='<table style="border:1px solid #b8daff; padding:5px; width:100%;">';b=b+'<thead  bgcolor="#b8daff">';b=b+'<tr style="color:#06F; font-size:14px" >';b=b+'<th class="text-center">Row</th>';b=b+'<th class="text-center">Dictionary File..</th>';b=b+'<th class="text-center">..for Table</th>';b=b+'<th class="text-center">New version ?</th>';b=b+'<th class="text-center">Save2Disk ?</th>';b=b+"<tr></thead>";var k=d.length;for(var f=0;f<k;f++){var c=d[f].length;var g="<tr>";g=g+'<td style="border:1px solid #b8daff; padding:5px;">'+(f+1)+"</td>";for(var e=0;e<c;e++){if(e==1){e++}l=d[f][e].value;if(l.length>25){l=l.substring(0,22);l=l+"..."}g=g+'<td style="border:1px solid #b8daff; padding:5px;">'+l+"</td>"}g=g+"</font></tr>";b=b+g}b=b+"</table>";var m=bootbox.confirm({size:"large",title:"Are you sure you want to Submit this?",message:b,buttons:{confirm:{label:"Confirm",label:'<i class="fa fa-check"></i> Confirm'},cancel:{label:"Cancel",label:'<i class="fa fa-times"></i> Cancel'}},callback:function(i){switch(i){case true:event.preventDefault();rqst=SubmitForm2SASJobExec(json_str,k*60000);return(rqst);break;case false:m.modal("hide");return(i);break}}})}$(document).ready(function(){$("#add_row").on("click",function(){var b=0;$.each($("#tab_logic tr"),function(){if(parseInt($(this).data("id"))>b){b=parseInt($(this).data("id"))}});b++;var c=$("<tr></tr>",{id:"addr"+b,"data-id":b});$.each($("#tab_logic tbody tr:nth("+(b-1)+") td"),function(){var g;var d=$(this);var e=d.children();if($(this).data("name")!==undefined){g=$("<td></td>",{"data-name":$(d).data("name")});var f=$(d).find($(e[0]).prop("tagName")).clone().val("");f.attr("name",$(d).data("name")+b);f[0].value=e[0].value;f.appendTo($(g));g.appendTo($(c))}else{g=$("<td></td>",{text:$("#tab_logic tr").length}).appendTo($(c))}});$(c).appendTo($("#tab_logic"));$(c).find("td button.row-remove").on("click",function(){$(this).closest("tr").remove()})});var a=function(d,b){var c=b.children();var f=b.clone();f.children().each(function(e){$(this).width(c.eq(e).width())});return f};$(".table-sortable tbody").sortable({helper:a}).disableSelection();$(".table-sortable thead").disableSelection();$.validator.setDefaults({submitHandler:function(){ProcessSubmitForm("tab_logic")}});$("#GetParamsForm").validate({rules:{inSrcFile:{required:true,minlength:3,maxlength:32},inSrcFileType:{required:true},inSrcTable:{required:true,minlength:3,maxlength:30},do_update_defs:{required:true},do_save2disk:{required:true}},messages:{inSrcFile:{required:"Filename (no spaces nor special characters)",minlength:"File Name should have at least 3 characters",maxlength:"File Name cannot exceed 32 characters"},inSrcTable:{minlength:"Table Name should have at least 3 characters",maxlength:"Table Name cannot exceed 30 characters"},inSrcFileType:"Please select a value",do_update_defs:"Please select a value",do_save2disk:"Please select a value"},errorElement:"em",errorPlacement:function(b,c){b.addClass("invalid-feedback");if(c.prop("type")==="checkbox"){b.insertAfter(c.next("label"))}else{b.insertAfter(c)}},highlight:function(d,b,c){$(d).addClass("is-invalid").removeClass("is-valid")},unhighlight:function(d,b,c){$(d).addClass("is-valid").removeClass("is-invalid")}});$("#btn_cancel").on("click",function(){bootbox.confirm({message:"Are you sure you want to Quit ?",buttons:{confirm:{label:"Yes",className:"btn-success"},cancel:{label:"No",className:"btn-danger"}},callback:function(b){switch(b){case true:event.preventDefault();return(open(location,"_self").close());case false:console.log("This was logged in the callback: "+b);break}}})})});