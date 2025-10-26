const proxy = "https://api.allorigins.win/raw?url=";
const key = "30c25b8a3dbf4e1891380ae982e729ec";
const url = `${proxy}https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}`;

const mostrar_noticias = document.getElementById("noticias");

async function cargarNoticias() {
  try {
    // Mensaje de carga mientras llegan los datos
    mostrar_noticias.innerHTML = `
      <p class="text-center text-muted fs-5">Cargando noticias...</p>
    `;

    const res = await fetch(url);

    // Si la respuesta no es exitosa, lanza un error
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const data = await res.json();

    // Validación: si no hay artículos
    if (!data.articles || data.articles.length === 0) {
      mostrar_noticias.innerHTML = `
        <p class="text-center text-danger fs-6">No hay noticias disponibles en este momento.</p>
      `;
      return;
    }

    // Solo mostrar 8 noticias
    const noticias = data.articles.slice(0, 8);
    mostrar_noticias.innerHTML = ""; // limpia el mensaje de carga

    noticias.forEach((noticia) => {
      const div = document.createElement("div");
      div.classList.add("col-lg-3", "col-md-4", "col-sm-6");

      div.innerHTML = `
        <div class="card shadow-sm h-100">
          <img
            src="${
              noticia.urlToImage ||
              "https://via.placeholder.com/400x200?text=Sin+Imagen"
            }"
            class="card-img-top"
            alt="Imagen de la noticia"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">
              ${noticia.title ? noticia.title : "Sin título"}
            </h5>
            <p class="card-text">
              ${
                noticia.description
                  ? noticia.description.slice(0, 100) + "..."
                  : "Sin descripción disponible"
              }
            </p>
            <a href="${
              noticia.url
            }" target="_blank" class="btn btn-dark mt-auto">
              Leer más
            </a>
          </div>
        </div>
      `;

      mostrar_noticias.appendChild(div);
    });
  } catch (err) {
    console.error("Error al cargar noticias:", err);
    mostrar_noticias.innerHTML = `
      <p class="text-center text-danger fs-6">
        Ocurrió un error al cargar las noticias. Intenta nuevamente más tarde.
      </p>
    `;
  }
}

// Ejecutar al cargar la página
cargarNoticias();
