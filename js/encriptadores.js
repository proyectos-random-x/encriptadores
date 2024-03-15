/**
 * Encriptador mejorado
 * autor: Miguel92
 * versión: 2.1
 * * * * * * * * * * * * * * * * * * *
 * Documentaciones:
 * https://developer.mozilla.org/es/docs/Web/API/atob
 * https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
 * https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/RegExp/toString
 * * * * * * * * * * * * * * * * * * *
 * Soluciones:
 * https://es.stackoverflow.com/questions/414029/invertir-clave-valor-en-un-objeto
*/

// AREAS
const areaInput = document.querySelector(".area-input");
const areaInputTextarea = areaInput.querySelector("textarea");

const areaResult = document.querySelector(".resultado");
const areaResultVer = areaResult.querySelector(".resultado-ver");
const areaResultVerTextarea = areaResult.querySelector("textarea");

areaInput.querySelector("h3 b").innerHTML = getCookie('encriptador')
if(getCookie('encriptador') === 'experto') {
	var txt = "Este modo admite todos los carácteres especiales!";
} else if(getCookie('encriptador') === 'avanzado') {
	var txt = "No se adminten mayúsculas y carácteres especiales";
}
areaInput.querySelector("h3 small").innerHTML = txt

document.getElementById("salir").onclick = () => {
	deleteCookie('encriptador')
	document.body.classList.remove("encript");
	location.reload();
}

const Datos = {
	mapa: {
		a: "ai", 
		e: "enter", 
		i: "imes", 
		o: "ober",
		u: "ufat"
	},
	basico: {
		caracteres: true
	},
	avanzado: {
		caracteres: true
	},
	experto: {
		caracteres: false
	}
}
/**
 * Generamos regex para "básico"
*/
function regex(action) {
	let newRegex = (action === 'encriptar') ? Object.keys(Datos.mapa) : Object.values(Datos.mapa);
	var newExpresion = new RegExp(newRegex.join('|').toString(), 'gim');
	return newExpresion
}
/**
 * Esta función invierte un objeto
 * ej: Original ({id: 294}) -> Modificado ({294: id})
*/
function InvertObj() {
	let newObj = {}; // Creamos un nuevo objeto
	for (const key in Datos.mapa) {
		let nuevaKey = Datos.mapa[key];
		newObj[nuevaKey] = key
	}
	return newObj;
}


let seleccion = getCookie('encriptador').toString();
/**
 * Con este if solo afectamos al modo básico|avanzado
 * Agrego una función para evitar el ingreso de:
 * - Mayúsculas
 * - Números
 * - Simbolos y Carácteres especiales
*/
if(Datos[seleccion].caracteres) {
	areaInputTextarea.addEventListener('keyup', () => {
		// Forzamos a las mayusculas por las minusculas
		nuevovalor = areaInputTextarea.value.toLowerCase();
		// Reemplazamos letras con tilde o ñ por letras comunes
		nuevovalor = nuevovalor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		// Reemplazamos números/simbolos por vacio
		reg = (getCookie('encriptador') === 'avanzado') ? /[^a-z0-9, ]/g : /[^a-z ]/g;
		nuevovalor = nuevovalor.replace(reg, "");
		areaInputTextarea.value = nuevovalor
		// Ahora ocultamos y mostramos
		areaResult.classList.remove("ver")
		areaInputTextarea.onblur = areaInputTextarea.style.border = ''
	})
}

/**
 * Función para copiar el texto
*/
function copiando() {
   areaInputTextarea.value = "";
   areaResult.querySelector(".btn").innerHTML = "Copiado...";
   setTimeout(() => {
   	areaResult.querySelector(".btn").innerHTML = "Copiar";
		// Ahora ocultamos y mostramos
		areaResult.classList.remove("ver")
		areaInputTextarea.value = ''
   }, 1500)
}
function copyText() {
	areaResultVerTextarea.select();
	navigator.clipboard.writeText(areaResultVerTextarea.value).then(() => copiando(), () => {
		if(document.execCommand("copy")) copiando()
	});
}

// Obtenemos todos los botones
var values = [].map.call(Encriptador.querySelectorAll(".btn"), boton => boton.addEventListener('click', () => ex(boton.id)));

function ex( type ) {
	if(type === 'encriptar' || type === 'desencriptar') {
		// Comprobamos que la variable no este vacío
		var texto = areaInputTextarea.value
		if(texto === '') {
			areaResult.querySelector(".h3").style.display = "block"
			areaInputTextarea.onfocus = areaInputTextarea.style.boxShadow = '0 0 10px #F006'
			return;
		}
		let nuevoTexto = '';
		switch (getCookie('encriptador')) {
			case 'basico':
				nuevoTexto = texto.replace(regex(type), matched => (type === 'encriptar' ? Datos.mapa : InvertObj())[matched]);
			break;
			case 'avanzado':
				let array = [];
			  	for (let letra = texto.length-1; letra >= 0 ; letra--) {
			  		content = (texto[letra].charCodeAt() === 32) ? ' ' : texto[letra].charCodeAt() + ','
			    	array.unshift([content].join(''));
			  	}
		  		nuevoTexto = (type === 'encriptar') ? array.join('') : texto.replace(/(\d+),/g, (match, dec) => String.fromCharCode(dec));
			break;
			case 'experto':
				nuevoTexto = (type === 'encriptar') ? window.btoa(texto) : window.atob(texto);
			break;
		}
		areaResultVerTextarea.innerHTML = nuevoTexto;
		areaResult.classList.add("ver")
		areaInputTextarea.value = '';
	} else copyText()
}