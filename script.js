import { DatabaseManager } from "./indexedDB.js";
const dbManager = DatabaseManager.getInstance();

let contenido = document.getElementById("albumsRamdom");
let search = document.querySelector(".search");
let form = document.querySelector(".formulario");
let btnFav = document.getElementById("btnFav");


const API = "https://deezerdevs-deezer.p.rapidapi.com/";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "135285ff8cmsh17c860ed9da3f8fp19bca5jsn4e793482fd74",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
  },
};

let url;
let albums = [];
let canciones = [];

btnFav.addEventListener("click", () => {
  obtenerFav();
})

form.addEventListener("submit", event => {
    event.preventDefault();
})
search.addEventListener("input", async (event) => {
    canciones = [];
    console.log(search.value);
    let apiAlbum = `search?q=${search.value}`;
    url = `${API}${apiAlbum}`;
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
  
      if (data.error == null) {
        canciones.push(data);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
    if (search.value === ""){
        mostrarListasAleatorias();
    }
    console.log(canciones);
    addCanciones();
  });
  
  function addCanciones(){
    let htmlContent = "";
    htmlContent += `<h1 class="text-center titulo">Canciones</h1>`;
    canciones.forEach((artista) => {
        artista.data.forEach((canncion) => {
            //console.log(canncion)
            htmlContent +=`
            <div class="card" style="width: 18rem;">
            <button type="button" class="btn btn-light position-absolute botonAdd addFav" id="${canncion.id}">
            <i class="fa-regular fa-star"></i>
            </button>
            <img class="card-img-top p-2 " src="${canncion.album.cover_big}" alt="...">
            <div class="card-body"> 
              <h5 class="card-title">${canncion.title}</h5>
              <p class="card-text">Artistas: ${canncion.artist.name}</p>
              <a href="#" class="btn btn-primary position-absolute btnDetalle" id="${canncion.album.id}">Mas info</a>
            </div>
          </div>
            `;
        })
    })
    contenido.innerHTML = htmlContent;
    console.log("cancion", canciones)
    let btnDetalles = document.querySelectorAll(".btnDetalle");
  for (const elemento of btnDetalles) {
    elemento.addEventListener("click", () => mostrarDetalle(elemento.id));
  }

    let addFav = document.querySelectorAll(".addFav");
  addFav.forEach(function(btn){
    btn.addEventListener("click", () => {
      let id = btn.id;
      console.log(id);
      getCancion(id);
      btn.classList.add("fav");
    });
  })
  }


mostrarListasAleatorias();

async function mostrarListasAleatorias() {
    albums = [];
    let contador = 0;
  while (contador < 3) {
    let apiAlbum = `album/${getRandomNum(100001, 970000)}`;
    url = `${API}${apiAlbum}`;

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.error == null) {
        albums.push(data);
        contador = contador + 1;
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  console.log(albums);
  addAlbums();

}

function addAlbums() {
  let htmlContent = "";
  htmlContent += `<h1 class="text-center titulo">Albums</h1>`;
  albums.forEach((album) => {
    htmlContent += `
      <div class="card" style="width: 18rem;">
        
        <img class="card-img-top p-2 " src="${album.cover_big}" alt="...">
        <div class="card-body"> 
          <h5 class="card-title">${album.title}</h5>
          <p class="card-text">Artistas: ${album.artist.name}</p>
          <a href="#" class="btn btn-primary position-absolute btnDetalle" id="${album.id}">Mas info</a>
        </div>
      </div>
    `;
  });

  contenido.innerHTML = htmlContent;
  let btnDetalles = document.querySelectorAll(".btnDetalle");
  for (const elemento of btnDetalles) {
    elemento.addEventListener("click", () => mostrarDetalle(elemento.id));
  }


}

async function mostrarDetalle(id) {
  console.log(id);
  let apiAlbum = `album/${id}`;
  url = `${API}${apiAlbum}`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.error == null) {
      addDetalle(data);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

function addDetalle(data) {
  let htmlContent = ``;
  htmlContent = `
    <div class="col-lg-6 col-sm-12">
    <h1>${data.title}</h1>
    <p>Artista: ${data.artist.name}</p>
    <p>Genero: ${data.genres.data[0].name}</p>
    <a href="${data.link}" class="link"><i class="fa-solid fa-headphones"></i> Escuchar</a>
</div>
<div class="col-lg-5 col-sm-12">
    <img src="${data.cover_big}" alt="" class="img-fluid">
</div>
<div class="col-12">
    <table class="table table-hover table-striped w-100 ">
        <thead>
            <tr>
                <th>Titulo</th>
                <th>Artista</th>
                <th>FAV</th>
            </tr>
        </thead>
        <tbody>
        ${data.tracks.data.map(song => `
        <tr>
            <td>${song.title}</td>
            <td>${song.artist.name}</td>
            <td><button id="${song.id}"  class="addFav"><i class="fa-regular fa-star"></i></button></td>
        </tr>
        `).join('')}
        </tbody>
    </table>
</div>
    `;
  contenido.innerHTML = htmlContent;
  console.log(data)
  let addFav = document.querySelectorAll(".addFav");
  addFav.forEach(function(btn){
    btn.addEventListener("click", () => {
      let id = btn.id;
      console.log(id);
      getCancion(id);
      btn.classList.add("fav");
    });
  })


 
}

function cargarFav(canciones){
  let htmlContent = `<h1 class="text-center titulo">Canciones Favoritas</h1>`;
  if(canciones.length  <= 0){
    console.log("ohla")
    htmlContent += `
      <h1>No tienes nada guardado</h1>
  `;
  }else{
    console.log(canciones)
    canciones.forEach(function(canncion){
      console.log(canncion);
      htmlContent += `
      <div class="card" style="width: 18rem;">
        <button type="button" class="btn btn-light position-absolute botonAdd fav" id="${canncion.id}">
        <i class="fa-solid fa-star"></i>
        </button>
        <img class="card-img-top p-2 " src="${canncion.content.album.cover_medium}" alt="...">
        <div class="card-body"> 
          <h5 class="card-title">${canncion.content.title}</h5>
          <p class="card-text">Artistas: ${canncion.content && canncion.content.artist ? canncion.content.artist.name : 'Nombre no disponible'}</p>
          <a href="#" class="btn btn-primary position-absolute btnDetalle" id="${canncion.content.album.id}">Mas info</a>
        </div>
      </div>
      `;
    })
  }
  console.log(canciones.length)
  contenido.innerHTML = htmlContent;

  let btnDetalles = document.querySelectorAll(".btnDetalle");
  for (const elemento of btnDetalles) {
    elemento.addEventListener("click", () => mostrarDetalle(elemento.id));
  }

  let fav = document.querySelectorAll(".fav");
  fav.forEach(function(btn){
    btn.addEventListener("click", () => {
      let id = btn.id;
      console.log("algo"+id);
      deleteClick((parseInt(id)));
    });
  })
}

async function getCancion(id) {
  console.log(id);
  let apiCancion = `track/${id}`;
  url = `${API}${apiCancion}`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.error == null) {
      console.log(data);
      addClick(data);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mensajeError(){
  let body = document.getElementsByTagName("body")[0];
  let span = document.createElement("span");
  span.classList.add('mensaje');
  span.innerText = `
    Ya tienes la canncion en favoritos
  `;
  body.appendChild(span);

  setTimeout(() => {
    span.classList.add('mostrar');
  }, 10); 
  setTimeout(() => {
    span.classList.remove('mostrar');
    setTimeout(() => {
      span.remove();
    }, 1000);
  }, 3000);
}

function mensajeAviso(){
  let body = document.getElementsByTagName("body")[0];
  let span = document.createElement("span");
  span.classList.add('mensaje');
  span.innerText = `
    Se ha añadido a favoridos
  `;
  body.appendChild(span);

  setTimeout(() => {
    span.classList.add('mostrar');
  }, 10); 
  setTimeout(() => {
    span.classList.remove('mostrar');
    setTimeout(() => {
      span.remove();
    }, 1000);
  }, 3000);
}


//////////////////////////////////////////////////////////////
//Base de datos
function addClick(dataC) {
  console.log(dataC)
  const cancionData = dataC;
  dbManager.open()
    .then(() => {
      let data = {id:cancionData.id, content: cancionData };
      console.log(data);
      dbManager.addData(data)
        .then(() => {
          dbManager.counter++;
          mensajeAviso();
        })
        .catch((error) => {
          console.error("Error addData: " + error);
          mensajeError();
        });
    })
    .catch((error) => {
      console.error("Error open: " + error);
    });
}


function obtenerFav() {
    
  dbManager.open()
  .then(() => {
      return dbManager.getAll();
  })
  .then((data) => {
      data.forEach((data) => {
          console.log(data);
          
      });
      cargarFav(data);
  })
  .catch((error) => {
      console.error("Error al obtener todas las notas: " + error);
  });
  
    
}

function deleteClick(id) {
  console.log(id);
    if (!dbManager.db) {
        console.error("La base de datos no está abierta.");
        return;
    }

    dbManager.deleteData(id)
        .then(() => {
            console.log("Canción eliminada con éxito de la base de datos. ID:", id);
            obtenerFav();
        })
        .catch((error) => {
            console.error("Error al eliminar la nota: " + error);
        });
  
    
}