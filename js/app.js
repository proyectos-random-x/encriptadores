const Encriptador = document.getElementById("app");

/**
 * Implementación de dark mode
 * Activar con Shift + D
 * window.matchMedia
 * https://developer.mozilla.org/es/docs/Web/API/Window/matchMedia
*/
// ----------- MODO DARK -----------
const oscuro = 'DarkMode',
newtheme = localStorage.getItem('ModeDarkActive'),
tieneDark = window.matchMedia('(prefers-color-scheme: dark)').matches,
getCurrentTheme = () => document.body.classList.contains(oscuro) ? 'DarkMode' : 'LightMode';

if (newtheme) document.body.classList[newtheme === 'DarkMode' ? 'add' : 'remove'](oscuro)
else {
	if (tieneDark) document.body.classList.add(oscuro)
}

document.onkeydown = tecla => {
	// ----------- SHIFT + D -----------
	if (tecla.shiftKey) {
	   if (tecla.keyCode == 68 || event.keyCode == 100) {
			document.body.classList.toggle(oscuro)
			localStorage.setItem('ModeDarkActive', getCurrentTheme())
	   }
	}
}

/**
 * Funcion para crear elementos html
*/
function crearElemento(etiqueta, objecto, agregar = 'appendChild', en = '') {
	const CreateNewElement = document.createElement( etiqueta )
	for (var init = 0; init < Object.values(objecto).length; init++) {
		//
		var MyKey = Object.keys(objecto)[init];
		var MyObj = Object.values(objecto)[init];
		//
		if( MyKey === 'classListAdd') {
			CreateNewElement.classList.add(MyObj)
		} else {
			if(Array.isArray(MyObj)) {
				CreateNewElement[MyKey](MyObj[0], MyObj[1])
			} else {
				CreateNewElement[MyKey] = MyObj
			}
			
		}
	}
	if(agregar !== '') {
		en[(agregar === 'after' ? 'after' : 'appendChild')](CreateNewElement)
	} else return CreateNewElement
}
/**
 * Funcion para controlar las cookies
 * https://es.javascript.info/cookie
*/
// Creamos cookie, dura 1 hs
function setCookie(name, value, options = {}) {
  	options = {
    	path: '/'
   };
  	if (options.expires instanceof Date) options.expires = options.expires.toUTCString();
  	let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  	for (let optionKey in options) {
    	updatedCookie += "; " + optionKey;
    	let optionValue = options[optionKey];
    	if (optionValue !== true) updatedCookie += "=" + optionValue;
  	}
  	document.cookie = updatedCookie;
}
function getCookie(name) {
  	let matches = document.cookie.match(new RegExp(
    	"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  	));
  	return matches ? decodeURIComponent(matches[1]) : undefined;
}
function deleteCookie(name) {
  	setCookie(name, "", {'max-age': -1})
}

// Creamos el script para los iconos
crearElemento('script', {src: "https://code.iconify.design/iconify-icon/1.0.0-beta.3/iconify-icon.min.js"}, 'after', app)

// Boton
crearElemento('small', {classListAdd: 'modo', innerHTML: '<kbd>Shift</kbd> + <kbd>D</kbd>'}, 'after', app)

//
const themeButton = document.querySelector('.modo');
themeButton.addEventListener('click', () => {
  	document.body.classList.toggle(oscuro)
  	localStorage.setItem('ModeDarkActive', getCurrentTheme())
})

const misredes = crearElemento('div', {classListAdd: 'redes'}, '')
const redes = {
	github: {
		url: 'https://github.com/joelmiguelvalente', 
		icono: 'line-md:github-loop'
	},
	linkedin: {
		url: 'https://www.linkedin.com/in/joelmiguelvalente', 
		icono: 'akar-icons:linkedin-box-fill'
	},
	discord: {
		url: 'https://discord.com/users/465203938900049920', 
		icono: 'line-md:discord-twotone'
	},
	twitter: {
		url: 'https://x.com/JvalenteM92', 
		icono: 'line-md:twitter-twotone'
	}
}
Object.values(redes).map( social => {
	enlace = crearElemento('a', {href: social.url, target: "_blank", rel: "noreferrer"}, '')
	icono = crearElemento('iconify-icon', {setAttribute: ["icon", social.icono]}, 'appendChild', enlace)
	misredes.appendChild(enlace)
})
document.getElementById("redes").appendChild(misredes)
misredes.style.top = (misredes.clientHeight / app.clientHeight) + "px"

async function acceder() {
	// Redirecciona
	var CreateUrl = location.origin + location.pathname;
	var get = await fetch(CreateUrl + 'encriptador.html')
	var tipo = await get.text();
	document.getElementById("app").innerHTML = tipo
	document.body.className += " encript"
	// Creamos el script para los iconos
	crearElemento('script', {src: "js/encriptadores.js", id: "djs"}, 'after', app)
}

const obtenerEncriptadores = [].slice.call(document.querySelectorAll(".encriptadores"));
obtenerEncriptadores.map( encriptador => {
	encriptador.onclick = ex => {
		acceder()
		setCookie('encriptador', ex.target.id, { 'max-age': 3600 });
	}
})

if(getCookie('encriptador') !== '' && getCookie('encriptador') !== undefined) {
	acceder()
}