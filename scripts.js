let colores = ["border-primary", "border-secondary", "border-success", "border-danger", "border-warning", "border-info"];
let paisCombo;
let registro = [];
let btnpais = document.getElementById("idpais");
let dropdown = document.getElementById("dropdown");
let paises = new Set();
let formCantUser = document.forms["fcantuser"];
let formregistrotiempo = document.forms["fregistrotiempo"];
let elementosdetabla = document.getElementById("tablaElemenotos");
const URLAPI = "https://randomuser.me/api/?results=";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function validadUserRegistroTiempo() {
  // controlo el filtro de años de registro >= 0
  if (formregistrotiempo["registiempo"].value >= 0) {
    formregistrotiempo["registiempo"].classList.add("is-valid");
    formregistrotiempo["registiempo"].classList.remove("is-invalid");
    filtrarporañio();

    // cargarUser();  // en caso de ser valido
  } else {
    formregistrotiempo["registiempo"].classList.add("is-invalid");
    formregistrotiempo["registiempo"].classList.remove("is-valid");
  }
  return false;
}
function validadCantUser() {
  // controlo que la cantidad de usuarios sea mayor o igual a uno
  if (formCantUser["cantUser"].value >= 1) {
    formCantUser["cantUser"].classList.add("is-valid");
    formCantUser["cantUser"].classList.remove("is-invalid");
    CargaDeUsers();

    // cargarUser();  // en caso de ser valido
  } else {
    formCantUser["cantUser"].classList.add("is-invalid");
    formCantUser["cantUser"].classList.remove("is-valid");
  }
  return false;
}

function popover() {
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
}

function listarusers(regis) {
  let posM = 0;
  let posF = 0;

  let cantFilas = Math.max(
    regis.filter((item) => item.genero == "male").length,
    regis.filter((item) => item.genero == "female").length
  );

  elementosdetabla.innerHTML = ``;
  for (let i = 0; i < cantFilas; i++) {
    elementosdetabla.innerHTML += `<tr ">
    <td id="M+${i}"></td>
    <td id="F+${i}"></td>
  </tr>`;
  }

  regis.forEach((UnaPersona) => {
    if (UnaPersona.genero == "male") {
      document.getElementById("M+" + posM).innerHTML = `
        <div id="${UnaPersona.id}" class=" d-flex align-items-center">
          <img
            data-bs-trigger="hover focus"
            data-bs-container="body"
            data-bs-toggle="popover"
            data-bs-placement="right"
            data-bs-html="true"
            data-bs-content="
            <ol>
              <li>Telefono : ${UnaPersona.telefono}</li>
              <li>Años de registro : ${UnaPersona.anioRegistro}</li>
              <li>Pais : ${UnaPersona.pais}</li>
            </ol>" 

            title=" ${UnaPersona.titulo} ${UnaPersona.apellido} ${UnaPersona.nombre}"
            src="${UnaPersona.imagen}"          
            class="rounded-circle
            border border-3 ${colores[getRandomInt(6)]}"
          />
          <div class="ms-3 col-5">
            <h4 class="fw-bold mb-1">${UnaPersona.titulo} ${UnaPersona.nombre}</h4>
            <p class="text-muted mb-0">${UnaPersona.mail}</p>
            
          </div>
          <div class="ms-3">
          <button type="button" class="btn btn-danger " onclick="borrarUser('${UnaPersona.id}')">Borrar</button>
          </div>
        </div>`;
      +document.getElementById("M+" + posM).innerHTML;
      posM += 1;
    } else {
      document.getElementById("F+" + posF).innerHTML += `
        <div class="d-flex align-items-center">
          <img
            data-bs-trigger="hover focus"
            data-bs-container="body"
            data-bs-toggle="popover"
            data-bs-placement="right"
            data-bs-html="true"
            data-bs-content=
            "<ol>
            <li>Telefono : ${UnaPersona.telefono}</li>
            <li>Años de registro : ${UnaPersona.anioRegistro}</li>
            <li>Pais : ${UnaPersona.pais}</li>
          </ol>" 
            title="${UnaPersona.titulo} ${UnaPersona.apellido} ${UnaPersona.nombre}"
            src="${UnaPersona.imagen}"          
            class="rounded-circle
            border border-3 ${colores[getRandomInt(6)]}"
          />
          <div class="ms-3 col-5">
            <h4 class="fw-bold mb-1">${UnaPersona.titulo} ${UnaPersona.nombre}</h4>
            <p class="text-muted mb-0">${UnaPersona.mail}</p>
          </div>
          <div class="ms-3">
          <button type="button" class="btn btn-danger " onclick="borrarUser('${UnaPersona.id}')">Borrar</button>
          </div>
        </div>`;
      posF += 1;
    }
  });
  popover();
}
async function CargaDeUsers() {
  registro.length = 0;

  let cant = document.getElementById("cantUser").value;

  const response = await fetch(URLAPI + cant);
  const datos = await response.json();

  datos.results.forEach((persona) => {
    let UnaPersona = {};
    UnaPersona.id = persona.login.uuid;
    UnaPersona.titulo = persona.name.title;
    UnaPersona.nombre = persona.name.first;
    UnaPersona.apellido = persona.name.last;
    UnaPersona.imagen = persona.picture.large;
    UnaPersona.mail = persona.email;
    UnaPersona.telefono = persona.phone;
    UnaPersona.genero = persona.gender;
    UnaPersona.anioRegistro = persona.registered.age;
    UnaPersona.pais = persona.location.country;
    registro.push(UnaPersona);
  });
  listarusers(registro);
  cargarCombo();
  /////////////////////////////////////////////////////
}

function filtrarporañio(pais = paisCombo) {
  //let formregistrotiempo = document.forms["fregistrotiempo"];
  let anio = formregistrotiempo["registiempo"].value;
  let regitroFiltroanio = [];

  regitroFiltroanio = registro.filter((persona) => persona.anioRegistro > anio && (persona.pais == pais || pais == undefined));
  listarusers(regitroFiltroanio);
  return false;
}

function borrarUser(id) {
  registro = registro.filter((persona) => persona.id != id);
  filtrarporañio();
  cargarCombo();
}

function cargarCombo() {
  paises.clear();
  dropdown.innerHTML = `<li><button class="dropdown-item" onclick="filtrarporcombo()">Ver todos</<button></li>
  <li><hr class="dropdown-divider"></li>`;

  registro.forEach((UnaPersona) => {
    paises.add(UnaPersona.pais);
  });
  paises.forEach((pais) => {
    dropdown.innerHTML += `<li><button class="dropdown-item" onclick="filtrarporcombo('${pais}')">${pais}</<button></li>`;
  });
}

function filtrarporcombo(pais) {
  paisCombo = pais;

  paisCombo === undefined ? (btnpais.innerHTML = "Filtar por pais") : (btnpais.innerHTML = paisCombo);

  filtrarporañio(paisCombo);
}

function ordenarPorApellidoYNombreALosUsuarios(cuallista) {
  registro.sort((a, b) => {
    if (a.nombre < b.nombre && a.genero == cuallista) {
      return -1;
    }
    if (a.nombre > b.nonbre && a.genero == cuallista) {
      return 1;
    }

    // names must be equal
    return 0;
  });

  filtrarporañio();
}
