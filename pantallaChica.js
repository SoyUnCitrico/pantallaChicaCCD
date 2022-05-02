let intervaloFetch = 60000;
let intervaloPosition = 1000;
let contador = 0;
let posActividad = 0;
let sketchContainer = document.getElementById("sketchContainer");

// Objeto que define el tipo de respuesta esperada del servidor de medios
const actividad = {
  titulo: "Titulo",
  imgUrl : "URL Imagen",
  intro : "Intro",
  fechaInicio : "Fecha Init",
  fechaFinal : "Fecha End",
  categoria : "Categoria",
  subtitulo : "Subtitulo",
  area : "Area",
  resumenSesiones : "Sesiones",
  personasInvitadas : "Invitados",
  personaOrganizadora : "Organizador"
};

let apiUrl = "https://dev-cms.centroculturadigital.mx/admin/api";

// QUERY en GraphQL
let jsonPost = {"query":"query ACTIVIDADES_RECOMENDADAS {\n\t\tallActividades(\n\t\t\tfirst: 6\n\t\t\tsortBy: fechaFinalGlobal_DESC\n\t\t\twhere: { visible: true, apareceComoRecomendada: true }\n\t\t) {\n\t\t\tid\n\t\t\ttitulo\n\t\t\tpersonasInvitadas\n\t\t\tsubtitulo\n      resumenSesiones\n\t\t\tpersonaOrganizadora\n\t\t\timagenMediana\n\t\t\tintroduccion\n\t\t\tfechaInicioGlobal\n\t\t\tfechaFinalGlobal\n\t\t\tcategorias {\n\t\t\t\tnombre\n\t\t\t}\n\t\t\tarea {\n\t\t\t\tnombre\n\t\t\t}\n\t\t}\n\t}","operationName":"ACTIVIDADES_RECOMENDADAS"}

let actividadesRec;
let imagenes;
function parseData (data) {
  actividadesRec = [];
  imagenes = [];
  
  let recomendados = data.data.allActividades;
  recomendados.map((actividadRecomendada) =>{    
    let act = Object.create(actividad);
    act.titulo = actividadRecomendada.titulo;
    act.subtitulo = actividadRecomendada.subtitulo ? actividadRecomendada.subtitulo : "";
    act.imgUrl = actividadRecomendada.imagenMediana;
    act.img = loadImage(act.imgUrl);
    act.intro = actividadRecomendada.introduccion ? actividadRecomendada.introduccion : "";
    act.categoria = actividadRecomendada.categorias[0].nombre;

    act.fechaInicio = actividadRecomendada.fechaInicioGlobal;
    act.fechaFinal = actividadRecomendada.fechaFinalGlobal;
    
    // act.resumenSesiones = actividadRecomendada.resumenSesiones;
    // act.personasInvitadas = actividadRecomendada.personasInvitadas;
    // act.personaOrganizadora = actividadRecomendada.personaOrganizadora;

    actividadesRec.push(act);
  });
  contador++;
  console.log("PARSEANDO POST: " + contador.toString());
  console.log(actividadesRec);
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json(); 
}

postData(apiUrl, jsonPost)
    .then(data => {parseData(data)})
    .catch(e => console.error(e)); 

setInterval(()=> {
  postData(apiUrl, jsonPost)
    .then(data => {parseData(data)})
    .catch(e => console.error(e));  
}, intervaloFetch)

setInterval(() => {
  posActividad++;
  if(posActividad > 5) posActividad = 0; 
//   console.log("Cambiando Actividad");
}, intervaloPosition)


////////////////////////// P5 SECTION /////////////////
// Dibuja el resultado de la fetch

let ancho = 384
let alto = 288;
let factorX = 0.96
let factorY = 0.95
let backColor,fondoColor;
let initFondo, endFondo;

function setup() {
  // fullScreen();
  createCanvas(ancho, alto).parent("sketchContainer");
  initFondo = createVector((ancho * (1 - factorX)), (alto * (1 - factorY)));
  endFondo = createVector(ancho * factorX,  alto * factorY);
  background(245);
}

function draw() {

  if(actividadesRec != undefined) {
    // background(255);
    imagenFull(actividadesRec[posActividad].img)
    // colorearFondo();
    dibujarFondoTitulo();
    dibujarTitulo(actividadesRec[posActividad].titulo, 24, 0);
    // if(actividadesRec[posActividad].subtitulo != "") dibujarSubtitulo(actividadesRec[posActividad].subtitulo, 18, 0);
    if(actividadesRec[posActividad].intro != "") dibujarIntro(actividadesRec[posActividad].intro, 16, 0);
    // dibujar
  } else {
    push();
    fill(0);
    textAlign(CENTER,CENTER);
    textSize(32);
    text("UNDEFINED", width/2, height/2);
    pop();
  }
}

const dibujarTitulo = (titulo, size, color) => {
    push();
      textSize(size)
      fill(color)
      textStyle(BOLD)
      textFont("Phill Gothic");
      text(titulo, initFondo.x + (size * factorX/2), initFondo.y + (size * factorY /3), endFondo.x - (size * factorX * 1.3), 300);
    pop();
  }

  const dibujarSubtitulo = (subtitulo, size, color) => {
    push();
      textSize(size);
      fill(color);
      textStyle(ITALIC);
      textFont("Arial");
      text(subtitulo, initFondo.x + (size * factorX/2), endFondo.y * 0.4, endFondo.x , 200);
    pop();
    // console.log(subtitulo)
  }

  const dibujarIntro = (intro, size, color) => {
    push();
    textSize(size);
    fill(color);
    // textStyle(ITALIC);
    textFont("Arial");
    text(intro, initFondo.x + (size * factorX/2), endFondo.y * 0.45, endFondo.x - size * factorX * 2, 200);
    pop();
    // console.log(subtitulo)
}

const imagenFondo = (picture) =>{
  push();
    picture.resize(endFondo.x-initFondo.x,endFondo.y,initFondo.y);
    image(picture, initFondo.x, initFondo.y);
  pop();
}

const imagenFull= (picture) =>{
  push();
    picture.resize(width, height);
    image(picture, 0,0);
  pop();
}

const dibujarFondoTitulo = () => {
  push();
    rectMode(CORNERS)
    fill(250,250,250,200);
    noStroke();
    rect(initFondo.x, initFondo.y, endFondo.x, endFondo.y);
  pop(); 
}
