// Variables
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets');
let tweets = [];


// Event Listeners
eventListeners();
function eventListeners(){
  // Cuando el usuario agrega un nuevo tweet
  formulario.addEventListener('submit', agregarTweet);

  // Cuando el documento está listo
  document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos el array de tweets de local storage
    // Al usar el operador de comparación aqui nos permite asignar un valor u otro en función de si obtenemos null
    tweets = JSON.parse(localStorage.getItem('tweets')) || [];

    crearHTML();
  });
}


// Funciones
function agregarTweet(e){
  e.preventDefault();

  // Textarea en el que el usuario escribe
  const tweet = document.querySelector('#tweet').value;

  // Validación del textarea
  if(tweet === ''){
    mostrarError('No has escrito nada... Debes agregar una nota para guardarla.');

    // Este return previene que se sigan ejecutando mas líneas de código después de la validación, solo funciona en este if porque está dentro de una función
    return;
  }

  // La función date.now() devuelve la cantidad de segundos transcurridos desde el 01/01/1970
  const tweetObj = {
    id: Date.now(),
    tweet // Si la clave y la variable en la que se va a pasar el valor se llaman igual (pej: tweet: tweet), se puede dejar solo una vez
  }

  // Añadir al arreglo de tweets
  tweets = [...tweets, tweetObj];
  
  // Vams a crear el HTML
  crearHTML();

  // Reiniciar el formulario
  formulario.reset();
}

// Mostrar mensaje de error
function mostrarError(error){
  const existeAlerta = document.querySelector('.error');

  if(!existeAlerta){
    const mensajeError = document.createElement('p');
    mensajeError.textContent = error;
    mensajeError.classList.add('error');

    // Insertarlo en el contenido
    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensajeError);

    // Eliminar el mensaje de error
    setTimeout(() => {
      mensajeError.remove();
    }, 3000);
  } 

}

// Función para crear el HTML que contiene los tweets
function crearHTML(){
  // Colocamos la función de limpiar HTML aqui para que limpie la lista de tweets antes de agregar el arreglo con el tweet nuevo
  limpiarHTML();

  if(tweets.length > 0){
    tweets.forEach( tweet => {
      // Agregar botón eliminar
      const btnEliminar = document.createElement('a');
      btnEliminar.classList.add('borrar-tweet');
      btnEliminar.textContent = 'X';

      const separador = document.createElement('hr');
      separador.classList.add('separador');

      // Añadir la función de eliminar. Le agregamos una función porque debemos pasarle un parámetro (el id del tweet a eliminar)
      btnEliminar.onclick = () => {
         borrarTweet(tweet.id);
      };

      // Crear el HTML
      const li = document.createElement('li');

      // Añadir el texto
      li.innerText = tweet.tweet;

      const fecha = new Date(tweet.id);

      const fechaNota = document.createElement('p');
      fechaNota.classList.add('fecha');
      fechaNota.innerHTML = `
        ${(fecha.getDate()<10?'0':'') + fecha.getDate()}/${((parseInt(fecha.getUTCMonth())+1)<10?'0':'') + (parseInt(fecha.getUTCMonth())+1)}/${fecha.getFullYear()}
        <br>
        ${(fecha.getHours()<10?'0':'') + fecha.getHours()}:${(fecha.getMinutes()<10?'0':'') + fecha.getMinutes()}:${(fecha.getSeconds()<10?'0':'') + fecha.getSeconds()}
      `;

      // Asignar el botón de eliminar
      li.appendChild(btnEliminar);
      li.appendChild(fechaNota);

      // Agregar en el HTML a lista-tweets
      listaTweets.appendChild(li);
      listaTweets.appendChild(separador);
    });
  }

  sincronizarStorage();
}

// Agrega los tweets actuales a local storage
function sincronizarStorage(){
  localStorage.setItem('tweets', JSON.stringify(tweets));
}

// Limpiar el HTML (Con la opción que es buena para el performance)
function limpiarHTML(){
  while(listaTweets.firstChild){
    listaTweets.removeChild(listaTweets.firstChild);
  }
}

// Eliminar tweet
function borrarTweet(id){
  // Para eliminar vamos a utilizar el array Method .filter()
  tweets = tweets.filter(tweet => tweet.id !== id);
  crearHTML();
}