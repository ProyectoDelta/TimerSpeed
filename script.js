//variables

let contador = 15;
let intervalo = null;
let iniciado = false;
let espaciados = 0;
let tiempoHecho;
const maxUltimosTiempos = 12;
const maxUltimos5Tiempos = 5;
let ultimosTiempos = [];

//variables con el DOM

const decimalesInput = document.getElementById("decimales");
let decimales = decimalesInput.value;
let cuenta = parseFloat(0).toFixed(decimales);
const tiemposTotales = document.querySelector(".total-de-tiempos  .tiemposRealizados");
const tiempoDisplay = document.querySelector(".tiempo");
const avg5Elemento = document.querySelector(".Avg5");
const inspeccionSi = document.getElementById("inspeccionSi");
const inspeccionar = document.querySelector(".inspeccion");
const avgTotalElemento = document.querySelector(".AvgT");
const avg12Elemento = document.querySelector(".Avg12");
const configBtn = document.querySelector(".bxs-cog");
const salirConfiguracionBtn = document.querySelector(".bx-x");
const elementosLista = document.querySelectorAll('.rectangulo-grande');
const colorFondoInput = document.getElementById('color-de-fondo');
const colorTextoInput = document.getElementById('color-del-texto');
const colorBordesInput = document.getElementById('color-de-los-bordes');
let input = document.getElementById('imgInput');
const quitarImagenDeFondo = document.querySelector(".quitar-imagen-de-fondo");
const timerNumeros = document.querySelector(".tiempo");
const configurarTamañoTimerInput = document.querySelector(".configurar-tamaño-fuente-timer");
let configurarTamañoTimer = configurarTamañoTimerInput.value;
const scrambleLetras = document.querySelector("#scramble");
const eventSelect = document.getElementById('event-select');
let categoriaValue = eventSelect.value;
const configurarTamañoScrambleInput = document.querySelector(".configurar-tamaño-fuente-scramble");
let configurarTamañoScramble = configurarTamañoScrambleInput.value;

// eventos inputs

decimalesInput.addEventListener("input", function () {
  decimales = this.value;
  obtenerIncremento();
});

//funciones con el DOMContentLoaded

document.addEventListener("DOMContentLoaded", function () {
  decimalesInput.value = decimales;
  tiempoDisplay.textContent = parseFloat(0).toFixed(decimales);
  decimalesInput.addEventListener("input", function () {
    decimales = Number(decimalesInput.value);
    tiempoDisplay.textContent = parseFloat(tiempoDisplay.textContent).toFixed(decimales);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  recuperarEstiloYColoresDesdeLocalStorage();
  recuperarTamañosDesdeLocalStorage();
  ajustarTamañoTimerSegunAnchoPantalla();
  actualizarTamañoScramble();
  ajustarTamañoTimerSegunAnchoPantalla();
});

document.addEventListener("DOMContentLoaded", function () {
  let tiemposGuardados = JSON.parse(localStorage.getItem("tiempos"));

  // Si hay tiempos guardados, los agregamos a la lista de tiempos
  if (tiemposGuardados) {
    tiemposGuardados.forEach(tiempo => {
      agregarElementoTiempo(tiempo);
    });
  }
});

document.addEventListener("DOMContentLoaded", ()=>{
  configurarTamañoTimer = configurarTamañoTimerInput.value;
  timerNumeros.style.fontSize = configurarTamañoTimer + "px";
  if (configurarTamañoTimer > tamañoMaximoTimer) {
    timerNumeros.style.fontSize = tamañoMaximoTimer;
    configurarTamañoTimerInput.value = tamañoMaximoTimer;
  } else if (configurarTamañoTimer < tamañoMinimoTimer) {
    timerNumeros.style.fontSize = tamañoMinimoTimer;
    configurarTamañoTimerInput.value = tamañoMinimoTimer;
  }

  configurarTamañoTimer = configurarTamañoTimerInput.value;
  timerNumeros.style.fontSize = configurarTamañoTimer + "px";
  if (configurarTamañoTimer > tamañoMaximoTimer) {
    timerNumeros.style.fontSize = tamañoMaximoTimer;
    configurarTamañoTimerInput.value = tamañoMaximoTimer;
  } else if (configurarTamañoTimer < tamañoMinimoTimer) {
    timerNumeros.style.fontSize = tamañoMinimoTimer;
    configurarTamañoTimerInput.value = tamañoMinimoTimer;
  }

});
//funciones

let obtenerIntervaloTiempo = () => {
  let intervalo;
  switch (decimales) {
    case 1:
      intervalo = 100;
      break;
    case 2:
      intervalo = 10;
      break;
    case 3:
      intervalo = 1;
      break;
    case 0:
      intervalo = 1000;
      break;
    default:
      intervalo = 100; // Set a default interval for unexpected values
  }
  return intervalo;
};

let obtenerIncremento = () => {
  let incremento;
  switch (decimales) {
    case 0:
      incremento = 1;
      break;
    case 1:
      incremento = 0.1;
      break;
    case 2:
      incremento = 0.01;
      break;
    case 3:
      incremento = 0.001;
      break;
    default:
      incremento = 0.1;
  }
  return incremento;
};

const agregarElementoTiempo = (valor) => {
  const nuevoElementoTiempo = document.createElement("div");
  nuevoElementoTiempo.className = "elemento-tiempo";
 
  // Crear un ícono con la clase de Boxicons
  const icono = document.createElement("i");
  icono.className = "bx bx-x x-especial";
  icono.addEventListener("click", () => eliminarElementoTiempo(nuevoElementoTiempo));

  // Convertir a minutos y segundos si supera los 60 segundos
  if (valor >= 60) {
    const minutos = Math.floor(valor / 60);
    const segundos = valor % 60;
    const segundosFormateados = segundos < 10 ? `0${segundos.toFixed(decimales)}` : segundos.toFixed(decimales);
    const minutosFormateados = minutos.toString().padStart(2, '0');
    nuevoElementoTiempo.textContent = `${minutosFormateados}:${segundosFormateados}`;
  } else {
    const segundosFormateados = valor < 10 ? `0${valor.toFixed(decimales)}` : valor.toFixed(decimales);
    nuevoElementoTiempo.textContent = `${segundosFormateados}`;
  }

  // Agregar el ícono y el nuevo elemento a la lista
  nuevoElementoTiempo.appendChild(icono);
  const listaTiempos = document.querySelector(".lista-de-tiempos");
  listaTiempos.appendChild(nuevoElementoTiempo);

  // Mantener solo los últimos tiempos
  ultimosTiempos.push(valor);

  localStorage.setItem("tiempos", JSON.stringify(ultimosTiempos));

  tiemposTotales.innerText = contarTiempos();

};

const eliminarElementoTiempo = (elementoTiempo) => {
  // Eliminar el elemento de la lista
  const listaTiempos = document.querySelector(".lista-de-tiempos");
  listaTiempos.removeChild(elementoTiempo);

  // Eliminar el valor de la lista de últimos tiempos
  const valorElementoTiempo = elementoTiempo.textContent;
  const indice = ultimosTiempos.indexOf(parseFloat(valorElementoTiempo));
  if (indice !== -1) {
    ultimosTiempos.splice(indice, 1);

  }
  localStorage.setItem("tiempos", JSON.stringify(ultimosTiempos));
  tiemposTotales.innerText = contarTiempos();
  actualizarPromedioTotal();
  actualizarPromedioUltimos5();
  actualizarPromedioUltimos12();
  actualizarMejorTiempo();
  actualizarPeorTiempo(parseFloat(valorElementoTiempo));
};

const contarTiempos = () => {
  return ultimosTiempos.length;
};

const calcularPromedio = () => {
  const cantidadElementos = ultimosTiempos.length;

  // Verificar si hay al menos 3 elementos para calcular el promedio
  if (cantidadElementos >= 3) {
    // Ordenar los tiempos
    const tiemposOrdenados = ultimosTiempos.sort((a, b) => a - b);

    // Excluir el mejor y el peor tiempo
    const tiemposIntermedios = tiemposOrdenados.slice(1, -1);

    const total = tiemposIntermedios.reduce((acc, tiempo) => acc + tiempo, 0);
    const promedio = total / tiemposIntermedios.length;

    // Redondear el promedio a 2 decimales
    const promedioRedondeado = Math.round(promedio * 100) / 100;

    return promedioRedondeado;
  } else {
    return 0; // Devolver 0 si no hay suficientes elementos
  }
};

const actualizarPromedioTotal = () => {
  const promedioTotal = calcularPromedio();
  const promedioFormateado = promedioTotal > 60 ? convertirASegundosYMinutos(promedioTotal) : promedioTotal.toFixed(decimales);
  avgTotalElemento.innerHTML = promedioFormateado;
};
const calcularPromedioUltimos5 = () => {
  if (ultimosTiempos.length >= 5) {
    const ultimos5Tiempos = ultimosTiempos.slice(-5);

    const tiemposOrdenados = ultimos5Tiempos.slice().sort((a, b) => a - b);

    const tiemposIntermedios = tiemposOrdenados.slice(1, -1);

    const total = tiemposIntermedios.reduce((acc, tiempo) => acc + tiempo, 0);

    const promedio = total / (ultimosTiempos.length - 2);

    const promedioRedondeado = Math.round(promedio * 100) / 100;

    return promedioRedondeado;
  } else {
    return 0;
  }
};

const actualizarPromedioUltimos5 = () => {
  const promedio5 = calcularPromedioUltimos5();

  if (promedio5 !== null) {
    const promedioFormateado = promedio5 > 60 ? convertirASegundosYMinutos(promedio5) : promedio5.toFixed(decimales);
    avg5Elemento.innerHTML = promedioFormateado;
  } else {
    avg5Elemento.innerHTML = "0";
  }
};

const calcularPromedioUltimos12 = () => {
  if (ultimosTiempos.length >= 12) {
    const ultimos12Tiempos = ultimosTiempos.slice(-12);
    const tiemposOrdenados = ultimos12Tiempos.sort((a, b) => a - b); 
    const tiemposIntermedios = tiemposOrdenados.slice(1, -1);

    const total = tiemposIntermedios.reduce((acc, tiempo) => acc + tiempo, 0);
    const promedio = total / tiemposIntermedios.length;

    const promedioRedondeado = promedio.toFixed(decimales);

    return promedioRedondeado;
  } else {
    return null;
  }
};

const actualizarMejorTiempo = () => {
  const mejorTiempoElemento = document.querySelector(".tiempo-mas-rapido");
  const tiemposElementos = document.querySelectorAll(".elemento-tiempo");

  const tiemposRegistrados = Array.from(tiemposElementos)
    .map(tiempo => tiempo.textContent)
    .filter(tiempo => tiempo !== "DNF")
    .map(tiempo => convertirATiempoEnSegundos(tiempo))
    .filter(tiempo => !isNaN(tiempo))
    .sort((a, b) => a - b);

  if (tiemposRegistrados.length > 0) {
    const mejorTiempo = tiemposRegistrados[0];

    if (mejorTiempo > 0) {
      mejorTiempoElemento.textContent = mejorTiempo > 60 ? convertirASegundosYMinutos(mejorTiempo) : mejorTiempo.toFixed(decimales);
    } else if (tiemposRegistrados.length >= 2) {
      const segundoMejorTiempo = tiemposRegistrados[1];
      if (segundoMejorTiempo > 0 || isNaN(segundoMejorTiempo)) {
        mejorTiempoElemento.textContent = segundoMejorTiempo.toFixed(decimales);
      } else {
        mejorTiempoElemento.textContent = "0";
      }
    } else {
      mejorTiempoElemento.textContent = "0";
    }
  } else {
    mejorTiempoElemento.textContent = "0";
  }
};

function convertirATiempoEnSegundos(tiempo) {
  const partes = tiempo.split(":");
  if (partes.length === 2) {
    return parseFloat(partes[0]) * 60 + parseFloat(partes[1]);
  } else {
    return parseFloat(tiempo);
  }
}

function convertirASegundosYMinutos(tiempoEnSegundos) {
  const minutos = Math.floor(tiempoEnSegundos / 60);
  const segundos = (tiempoEnSegundos % 60).toFixed(decimales);
  const segundosConCeros = segundos.padStart((parseInt(decimales) + 3), '0'); // Asegura que los segundos siempre tengan dos dígitos
  return minutos + ":" + segundosConCeros;
}

const actualizarPeorTiempo = () => {
  const peorTiempoElemento = document.querySelector(".tiempo-mas-lento");
  peorTiempoElemento.textContent = "0";

  // Recalcular el peor tiempo
  for (const tiempo of ultimosTiempos) {
    if (isNaN(tiempo) || tiempo <= 0) {
      continue;
    }

    const peorTiempoActual = parseFloat(peorTiempoElemento.textContent);
    if (tiempo > peorTiempoActual || isNaN(peorTiempoActual)) {
      const tiempoFormateado = tiempo > 60 ? convertirASegundosYMinutos(tiempo) : tiempo.toFixed(decimales);
      peorTiempoElemento.textContent = tiempoFormateado;
    }
  }
};

const actualizarPromedioUltimos12 = () => {
  const promedio12 = calcularPromedioUltimos12();

  // Verificar si hay suficientes tiempos para calcular el promedio
  if (promedio12 !== null) {
    const promedioNumerico = parseFloat(promedio12); // Convierte a número

    const promedioFormateado = promedioNumerico > 60
      ? convertirASegundosYMinutos(promedioNumerico)
      : promedioNumerico.toFixed(decimales);

    avg12Elemento.innerHTML = promedioFormateado;
  } else {
    avg12Elemento.innerHTML = "0";
  }
};
const mostrarInspeccion = () => {
  inspeccionar.style.display = "block";
  tiempoDisplay.style.display = "none";
  inspeccionar.textContent = contador;
  iniciado = true;
  intervalo = setInterval(() => {
    contador--;
    if (contador >= 0) {
      inspeccionar.textContent = contador;
    } else {
      detenerContador();
    }
  }, 1000);
};

const detenerContador = () => {
  clearInterval(intervalo);
  contador = 15;
  iniciado = false;
  inspeccionar.style.display = "none";
};

const empezar = () => {
  cuenta = 0;
  tiempoDisplay.style.display = "block";

  id = setInterval(() => {
    const incremento = obtenerIncremento();

    cuenta += incremento;
    cuenta = parseFloat(cuenta.toFixed(decimales));

    // Convertir a minutos y segundos si supera los 60 segundos
    if (cuenta >= 60) {
      const minutos = Math.floor(cuenta / 60);
      const segundos = cuenta % 60;
      const segundosFormateados = segundos < 10 ? `0${segundos.toFixed(decimales)}` : segundos.toFixed(decimales);
      const minutosFormateados = minutos.toString().padStart(2, '0');
      tiempoDisplay.textContent = `${minutosFormateados}:${segundosFormateados}`;
    } else {
      const segundosFormateados = cuenta < 10 ? `0${cuenta.toFixed(decimales)}` : cuenta.toFixed(decimales);
      tiempoDisplay.textContent = `${segundosFormateados}`;
    }

    tiempoHecho = cuenta;

  }, obtenerIntervaloTiempo());
};

const detener = () => {
  clearInterval(id);
  espaciados = -1;
  if (cuenta >= 0.1) {
    tiempoHecho = cuenta;
    agregarElementoTiempo(tiempoHecho);
    actualizarPromedioTotal();
    actualizarPromedioUltimos5();
    actualizarPromedioUltimos12();
    actualizarMejorTiempo();
    actualizarPeorTiempo(tiempoHecho);
    window.generateScramble();
  } else {
    console.log("IGNORADO");
  }


};

const keydownHandler = (e) => {
  if (e.code === "Space") {
    espaciados++;
    if (inspeccionSi.checked) {
      if (espaciados === 1) {
        mostrarInspeccion();
      } else if (espaciados === 2) {
        empezar();
        detenerContador();
      } else if (espaciados === 0) {
        tiempoDisplay.textContent = parseFloat(0).toFixed(decimales);
      } else {
        detener();
      }
    } else {
      if (espaciados === 1) {
        empezar();
      } else if (espaciados === 2) {
        detener();
      } else if (espaciados === 0) {
        tiempoDisplay.textContent = parseFloat(0).toFixed(decimales);
      }
    }
  }
};
const clickHandler = () => {
  espaciados++;
  if (inspeccionSi.checked) {
    if (espaciados === 1) {
      mostrarInspeccion();
    } else if (espaciados === 2) {
      empezar();
      detenerContador();
    } else if (espaciados === 0) {
      tiempoDisplay.textContent = parseFloat(0).toFixed(decimales);
    } else {
      detener();
    }
  } else {
    if (espaciados === 1) {
      empezar();
    } else if (espaciados === 2) {
      detener();
    } else if (espaciados === 0) {
      tiempoDisplay.textContent = parseFloat(0).toFixed(decimales);
    }
  }
};
if(window.innerWidth > 767){
  document.addEventListener('keydown', keydownHandler);
}else{
  tiempoDisplay.addEventListener("click", clickHandler);
}


inspeccionSi.addEventListener('change', () => {
  if (!inspeccionSi.checked) {
    detenerContador();
  }
});

document.querySelector("#generate-scramble").addEventListener("keydown", (e) => {
  e.preventDefault();
});

// boton configuracion

configBtn.addEventListener("click", () => {
  document.querySelector(".seccion-de-configuraciones").style.display = "block";
  document.querySelector(".seccion-principal").style.display = "none";
  document.querySelector(".seleccionar-colores").style.display = "none";
  document.querySelector(".bxs-cog").style.display = "none";
});

salirConfiguracionBtn.addEventListener("click", () => {
  document.querySelector(".seccion-de-configuraciones").style.display = "none";
  document.querySelector(".bxs-cog").style.display = "inline-block";
  document.querySelector(".seccion-principal").style.display = "block";
});

// Configuracion

// Colores predeterminados

// Añadir un manejador de clic a cada elemento
elementosLista.forEach(elemento => {
  elemento.addEventListener("click", function () {
    elementosLista.forEach(el => el.classList.remove('seleccionado'));
    this.classList.add('seleccionado');
    if (this.id === "blancoNegro") {
      document.body.style.setProperty("--color-background", "#ffffff")
      document.body.style.setProperty("--color-textos", "#000000");
      document.body.style.setProperty("--color-bordes", "#000000");
      document.body.style.setProperty("--color-barra", "#000000");
      document.body.style.setProperty("--color-de-fondo-categoria", "#ffffff")
    } else if (this.id === "Futurista") {
      document.body.style.setProperty("--color-background", "#1b1b1b")
      document.body.style.setProperty("--color-textos", "#19b63b");
      document.body.style.setProperty("--color-bordes", "#19b63b");
      document.body.style.setProperty("--color-barra", "#19b63b");
      document.body.style.setProperty("--color-de-fondo-categoria", "1b1b1b")
    } else {
      document.body.style.setProperty("--color-background", "#1b1b1b")
      document.body.style.setProperty("--color-textos", "rgb(240,248,255)");
      document.body.style.setProperty("--color-bordes", "rgb(240,248,255)");
      document.body.style.setProperty("--color-barra", "rgb(240,248,255)");
      document.body.style.setProperty("--color-de-fondo-categoria", "#1b1b1b")
    }

    // Mostrar u ocultar la selección de colores
    const botonPersonalizar = document.getElementById("personalizar");
    botonPersonalizar.addEventListener("click", () => {
      document.body.style.setProperty("--color-background", "#ffffff")
      document.body.style.setProperty("--color-textos", "#000000");
      document.body.style.setProperty("--color-bordes", "#000000");
      document.body.style.setProperty("--color-barra", "#000000");
      document.body.style.setProperty("--color-de-fondo-categoria", "#ffffff")
    });
    if (botonPersonalizar.classList.contains("seleccionado")) {
      document.querySelector(".seleccionar-colores").style.display = "block";
    } else {
      document.querySelector(".seleccionar-colores").style.display = "none";
    }
  });
});

// Colores personalizados

// Función para manejar el cambio en los colores

function handleColorChange() {
  // Obtener los valores de los colores
  const colorFondo = colorFondoInput.value;
  const colorTexto = colorTextoInput.value;
  const colorBordes = colorBordesInput.value;

  // Cambiar los colores
  document.body.style.setProperty("--color-background", colorFondo);
  document.body.style.setProperty("--color-textos", colorTexto);
  document.body.style.setProperty("--color-bordes", colorBordes);
  document.body.style.setProperty("--color-barra", colorBordes);
  document.body.style.setProperty("--color-de-fondo-categoria", colorFondo);
}

// Agregar eventos de cambio a los elementos de entrada de color

colorFondoInput.addEventListener('change', handleColorChange);
colorTextoInput.addEventListener('change', handleColorChange);
colorBordesInput.addEventListener('change', handleColorChange);

//subir imagen de fondo

input.addEventListener('change', function () {
  let file = this.files[0];
  let reader = new FileReader();
  reader.onloadend = function () {
    // La imagen se establece como fondo aquí
    document.body.style.backgroundImage = 'url(' + reader.result + ')';
  }
  if (file) {
    reader.readAsDataURL(file);
  }
});

quitarImagenDeFondo.addEventListener('click', function () {
  document.body.style.backgroundImage = ''; // Elimina la imagen de fondo al hacer clic
});

//tamaños de fuentes

//timer


let tamañoMaximoTimer;
let tamañoMinimoTimer;

function ajustarTamañoTimerSegunAnchoPantalla() {
  const anchoPantalla = window.innerWidth;
  if(anchoPantalla <= 767){
    tamañoMaximoTimer = 110;
    tamañoMinimoTimer = 15;
  }else if(anchoPantalla <= 1023){
    tamañoMaximoTimer = 200;
    tamañoMinimoTimer = 30;
  }else if(anchoPantalla <= 1279){
    tamañoMaximoTimer = 250;
    tamañoMinimoTimer = 30;
  }else{
    tamañoMaximoTimer = 300;
    tamañoMinimoTimer = 30;
  }
}

configurarTamañoTimerInput.addEventListener("input", function () {

  configurarTamañoTimer = configurarTamañoTimerInput.value;
  timerNumeros.style.fontSize = configurarTamañoTimer + "px";
  if (configurarTamañoTimer > tamañoMaximoTimer) {
    timerNumeros.style.fontSize = tamañoMaximoTimer;
    configurarTamañoTimerInput.value = tamañoMaximoTimer;
  } else if (configurarTamañoTimer < tamañoMinimoTimer) {
    timerNumeros.style.fontSize = tamañoMinimoTimer;
    configurarTamañoTimerInput.value = tamañoMinimoTimer;
  }

});
window.addEventListener("resize", ajustarTamañoTimerSegunAnchoPantalla);

//scramble
let tamañoMinimoScramble;
let tamañoMaximoScramble;
function actualizarTamañoScramble() {
  configurarTamañoScramble = parseFloat(configurarTamañoScrambleInput.value);
  scrambleLetras.style.fontSize = configurarTamañoScramble + "px";
  const anchoPantalla = window.innerWidth;

  switch (categoriaValue) {
    case "222":
    case "333":
    case "pyram":
    case "skewb":
    case "sq1":
      if(anchoPantalla <= 767){
        tamañoMaximoScramble = 25;
        tamañoMinimoScramble= 15;
      }else if(anchoPantalla <= 1023){
        tamañoMaximoScramble = 35;
        tamañoMinimoScramble = 20;
      }else if(anchoPantalla <= 1279){
        tamañoMaximoScramble = 45;
        tamañoMinimoScramble = 20;
      }else{
        tamañoMaximoScramble = 50;
        tamañoMinimoScramble = 20;
      }
      break;
    case "444":
      if(anchoPantalla <= 767){
        tamañoMaximoScramble = 20;
        tamañoMinimoScramble= 10;
      }else if(anchoPantalla <= 1023){
        tamañoMaximoScramble = 30;
        tamañoMinimoScramble = 15;
      }else if(anchoPantalla <= 1279){
        tamañoMaximoScramble = 35;
        tamañoMinimoScramble = 20;
      }else{
        tamañoMaximoScramble = 40;
        tamañoMinimoScramble = 20;
      }
      break;
    case "555":
      if(anchoPantalla <= 767){
        tamañoMaximoScramble = 15;
        tamañoMinimoScramble= 10;
      }else if(anchoPantalla <= 1023){
        tamañoMaximoScramble = 20;
        tamañoMinimoScramble = 15;
      }else if(anchoPantalla <= 1279){
        tamañoMaximoScramble = 30;
        tamañoMinimoScramble = 20;
      }else{
        tamañoMaximoScramble = 30;
        tamañoMinimoScramble = 20;
      }
      break;
    case "666":
    case "minx":
      if(anchoPantalla <= 767){
        tamañoMaximoScramble = 15;
        tamañoMinimoScramble= 5;
      }else if(anchoPantalla <= 1023){
        tamañoMaximoScramble = 18;
        tamañoMinimoScramble = 10;
      }else if(anchoPantalla <= 1279){
        tamañoMaximoScramble = 25;
        tamañoMinimoScramble = 20;
      }else{
        tamañoMaximoScramble = 25;
        tamañoMinimoScramble = 20;
      }
      break;
    case "777":
      if(anchoPantalla <= 767){
        tamañoMaximoScramble = 14;
        tamañoMinimoScramble= 7;
      }else if(anchoPantalla <= 1023){
        tamañoMaximoScramble = 16;
        tamañoMinimoScramble = 10;
      }else if(anchoPantalla <= 1279){
        tamañoMaximoScramble = 18;
        tamañoMinimoScramble = 14;
      }else{
        tamañoMaximoScramble = 20;
        tamañoMinimoScramble = 15;
      }
      break;
  }

  if (configurarTamañoScramble > tamañoMaximoScramble) {
    scrambleLetras.style.fontSize = tamañoMaximoScramble + "px";
    configurarTamañoScrambleInput.value = tamañoMaximoScramble;
  } else if (configurarTamañoScramble < tamañoMinimoScramble) {
    scrambleLetras.style.fontSize = tamañoMinimoScramble + "px";
    configurarTamañoScrambleInput.value = tamañoMinimoScramble;
  }

}

configurarTamañoScrambleInput.addEventListener("input", actualizarTamañoScramble);

// Agrega un evento de cambio al elemento de selección para actualizar categoriaValue

eventSelect.addEventListener("change", function () {
  categoriaValue = eventSelect.value;
  actualizarTamañoScramble();
});
// Función para guardar el estilo y los colores en localStorage

function guardarEstiloYColoresEnLocalStorage() {
  const estiloSeleccionado = document.querySelector('.rectangulo-grande.seleccionado')?.id;
  const colorFondo = document.body.style.getPropertyValue("--color-background");
  const colorTexto = document.body.style.getPropertyValue("--color-textos");
  const colorBordes = document.body.style.getPropertyValue("--color-bordes");

  localStorage.setItem("estiloSeleccionado", estiloSeleccionado);
  localStorage.setItem("colorFondo", colorFondo);
  localStorage.setItem("colorTexto", colorTexto);
  localStorage.setItem("colorBordes", colorBordes);
}

// Llama a la función cuando el color cambia o se selecciona un estilo

colorFondoInput.addEventListener('change', guardarEstiloYColoresEnLocalStorage);
colorTextoInput.addEventListener('change', guardarEstiloYColoresEnLocalStorage);
colorBordesInput.addEventListener('change', guardarEstiloYColoresEnLocalStorage);

elementosLista.forEach(elemento => {
  elemento.addEventListener("click", function () {
    elementosLista.forEach(el => el.classList.remove('seleccionado'));
    this.classList.add('seleccionado');
    guardarEstiloYColoresEnLocalStorage();

    // ... (resto del código para aplicar los estilos)
  });
});

// Función para recuperar el estilo y los colores desde localStorage

function recuperarEstiloYColoresDesdeLocalStorage() {
  const estiloGuardado = localStorage.getItem("estiloSeleccionado");
  const colorFondo = localStorage.getItem("colorFondo");
  const colorTexto = localStorage.getItem("colorTexto");
  const colorBordes = localStorage.getItem("colorBordes");

  // Aplicar el estilo guardado
  if (estiloGuardado) {
    const estiloElemento = document.getElementById(estiloGuardado);
    if (estiloElemento) {
      elementosLista.forEach(el => el.classList.remove('seleccionado'));
      estiloElemento.classList.add('seleccionado');
    }
  }

  // Aplicar los colores guardados
  if (colorFondo) document.body.style.setProperty("--color-background", colorFondo);
  if (colorTexto) document.body.style.setProperty("--color-textos", colorTexto);
  if (colorBordes) document.body.style.setProperty("--color-bordes", colorBordes);
}

// Función para guardar el tamaño del timer y del scramble en localStorage

function guardarTamañosEnLocalStorage() {
  const tamañoTimer = parseFloat(configurarTamañoTimerInput.value);
  const tamañoScramble = parseFloat(configurarTamañoScrambleInput.value);

  localStorage.setItem("tamañoTimer", tamañoTimer);
  localStorage.setItem("tamañoScramble", tamañoScramble);
}

// Llama a la función cuando el tamaño cambia

configurarTamañoTimerInput.addEventListener('input', guardarTamañosEnLocalStorage);
configurarTamañoScrambleInput.addEventListener('input', guardarTamañosEnLocalStorage);

// Función para recuperar el tamaño del timer y del scramble desde localStorage

function recuperarTamañosDesdeLocalStorage() {
  const tamañoTimer = localStorage.getItem("tamañoTimer");
  const tamañoScramble = localStorage.getItem("tamañoScramble");

  // Aplicar el tamaño del timer guardado
  if (tamañoTimer) {
    timerNumeros.style.fontSize = tamañoTimer + "px";
    configurarTamañoTimerInput.value = tamañoTimer;
  }

  // Aplicar el tamaño del scramble guardado
  if (tamañoScramble) {
    scrambleLetras.style.fontSize = tamañoScramble + "px";
    configurarTamañoScrambleInput.value = tamañoScramble;
  }
}

// media queries 

