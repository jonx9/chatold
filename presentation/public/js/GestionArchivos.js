var imagen = [];



//$(document).ready(function () {
//    window.addEventListener("paste", processEvent);

//    function processEvent(e) {
//        for (var i = 0; i < e.clipboardData.items.length; i++) {

//            // get the clipboard item
//            var clipboardItem = e.clipboardData.items[i];
//            var type = clipboardItem.type;

//            // if it's an image add it to the image field
//            if (type.indexOf("image") != -1) {

//                // get the image content and create an img dom element
//                var blob = clipboardItem.getAsFile();


//                imagen.push(blob);

//                var blobUrl = window.webkitURL.createObjectURL(blob);
//                var img = $("<img/>");
//                img.attr("src", blobUrl);

//                // our slider requires an li item.
//                var li = $("<li></li>");

//                // add the correct class and add the image
//                li.addClass("bjqs-slide");
//                li.append(img);

//                // add this image to the list of images
//                $(".bjqs").append(li);

//                // reset the basic-slider added elements
//                $(".bjqs-controls").remove();
//                $(".bjqs-markers").remove();

//                // reset the image slider
//                $('#banner-fade').bjqs({
//                    height: 320,
//                    width: 620,
//                    responsive: true
//                });
//            } else {
//                console.log("Formato no soportado: " + type);
//            }

//        }
//    }
//});


$(document).ready(function () {

    document.getElementById("containerPortapapeles").addEventListener("paste", processEvent);
    function processEvent(e) {

        // get the clipboard item
        var clipboardItem = e.clipboardData.items[0];
        var type = clipboardItem.type;

        // if it's an image add it to the image field
        if (type.indexOf("image") != -1) {

            // get the image content and create an img dom element
            var blob = clipboardItem.getAsFile();

            // Attach file
            imagen = blob;

            var blobUrl = window.webkitURL.createObjectURL(blob);
            var img = $("<img />");
            img.attr("src", blobUrl);

            //remover imagen evidencia actual modal
            $("#imagenEvidencia img ").remove();

            $("#imagenEvidencia").append(img);

        } else {
            alert("Formato no soportado: " + type);
        }
    }
});

$("body").on("click", "#btnEvidencias", function () {
    $("#modalArchivos").show();
    LimpiarModalPortapapeles();
})

$("body").on("click", "#cerrarModalArchivos", function () {
    CerrarModalPortapapeles();
    LimpiarModalPortapapeles();

})

$("body").on("click", "#cerrarModalArchivoPrincipal", function () {
    CerrarModalPortapapeles();
    LimpiarModalPortapapeles();
})

function CerrarModalPortapapeles() {
    $("#modalArchivos").hide();
    LimpiarModalPortapapeles();
}
function LimpiarModalPortapapeles() {
    $('#selectTipoEvidencia').prop('selectedIndex', 0);
    ////remover ultimo item lista
    //$('.bjqs-slide').remove();

    //remover imagen 
    imagen = [];
    $("#imagenEvidencia img ").remove();
}

$("body").on("click", "#guardarEvidenciaGestion", function () {

    ValidarCamposModalEvidencia();

    if ($('#selectTipoEvidencia option:selected').val() != "0" && imagen != undefined && imagen.length != 0) {

        //gestion id
        var idGestion = $("#gtuuId").val();
        var tipoEvidencia = $('#selectTipoEvidencia option:selected').val();

        var formData = new FormData();

        //for (var i = 0; i < imagen.length; i++) {
        //    formData.append("file", imagen[i]);
        //}
        formData.append('file', imagen);
        formData.append("idGestion", $("#gtuuId").val());
        formData.append("tipoEvidencia", $('#selectTipoEvidencia option:selected').val());

        $.ajax({
            type: "POST",
            url: '/Gestions/CargarEvidenciaGestion',
            contentType: false,
            processData: false,
            data: formData,
            success: function (result) {
                console.log(result);
                var _historialArchivoProspecto = result;

                if (_historialArchivoProspecto.type == "OK") {
                    alert(_historialArchivoProspecto.message);
                    LimpiarModalPortapapeles();
                    
                } else {
                    alert("Error al cargar la  evidencia");
                    console.log();
                }

            },
            error: function (xhr, status, p3, p4) {
                var err = "Error " + " " + status + " " + p3 + " " + p4;
                if (xhr.responseText && xhr.responseText[0] == "{")
                    err = JSON.parse(xhr.responseText).Message;
                console.log(err);
            }

        })
    }
})


function ValidarCamposModalEvidencia() {

    if ($('#selectTipoEvidencia option:selected').val() == "0") {
        $("#errorCargaEvidencia").parent().append(string_mensaje("Seleccione el tipo de evidencia"))
    }
    if (imagen == undefined || imagen.length == 0) {
        $("#errorCargaEvidencia").parent().append(string_mensaje("La imagen es obligatoria"))
    }
}