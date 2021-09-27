function Libro (id, titulo, autor, editorial, valor, cantidad) {
    //Constructor
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.editorial = editorial;
    this.valor = valor;
    this.cantidad = cantidad;

    //Getters
    this.getId = function () {return this.id};
    this.getTitulo = function () {return this.titulo};
    this.getAutor = function () {return this.autor};
    this.getEditorial = function () {return this.editorial};
    this.getValor = function () {return this.valor};
    this.getCantidad = function () {return this.cantidad};
}


// -- Cargar catalogo
let catalogo = [];

let data_libros = [{"id":1,"titulo":"Algo es posible","autor":"Elida Fernández","editorial":"images/tapasLibros/Libro1.jpg","valor":754.54,"cantidad":22},
{"id":2,"titulo":"Clinica de las neurosis","autor":"Monica Torres","editorial":"images/tapasLibros/Libro2.jpeg","valor":1982.04,"cantidad":23},
{"id":3,"titulo":"Seminario 5 Las formaciones del Inconsciente","autor":"Jacques Lacan","editorial":"images/tapasLibros/Libro3.jpg","valor":885.41,"cantidad":43},
{"id":4,"titulo":"Seminario 11 Los cuatro conceptos fundamentales","autor":"Leland Minucci","editorial":"images/tapasLibros/Libro4.jpg","valor":1659.91,"cantidad":33},
{"id":5,"titulo":"Desadultorizaciones","autor":"Ricardo Rodulfo","editorial":"images/tapasLibros/Libro5.jpg","valor":1883.71,"cantidad":55},
{"id":6,"titulo":"La diferencia desquiciada ","autor":"Ana María Fernández","editorial":"images/tapasLibros/Libro6.jpg","valor":1396.86,"cantidad":73},
{"id":7,"titulo":"Piezas sueltas","autor":"Jacques-Alain Miller","editorial":"images/tapasLibros/Libro7.jpg","valor":1462.7,"cantidad":75},
{"id":8,"titulo":"Lecciones de introducción al psicoanálisis","autor":"Oscar Masotta","editorial":"images/tapasLibros/Libro8.jpg","valor":671.33,"cantidad":77},
{"id":9,"titulo":"Estudios sobre la psicosis","autor":"Colette Soler","editorial":"images/tapasLibros/Libro9.jpg","valor":59.59,"cantidad":28},
{"id":10,"titulo":"Género, psicoanálisis, subjetividad","autor":"Mabel Burin, Emilce Dio Bleichmar","editorial":"images/tapasLibros/Libro10.jpg","valor":1244.02,"cantidad":7}]


for (let libro of data_libros) {
    catalogo.push(new Libro(libro.id,libro.titulo,libro.autor,libro.editorial,libro.valor,libro.cantidad)); 
}

let vista = [];    
let carrito = [];   
let cantFilas = 2;
let cantColum = 3;
$("document").ready (cargarCards);

// -- Cargar CARDS
function cargarCards () {

    let cantLibros = cantFilas * cantColum;

    cargarVista(paginacion.min, cantLibros);

    $("#catalogo").append("<div class='row d-flex justify-content-center' id='stock'></div>");
    for (let libro of vista) {
        generarLibro(libro);
    }  
    
    $(".addCarrito").click (
        (event) => {
            let nro = event.target.id;
            let ubicacion = nro.substr(nro.length-1, 1);
            console.log(ubicacion);
            console.log(buscarLibro(ubicacion));
            if (buscarLibro (ubicacion)) {
                acumularMonto(ubicacion);
            } 
            else {carrito.push(catalogo[ubicacion-1]); carrito[carrito.length-1].cantidad=1;}

            if ($("#detalle").is(":visible")) {
                actualizarDetalle();
            } else {
                cantidadCarrito();
            }
        }
            
    );
}

function buscarLibro (idLibro) {
    let encontrado = false;
    for (i=0; i<carrito.length; i++) {
        if (carrito[i].id == idLibro) {
            encontrado = true;
            break;
        }
    }
    if (encontrado) {
        return true;
    } else {return false;}
}

function acumularMonto(idLibro) {
    for (i=0; i<carrito.length; i++) {
        if (carrito[i].id ==  idLibro) {
            let suma = parseFloat(buscarValor(idLibro))
            console.log(suma);
            carrito[i].valor += suma;
            carrito[i].cantidad += 1;
            break;
        } 
    }  
}

function cantidadCarrito () {
    let cantTotal = 0;
    for (const libro of carrito) {
        cantTotal += libro.cantidad;
    }
    if (cantTotal == 0) {$("#carrito").html(" ");} 
    else {$("#carrito").html("+"+cantTotal);}
}

function generarLibro (unLibro) { 
    let idLibro = unLibro.id;
    $("#stock").append("<div class='col-4 card' id='libro"+idLibro+"'></div>");
    $("#libro"+idLibro+"").append("<div class='card-body' id='body"+idLibro+"'></div>");
    $("#body"+idLibro+"").append("<h4 class='card-title' id='titulo"+idLibro+"'>"+unLibro.titulo+"</h4>");
    $("#body"+idLibro+"").append("<p class='card-text' id='autor"+idLibro+"'>"+unLibro.autor+"</p>");
    $("#body"+idLibro+"").append("<img class='imagenesLibros' id='editorial"+idLibro+"' src="+unLibro.editorial+" >");
    $("#body"+idLibro+"").append("<h6 class='card-subtitle mb-2 text-muted' id='precio"+idLibro+"'>$"+unLibro.valor+"</h6>");
    $("#body"+idLibro+"").append("<a href='#!' class='btn btn-primary addCarrito' id='boton"+idLibro+"'>Agregar Carrito</a>");
}

function cargarVista (minimo, cantLibros) {
    for (i=0; i<cantLibros; i++){
        vista[i] = catalogo [minimo+i];
    }
}

// -- Navegacion 

let paginacion = {
    actual: 1,
    min: 0
}

// -- Control carrito
$("document").ready(
    function () {
        $("#detalle").hide();

        $("#imgcarrito").click (

            function () {
                if ($("#detalle").is(":visible")) {
                    ocultarDetalle ();
                } else {
                    mostrarDetalle();
                }
            }
        );
    }
);

function cambiarHTML () {
    $("#catalogo").toggleClass("col-8"); 
    $("#detalle").toggleClass("col-4");
}

function vistaDetalle () {
    $("#detalle").slideToggle("slow");
}

//-----------------------------------------------------------------------------
function generarDetalle () {
    $("#detalle").append("<div id='ticket'></div>");
    $("#ticket").append("<h3>Tu Compra:</h3>");
    $("#ticket").append("<div id='items' class='row'></div>");
    $("#items").append("<div class='col-9' id='itemName'></div>");
    $("#items").append("<div class='col-3' id='itemPrecio'></div>");
    for (i=0; i < carrito.length; i++){
        $("#itemName").append("<p>"+carrito[i].titulo+" x"+carrito[i].cantidad+"<button class='btn btn-link' onclick='restarLibro("+carrito[i].id+")'> <i class='far fa-times-circle'></i> </button></p>");
        $("#itemPrecio").append("<p>$"+carrito[i].valor+"</p>");
    }
    let total = calcularTotal();
    if (total == 0) {$("#ticket").append("<h6>No hay libros en en carrito</h6>");}
    else {
        $("#ticket").append("<h5>Total: $"+total+"</h5>");
        $("#ticket").append("<button onclick='vaciarCarrito()' class='btn btn-outline-primary'>vaciar carrito</button>");
    }
}

function calcularTotal() {
    let total = 0;
    for (let libro of carrito) {
        total += libro.valor;
    }
    return total;
}

//---------------------------------------------------------------------------

function eliminarDetalle () {
    $("#ticket").remove();
}

function vaciarCarrito () {
    carrito = [];
    cantidadCarrito();
    ocultarDetalle();
}

function restarLibro(idLibro) {
    for (i=0; i<carrito.length; i++) {
        if (carrito[i].id == idLibro) {
            if (carrito[i].cantidad > 1) {
                carrito[i].cantidad -=1;
                let precioLibro = buscarValor(carrito[i].id);
                console.log(precioLibro);

            } else {
                carrito.splice(i, 1);
            }
            break;
        }
    }
    actualizarDetalle();
}

function buscarValor(idLibro) {
    for (i=0; i<catalogo.length; i++) {
        if (catalogo[i].id == idLibro) {
            let valorDevuelto = catalogo[i].valor;
            return valorDevuelto;
        }
    }
}

// -- Funciones globales 
function mostrarDetalle (){
    vistaDetalle();
    cambiarHTML();
    generarDetalle();
}

function ocultarDetalle (){
    eliminarDetalle();
    vistaDetalle();
    cambiarHTML();
}

function actualizarDetalle (){
    cantidadCarrito();
    eliminarDetalle();
    generarDetalle();
}