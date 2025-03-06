const sectionReiniciar = document.getElementById("boton-reinciar");
const sectionVidas = document.getElementById("vidas");
const botonMascotaJugador = document.getElementById("boton-mascotas");
const botonFuego = document.getElementById("boton-fuego");
const botonAgua = document.getElementById("boton-agua");
const botonTierra = document.getElementById("boton-tierra");
const botonReiniciar = document.getElementById("boton-reinciar");

///////

const sectionSeleccionarMascota = document.getElementById(
  "seleccionar-mascota"
);

const spanMascotaJugador = document.getElementById("mascota-jugador");

const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
/////////

const spanMascotaEnemigo = document.getElementById("mascota-enemigo");

/////////

const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");

//////////

const sectionMensaje = document.getElementById("resultado");
const ataqueDelJugador = document.getElementById("ataqueJugador");
const ataqueDelEnemigo = document.getElementById("ataqueEnemigo");
const contenedorTarjetas = document.getElementById("contenedor-tarjetas");

////////////

const contenedorAtaques = document.getElementById("contendor-ataques");

////////////

const sectionVerMapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");

////////////

let mokepones = [];
let mokeponesEnemigos = [];

let jugadorId = null;
let ataqueJugador;
let ataqueEnemigo;
let opcionDeMokepones;
let inputTipoge;
let inputCapipego;
let inputRatigueta;
let mascotaJugador;
let vidasJugador = 3;
let vidasEnemigo = 3;
let lienzo = mapa.getContext("2d");
let intervalo;
let mapaBackground = new Image();
mapaBackground.src = "./assets/mokemap.webp";
const baseWidth = 800;
const baseHeight = 600;
let alturaBuscada;
let anchoDelMapa = window.innerWidth - 20;
const anchoMaxMapa = 800;

if (anchoDelMapa > anchoMaxMapa) {
  anchoDelMapa = anchoMaxMapa - 20;
}

alturaBuscada = (anchoDelMapa * 600) / 800;

mapa.width = anchoDelMapa;
mapa.height = alturaBuscada;

class Mokepon {
  constructor(nombre, foto, vida, fotoMapa, x = 10, y = 10) {
    this.nombre = nombre;
    this.foto = foto;
    this.vida = vida;
    this.ataques = [];
    this.x = x + 50;
    this.y = y + 50;
    this.ancho = 50;
    this.alto = 50;
    this.mapaFoto = new Image();
    this.mapaFoto.src = fotoMapa;
    this.velocidadX = 0;
    this.velocidadY = 0;
  }

  pintarMokepon() {
    let xEscalado = (this.x * mapa.width) / baseWidth;
    let yEscalado = (this.y * mapa.height) / baseHeight;
    lienzo.drawImage(
      this.mapaFoto,
      xEscalado,
      yEscalado,
      this.ancho,
      this.alto
    );
  }
}

let tipoge = new Mokepon(
  "Tipoge",
  "./assets/mokepons_mokepon_hipodoge_attack.png",
  5,
  "./assets/hipodoge.png"
);

let capipego = new Mokepon(
  "Capipego",
  "./assets/mokepons_mokepon_capipepo_attack.png",
  5,
  "./assets/capipepo.png"
);

let ratigueta = new Mokepon(
  "Ratigueta",
  "./assets/mokepons_mokepon_ratigueya_attack.png",
  5,
  "./assets/ratigueya.png"
);

let tipogeEnemigo = new Mokepon(
  "Tipoge",
  "./assets/mokepons_mokepon_hipodoge_attack.png",
  5,
  "./assets/hipodoge.png",
  500,
  180
);

let capipegoEnemigo = new Mokepon(
  "Capipego",
  "./assets/mokepons_mokepon_capipepo_attack.png",
  5,
  "./assets/capipepo.png",
  150,
  230
);

let ratiguetaEnemigo = new Mokepon(
  "Ratigueta",
  "./assets/mokepons_mokepon_ratigueya_attack.png",
  5,
  "./assets/ratigueya.png",
  350,
  360
);

mokepones.push(tipoge, capipego, ratigueta);

/////////

function iniciarJuego() {
  sectionSeleccionarAtaque.style.display = "none";
  sectionVerMapa.style.display = "none";

  mokepones.forEach((mokepon) => {
    opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre} />
        <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
          <p>${mokepon.nombre}</p>
          <div class="img"><img src=${mokepon.foto} alt=${mokepon.nombre}></div>    
        </label>`;

    contenedorTarjetas.innerHTML += opcionDeMokepones;

    inputTipoge = document.getElementById("Tipoge");
    inputCapipego = document.getElementById("Capipego");
    inputRatigueta = document.getElementById("Ratigueta");
  });
  sectionReiniciar.style.display = "none";
  sectionVidas.style.display = "none";

  botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);

  botonFuego.addEventListener("click", ataqueFuego);
  botonAgua.addEventListener("click", ataqueAgua);
  botonTierra.addEventListener("click", ataqueTierra);

  botonReiniciar.addEventListener("click", reiniciarJuego);

  unirseAlJuego();
}

function unirseAlJuego() {
  fetch("http://localhost:8080/unirse").then(function (res) {
    if (res.ok) {
      res.text().then(function (respuesta) {
        console.log(respuesta);
        jugadorId = respuesta;
      });
    }
  });
}

function seleccionarMascotaJugador() {
  if (inputTipoge.checked) {
    spanMascotaJugador.innerHTML = inputTipoge.id;
    mascotaJugador = inputTipoge.id;
  } else if (inputCapipego.checked) {
    spanMascotaJugador.innerHTML = inputCapipego.id;
    mascotaJugador = inputCapipego.id;
  } else if (inputRatigueta.checked) {
    spanMascotaJugador.innerHTML = inputRatigueta.id;
    mascotaJugador = inputRatigueta.id;
  } else {
    alert("No haz seleccionado a tu mascota");
    return;
  }
  sectionSeleccionarMascota.style.display = "none";
  sectionVerMapa.style.display = "flex";

  sectionVidas.style.display = "flex";

  iniciarMapa();
  pintarCanvas();
  seleccionarMascotaEnemigo();
  seleccionarMokepon(mascotaJugador);
}

function seleccionarMokepon(mascotaJugador) {
  fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mokepon: mascotaJugador,
    }),
  });
}

function seleccionarMascotaEnemigo() {
  let mascotaAleatoria = aleatorio(0, mokepones.length - 1);

  spanMascotaEnemigo.innerHTML = mokepones[mascotaAleatoria].nombre;
}

function ataqueFuego() {
  ataqueJugador = "Fuego 🔥";
  ataqueAleatorioEnemigo();
}

function ataqueAgua() {
  ataqueJugador = "Agua 💧";
  ataqueAleatorioEnemigo();
}

function ataqueTierra() {
  ataqueJugador = "Tierra 🌱";
  ataqueAleatorioEnemigo();
}

function ataqueAleatorioEnemigo() {
  let ataqueAleatorio = aleatorio(1, 3);

  if (ataqueAleatorio == 1) {
    ataqueEnemigo = "Fuego 🔥";
  } else if (ataqueAleatorio == 2) {
    ataqueEnemigo = "Agua 💧";
  } else {
    ataqueEnemigo = "Tierra 🌱";
  }
  combate();
}

function combate() {
  if (ataqueEnemigo == ataqueJugador) {
    resultado = "Empate 🤝";
  } else if (
    (ataqueJugador == "Fuego 🔥" && ataqueEnemigo == "Tierra 🌱") ||
    (ataqueJugador == "Agua 💧" && ataqueEnemigo == "Fuego 🔥") ||
    (ataqueJugador == "Tierra 🌱" && ataqueEnemigo == "Agua 💧")
  ) {
    resultado = "¡Ganaste! 🎉";
    vidasEnemigo--;
    spanVidasEnemigo.innerHTML = vidasEnemigo;
  } else {
    resultado = "Perdiste 😢";
    vidasJugador--;
    spanVidasJugador.innerHTML = vidasJugador;
  }
  createMensaje();
  revisarVidas();
}

function revisarVidas() {
  if (vidasEnemigo == 0) {
    createMensajeFinal("🎇 !Felicitaciones! 🎉 Ganaste");
  } else if (vidasJugador == 0) {
    createMensajeFinal("Lo siento, haz perdido 💔 no tienes vidas");
  }
}

function createMensaje() {
  let notificacion = document.createElement("p");
  let nuevoAtaqueDelJugador = document.createElement("p");
  let nuevoAtaqueDelEnemigo = document.createElement("p");

  sectionMensaje.innerHTML = resultado;
  nuevoAtaqueDelJugador.innerHTML = ataqueJugador;
  nuevoAtaqueDelEnemigo.innerHTML = ataqueEnemigo;

  let parrafo = document.createElement("p");
  parrafo.innerHTML =
    "Tu mascota ataco con " +
    ataqueJugador +
    " ,y la mascota del enemigo ataco con " +
    ataqueEnemigo +
    " " +
    resultado;

  sectionMensaje.appendChild(notificacion);
  ataqueDelJugador.appendChild(notificacion);
  ataqueDelEnemigo.appendChild(notificacion);
}

function createMensajeFinal(resultadoFinal) {
  let parrafo = document.createElement("p");
  parrafo.innerHTML = resultadoFinal;

  sectionMensaje.appendChild(parrafo);

  botonFuego.disabled = true;
  botonAgua.disabled = true;
  botonTierra.disabled = true;

  sectionReiniciar.style.display = "block";
}

function reiniciarJuego() {
  location.reload();
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function pintarCanvas() {
  lienzo.clearRect(0, 0, mapa.width, mapa.height);
  lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height);
  mokepones.forEach((mokepon) => {
    if (mascotaJugador === mokepon.nombre) {
      mokepon.x += mokepon.velocidadX;
      mokepon.y += mokepon.velocidadY;
      mokepon.pintarMokepon();
    }
  });

  enviarPosicion(mascotaJugador.velocidadX, mascotaJugador.velocidadY);

  tipogeEnemigo.pintarMokepon();
  capipegoEnemigo.pintarMokepon();
  ratiguetaEnemigo.pintarMokepon();
  if (mascotaJugador.velocidadX != 0 || mascotaJugador.velocidadY != 0) {
    revisarColision(tipogeEnemigo);
    revisarColision(capipegoEnemigo);
    revisarColision(ratiguetaEnemigo);
  }
}

function enviarPosicion(x, y) {
  fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      x,
      y,
    }),
  }).then(function (res) {
    if (res.ok) {
      res.json().then(function ({ enemigos }) {
        console.log(enemigos);
        mokeponesEnemigos = enemigos.map(function (enemigo) {
          let mokeponEnemigo = null;
          const mokeponNombre = enemigo.mokepon?.nombre || "";

          if (mokeponNombre === "Tipoge") {
            mokeponEnemigo = new Mokepon(
              "Tipoge",
              "./assets/mokepons_mokepon_hipodoge_attack.png",
              5,
              "./assets/hipodoge.png",
              500,
              180
            );
          } else if (mokeponNombre === "Capipego") {
            mokeponEnemigo = new Mokepon(
              "Capipego",
              "./assets/mokepons_mokepon_capipepo_attack.png",
              5,
              "./assets/capipepo.png",
              150,
              230
            );
          } else if (mokeponNombre === "Ratigueta") {
            mokeponEnemigo = new Mokepon(
              "Ratigueta",
              "./assets/mokepons_mokepon_ratigueya_attack.png",
              5,
              "./assets/ratigueya.png",
              350,
              360
            );
          }

          mokeponEnemigo.x = enemigo.x;
          mokeponEnemigo.y = enemigo.y;

          return mokeponesEnemigos;
        });
      });
    }
  });
}

function moverDerecha() {
  mokepones.forEach((mokepon) => {
    if (mascotaJugador === mokepon.nombre) {
      mokepon.velocidadX += 5;
    }
  });
}

function moverIzquierda() {
  mokepones.forEach((mokepon) => {
    if (mascotaJugador === mokepon.nombre) {
      mokepon.velocidadX -= 5;
    }
  });
}

function moverAbajo() {
  mokepones.forEach((mokepon) => {
    if (mascotaJugador === mokepon.nombre) {
      mokepon.velocidadY += 5;
    }
  });
}

function moverArriba() {
  mokepones.forEach((mokepon) => {
    if (mascotaJugador === mokepon.nombre) {
      mokepon.velocidadY -= 5;
    }
  });
}

function detenerMovimiento() {
  mokepones.forEach((mokepon) => {
    if (mascotaJugador === mokepon.nombre) {
      mokepon.velocidadX = 0;
      mokepon.velocidadY = 0;
    }
  });
}

function sePresionoUnaTecla(event) {
  switch (event.key) {
    case "ArrowUp":
      moverArriba();
      break;

    case "ArrowDown":
      moverAbajo();
      break;

    case "ArrowLeft":
      moverIzquierda();
      break;

    case "ArrowRight":
      moverDerecha();
      break;

    default:
      break;
  }
}

function iniciarMapa() {
  intervalo = setInterval(pintarCanvas, 50);

  window.addEventListener("keydown", sePresionoUnaTecla);

  window.addEventListener("keyup", detenerMovimiento);
}

function revisarColision(enemigo) {
  const arribaEnemigo = enemigo.y;
  const abajoEnemigo = enemigo.y + enemigo.alto;
  const derechaEnemigo = enemigo.x + enemigo.ancho;
  const izquierdaEnemigo = enemigo.x;

  let mokeponJugador = mokepones.find((m) => m.nombre === mascotaJugador);

  if (!mokeponJugador) return;

  const arribaMascota = mokeponJugador.y;
  const abajoMascota = mokeponJugador.y + mokeponJugador.alto;
  const derechaMascota = mokeponJugador.x + mokeponJugador.ancho;
  const izquierdaMascota = mokeponJugador.x;

  if (
    abajoMascota < arribaEnemigo ||
    arribaMascota > abajoEnemigo ||
    derechaMascota < izquierdaEnemigo ||
    izquierdaMascota > derechaEnemigo
  ) {
    return;
  } else {
    detenerMovimiento();
    clearInterval(intervalo);
    sectionSeleccionarAtaque.style.display = "flex";
    sectionVerMapa.style.display = "none";

    alert("¡ Colisión detectada con " + enemigo.nombre + " !");

    let colisionDetectada = enemigo.nombre;
    spanMascotaEnemigo.innerHTML = colisionDetectada;
  }
}

window.addEventListener("load", iniciarJuego);
