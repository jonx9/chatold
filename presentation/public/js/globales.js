//function imgError(image) {
//    image.onerror = "";
//    image.src = url+"imgUsuario/man.jpg";
//    return true;
//}

function imgError(image) {
    image.onerror = "";
    image.src = url + "/Resources/notfound.jpg";
    return true;
}

var dimerG = "";
var botonCargaG = false;
var b_validacion = true;
// elimina el boton de cerrado
i_close = 0;
primerElementoG = true; // permite saber si es el primer elemento para las validaciones
var i_ubicacionMensaje = 1;
url = $("#url").text();

$(document).ready(function() {
	$('.dropdown').dropdown();
	$('.dropdown').dropdown();
	$('.checkbox').checkbox();
	$('.progress').progress();
	$('.tabular .item').tab();
	if ($( ".fechaCalendario" ).length>0) {
		calendarioEs();
		$( ".fechaCalendarioP.todo" ).datepicker({dateFormat: 'yy-mm-dd'});
        $(".fechaCalendario.todo").datepicker({ dateFormat: 'yy-mm-dd'});
		$(".fechaCalendario.anio").datepicker({
			dateFormat: 'yy-mm-dd',
			changeMonth: true,
			changeYear: true,
			defaultDate: '1990-01-01'
		});
        $(".fechaCalendario.hoy").datepicker({ dateFormat: 'yy-mm-dd',minDate: 0});
        $(".fechaCalendario.despues").datepicker({ dateFormat: 'yy-mm-dd',minDate: 1});
	}
});
/*ººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººº*/
/*ººººººººººº|	DECLARACION EVENTOS DEL MODULO 			 	   |ººººººººººººº*f/
/*ººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººººº*/
$(document).ready(function() {
	$('.help.icon.circle').popup();
	$('.ui.rating').rating();
	$("body").on('click', '.btn_removerFila',void_EliminarFila);
	$("body").on('submit', 'form#frm_login',void_login);
	//$("img").error(function() {
	//	$(this).prop("src",url+"imgUsuario/man.jpg");
	//		$("img").error(function() {
	//			$(this).prop("src",url+"imgUsuario/man.jpg");
			
	//		});
	//});
});


/*  Nombre Funcion: void_EliminarFila
	Descripción: Elimina la fila padre de una tabla
	param: 
	return: 
*/

function void_EliminarFila () {
	$(this).parent().parent().remove();
}

/*  Nombre Funcion: string_mensaje
	Descripción: nos devuelve un mensaje que se ubicara en el lugar que deseemos
	param: color,m_padre,m_hijo
	return: mensaje
*/
function string_mensaje (m_padre,m_hijo,color) {
	
	color = typeof color !== 'undefined' ? color : "negative";
	close = (!i_close) ? "<i onclick='this.parentNode.remove()' class='close icon'></i>" : ""  ;
	color == "negative" ? "": $(".message").remove();
	var mensaje = "<div class='ui "+color+" message'> \
					   "+close+"\
					  <div class='header'> \
					    "+m_padre+" \
					  </div> \
					  <p>"+m_hijo+"</p> \
					</div>";

	return mensaje;
}


/*  Nombre Funcion: EsCorreo
	Descripción: verifica si un campo en especifico es de tipo correo
	param: mail
	return: booleano
*/

function EsCorreo(mail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
}


/*  Nombre Funcion: EsEntero
	Descripción: verifica si un campo en especifico es de tipo entero
	param: entero
	return: booleano
*/

function EsEntero(entero) {
    return /^([0-9])*$/.test(entero);
}

/*  Nombre Funcion: SeguridadPassword
	Descripción: verifica si un campo en especifico es de tipo entero
	param: entero
	return: a_respuesta
*/

function SeguridadPassword(password) {
	a_respuesta = new Array() ;
	a_respuesta[0] = 1
	if (!/\W/.test(password)) {
		a_respuesta[0] = 0;
		a_respuesta[1] = "debe poseer almenos un caracter especial";
		return a_respuesta;
	}
	if (/ /.test(password)) {
		a_respuesta[0] = 0;
		a_respuesta[1] = "no puede tener espacios por seguridad";
		return a_respuesta;
	}
	if (!/[0-9]/.test(password)) {
		a_respuesta[0] = 0;
		a_respuesta[1] = "debe poseer almenos un numero";
		return a_respuesta;
	}
	if (!/[a-zA-Z]/.test(password)) {
		a_respuesta[0] = 0;
		a_respuesta[1] = "debe poseer almenos una letra";
		return a_respuesta;
	}
    return a_respuesta;
}

/*  Nombre Funcion: void_borrarCampo
	Descripción: borra el campo del valor seleccionado
	param: 
	return: 
*/
function void_borrarCampo () {
	elm = $(this);
	tipoElm = elm.prop('tagName');
	if ( tipoElm == "INPUT"){
		$(this).val("");
		$(this).text("");
	}

	if (tipoElm== "SELECT") {
		elm.val("0");
	}
	if (tipoElm== "TEXTAREA") {
		elm.val("");
	}
}

/*  Nombre Funcion: void_validaCampo
	Descripción: verifi
	param: 
	return: 
*/
function void_validaCampo () {
	var elm    = $(this);
	switch(i_ubicacionMensaje) {
		case 1:
			ubicacion = elm.parent();
			break;
		case 2:
			ubicacion = elm.parent().parent();
			break;
		case 3:
			ubicacion = elm.parent().parent().parent();
			break;
		case 4:
			ubicacion = elm.parent().parent().parent().parent();
			break;
		default:
			ubicacion = elm.parent();
		break;
	}
	nombre = elm.data("nombre");
	minimo = elm.data("largo");
	tipo   = elm.data('tipo');
	etiq   = elm.prop("tagName");
	nombre = typeof nombre !== 'undefined' ? nombre : "";
	if (tipo == "numero" && elm.val()!="") {
 	     if (!EsEntero(elm.val())){
	        b_validacion = false;
			ubicacion.append(string_mensaje("","El campo "+nombre+" no es un numero"));
			if(primerElementoG == 1){ elm.focus(); primerElementoG = 0	}
		}
	}
	if (tipo == "correo" && elm.val()!="") {
 	     if (!EsCorreo(elm.val())){
	        b_validacion = false;
			ubicacion.append(string_mensaje("","El campo "+nombre+" no tiene un correo valido"));
			if(primerElementoG == 1){ elm.focus(); primerElementoG = 0	}
		}
	}
	if (tipo == "password" && elm.val()!="") {
	        console.log('comprobando seguridad password');
		    a_comprobacion = SeguridadPassword(elm.val());
 	     if (!a_comprobacion[0]){
	        b_validacion = false;
			ubicacion.append(string_mensaje("","Error password inseguro, El campo "+nombre+" "+a_comprobacion[1]));
			if(primerElementoG == 1){ elm.focus(); primerElementoG = 0	}
		}
	}
	if (elm.val()== 0 || elm.val()=="") {
		b_validacion = false;
		etiq == "INPUT" ? ubicacion.append(string_mensaje("","El campo "+nombre+" esta vacio")) : "";
		etiq == "SELECT" ? ubicacion.append(string_mensaje("","No ha escogido una opción para el campo "+nombre)) : "";
		etiq == "TEXTAREA" ? ubicacion.append(string_mensaje("","no se ha ingresado la observación para el campo"+nombre)) : "";
		if(primerElementoG == 1){ elm.focus(); primerElementoG = 0	}
		
	};
	if (minimo > 0 && (minimo >elm.val().length) && b_validacion) {
		b_validacion = false;
		ubicacion.append(string_mensaje("se necesitan minimo "+minimo+" letras","En el campo "+nombre+" solo se ingresaron "+elm.val().length+" letras"));
		if(primerElementoG == 1){ elm.focus(); primerElementoG = 0	}
	};
}


/*  Nombre Funcion: void_verificaCampo
	Descripción: funcion que se encarga de verificar las preguntas dinamicas de la base de datos
	param: 
	return: 
*/
function void_verificaCampo () {
	var elm    = $(this);
	padre = elm.parent(".field");
	ubicacion = padre;
	req = padre.hasClass("required");
	tipo   = padre.data('tipo');
	nombre = typeof nombre !== 'undefined' ? nombre : "";
	if (tipo == "3" || tipo == "4"|| tipo == "6"|| tipo == "7") {
		campo= padre.find("input");
	}
	if (tipo == "5") {
		campo= padre.find("textarea");
	}
	if (tipo == "2") {
		campo= padre.find("input:checkbox:checked");
		campoObservacion = padre.find(".txt_observa input.requerido");
	}
	if (tipo == "1") {
		campo= padre.find("select");
		campoRequerido = padre.find("select option:selected").data("requerido");
		opcion = padre.find("select option:selected").data("valor");
	}
	if ((campo.val()== 0 || campo.val()=="") && req==1 &&(tipo == "1" || tipo == "3" ||tipo == "4"||tipo == "5" ||tipo == "6" ||tipo == "7"  )) {
		b_validacion = false;
		ubicacion.append(string_mensaje("","El campo "+elm.text()+" esta vacio"));
		if(primerElementoG == 1){ campo.focus(); primerElementoG = 0	}
	};

	if (campo.length==0 && tipo == "2" && req ==1) {
		b_validacion = false;
		ubicacion.append(string_mensaje("","debe seleccionar minimo una opcion para el campo"+elm.text()));
		if(primerElementoG == 1){ padre.find("input:checkbox:first").focus(); primerElementoG = 0	}
	}
	if (tipo == 2) {
		campoObservacion.each(function(index, el){
			if ($(this).val()=="") {
			b_validacion = false;
			etiquetaLabelRespuesta = $(this).parent().prev('.checkbox.chk_observa').find("label").text();
			ubicacion.append(string_mensaje("","el campo de observacion para el campo \""+etiquetaLabelRespuesta+"\" de la pregunta"+elm.text()+" es obligatorio"));
			
			if(primerElementoG == 1){$(this).focus(); primerElementoG = 0	}
			}
		})
	}
	if (tipo == 3) {
 	     if (!EsEntero(campo.val())){
	        b_validacion = false;
			ubicacion.append(string_mensaje("","El campo "+elm.text()+" no es un numero"));
			
			if(primerElementoG == 1){campo.focus(); primerElementoG = 0	}
		}
	}
	if (tipo == 7) {
 	     if (!EsCorreo(campo.val()) && campo.val() != ""){
	        b_validacion = false;
			ubicacion.append(string_mensaje("","El campo "+elm.text()+" no es un correo valido"));
			if(primerElementoG == 1){campo.focus(); primerElementoG = 0	}
		}
	}
	if (tipo == 1 && opcion == 1 && campoRequerido == 1) {
		if (padre.find("input").val()=="") {
			ubicacion.append(string_mensaje("","el campo de observacion para la respuesta \""+padre.find("select option:selected").text()+"\" de la pregunta"+elm.text()+" es obligatorio"));
	        b_validacion = false;
			
			if(primerElementoG == 1){padre.find("input").focus(); primerElementoG = 0	}
		}

	}
	// if (!b_validacion) return false;
}

function void_login (event) {
	botonCargaG = true;
	dimerG = $(this);
	$(".message").remove();
	s_elm = $(this);
	event.preventDefault();
	b_validacion = 1;
	i_ubicacionMensaje = 2;
	$(".field.required input").each(void_validaCampo);
	if (!b_validacion)	{return false }
	s_documento = encodeURI($("#txt_documento").val());
	s_password  = encodeURI($("#txt_password").val());
	$.post(url+'index.php/inicioC/string_Ingresar/',{s_documento:s_documento,s_password:s_password}, function(data, textStatus, xhr) {
		i_error = string_solicituError(s_elm.parent(),data);
		if (i_error=="0") {
		s_elm.append(string_mensaje("",data,"success"));
		}
	});

}

/*  Nombre Funcion: calendarioEs
	Descripción: funcion que se encarga de poner el calendario en español
	param: 
	return: 
*/


function calendarioEs () {
 $.datepicker.regional['es'] = {
 closeText: 'Cerrar',
 prevText: '<Ant',
 nextText: 'Sig>',
 currentText: 'Hoy',
 monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
 monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
 dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
 dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
 dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
 weekHeader: 'Sm',
 dateFormat: 'dd/mm/yy',
 firstDay: 1,
 isRTL: false,
 showMonthAfterYear: false,
 yearSuffix: ''
 };
 $.datepicker.setDefaults($.datepicker.regional['es']);
}



/*  Nombre Funcion: ajaxStart
	Descripción: activa el dimer para el elemento que se necesita
	param: 
	return: 
*/

$(document).ajaxStart(function() {
 if (botonCargaG) {
 	dimerG.addClass('loading');
 }
 else{
  $(dimerG+".dimmer.carga").addClass('active');
 }
});
$(document).ajaxStop(function() {
  if (botonCargaG) {
  	dimerG.removeClass('loading');
  	botonCargaG = 0;
  }
  else{
  $(dimerG+".dimmer.carga").removeClass('active');
  }
});


/*  Nombre Funcion: string_solicituError
	Descripción: verifica si la solicitud ajax viene con un error en el sistema
	param: ubicacion,datos
	return: booleano
*/

function string_solicituError(ubicacion,datos)
{
		if (/ALERTA/.test(datos)) {
			data = datos.split("[ALERTA]")
			ubicacion.append(string_mensaje("Error",data[1],"negative"));
			return 1;
		}
		return 0;
}

/*ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªºº*/
/*ªªªªªªªª| codigo reloj javascript 						     |ªªªªºº*/
/*ªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªªºº*/
function reloj() {
    var hoy=new Date(); var h=hoy.getHours(); var m=hoy.getMinutes(); var s=hoy.getSeconds();
    m = actualizarHora(m);    s = actualizarHora(s);
    fechaActual = fecha();
    document.getElementById('displayReloj').innerHTML = fechaActual+" "+h+":"+m+":"+s;
    var t = setTimeout(function(){reloj()},500);
}
 
function actualizarHora(i) {
    if (i<10) {i = "0" + i};  // Añadir el cero en números menores de 10
    return i;
}
function fecha () {
	var d=new Date();
	var dia=new Array(7);
	dia[0]="Domingo";
	dia[1]="Lunes";
	dia[2]="Martes";
	dia[3]="Miercoles";
	dia[4]="Jueves";
	dia[5]="Viernes";
	dia[6]="Sabado";
	var mm=new Date();
	var m2 = mm.getMonth() + 1;
	var mesok = (m2 < 10) ? '0' + m2 : m2;
	var mesok=new Array(12);
	mesok[0]="Enero";
	mesok[1]="Febrero";
	mesok[2]="Marzo";
	mesok[3]="Abril";
	mesok[4]="Mayo";
	mesok[5]="Junio";
	mesok[6]="Julio";
	mesok[7]="Agosto";
	mesok[8]="Septiembre";
	mesok[9]="Octubre";
	mesok[10]="Noviembre";
	mesok[11]="Diciembre";
	var yy = d.getYear();
	var year = (yy < 1000) ? yy + 1900 : yy;
	return d.getDate()+" de "+mesok[mm.getMonth()]+" del "+year;
}

/*  Nombre Funcion: void_pie
	Descripción: nos lleva al final de la pagina
	param: 
	return: 
*/


function void_pie () {
	window.scrollTo(0,document.body.scrollHeight);
}
/*  Nombre Funcion: convertirFormato
	Descripción: convierte una fecha del formato   año/mes/dia a año/dia/mes
	param: fechaAnterior
	return: fechaNueva
*/

