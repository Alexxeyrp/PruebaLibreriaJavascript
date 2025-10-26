const mostrar_noticias = document.getElementById("noticias");

async function cargarNoticias() {
  try {
    // Mensaje de carga mientras llegan los datos
    mostrar_noticias.innerHTML = `
      <p class="text-center text-muted fs-5">Cargando noticias...</p>
    `;

    const res = await fetch(
      "https://api.spaceflightnewsapi.net/v4/articles/?limit=8"
    );

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const data = await res.json();

    // Validación: si no hay artículos
    if (!data.results || data.results.length === 0) {
      mostrar_noticias.innerHTML = `
        <p class="text-center text-danger fs-6">No hay noticias disponibles en este momento.</p>
      `;
      return;
    }

    const noticias = data.results.slice(0, 8);
    mostrar_noticias.innerHTML = ""; // limpia el mensaje de carga

    noticias.forEach((noticia) => {
      const div = document.createElement("div");
      div.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");

      div.innerHTML = `
        <div class="card shadow-sm h-100">
          <img
            src="${
              noticia.image_url ||
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
                noticia.summary
                  ? noticia.summary.slice(0, 100) + "..."
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
document.addEventListener("DOMContentLoaded", cargarNoticias);
