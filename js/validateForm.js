document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formDatos");
  const presupuestoTotal = document.getElementById("presupuestoTotal");

  const campos = {
    nombre: document.getElementById("nombre"),
    apellido: document.getElementById("apellido"),
    telefono: document.getElementById("telefono"),
    email: document.getElementById("email"),
    producto: document.getElementById("producto"),
    cantidad: document.getElementById("cantidad"),
    condiciones: document.getElementById("condiciones"),
    integracionRss: document.getElementById("integracionRss"),
    reservaOnline: document.getElementById("reservaOnline"),
    carritoCompras: document.getElementById("carritoCompras"),
    pasarelaPago: document.getElementById("pasarelaPago"),
  };

  const precios = {
    paginaWeb: 1000,
    aplicacionWeb: 2000,
    rebranding: 1500,
  };

  const extras = {
    integracionRss: 200,
    reservaOnline: 300,
    carritoCompras: 400,
    pasarelaPago: 500,
  };

  // Función para mostrar error
  function mostrarError(campo, mensaje) {
    limpiarError(campo);
    campo.classList.add("is-invalid");

    const div = document.createElement("div");
    div.className = "text-danger small mt-1";
    div.id = `error-${campo.id}`;
    div.textContent = mensaje;
    campo.parentNode.appendChild(div);
  }

  // Limpiar error
  function limpiarError(campo) {
    campo.classList.remove("is-invalid");
    const errorDiv = document.getElementById(`error-${campo.id}`);
    if (errorDiv) errorDiv.remove();
  }

  // Validar todos los campos
  function validarCampos() {
    let valido = true;

    // Nombre
    const regexNombre = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{3,15}$/;
    if (!regexNombre.test(campos.nombre.value.trim())) {
      mostrarError(
        campos.nombre,
        "El nombre es obligatorio y debe contener solo letras (hasta 15 caracteres)"
      );
      valido = false;
    }

    // Apellido
    const regexApellido = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{3,40}$/;
    if (!regexApellido.test(campos.apellido.value.trim())) {
      mostrarError(
        campos.apellido,
        "El apellido es obligatorio y debe contener solo letras (hasta 15 caracteres)"
      );
      valido = false;
    }

    // Teléfono
    const regexTelefono = /^[1-9]\d{8}$/;
    if (!regexTelefono.test(campos.telefono.value.trim())) {
      mostrarError(
        campos.telefono,
        "El teléfono es obligatorio y debe ser un número válido de España"
      );
      valido = false;
    }

    // Email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(campos.email.value.trim())) {
      mostrarError(campos.email, "El email es obligatorio y debe ser válido");
      valido = false;
    }

    // Producto
    if (campos.producto.value === "Producto") {
      mostrarError(campos.producto, "Debes seleccionar un producto");
      valido = false;
    }

    // Cantidad
    const cantidad = parseInt(campos.cantidad.value);
    if (isNaN(cantidad) || cantidad < 1 || cantidad > 12) {
      mostrarError(campos.cantidad, "El plazo debe estar entre 1 y 12 meses");
      valido = false;
    }

    // Condiciones
    if (!campos.condiciones.checked) {
      mostrarError(
        campos.condiciones,
        "Debes aceptar las condiciones y el aviso de privacidad"
      );
      valido = false;
    }

    return valido;
  }

  // Calcular presupuesto
  function calcularPresupuesto() {
    let total = 0;

    const producto = campos.producto.value;
    if (producto in precios) total += precios[producto];

    [
      "integracionRss",
      "reservaOnline",
      "carritoCompras",
      "pasarelaPago",
    ].forEach((id) => {
      if (campos[id].checked) total += extras[id];
    });

    const plazo = parseInt(campos.cantidad.value) || 1;
    total = total * (1 + plazo * 0.05);

    presupuestoTotal.value = total.toFixed(2);
  }

  // Escuchar cambios para calcular presupuesto
  campos.producto.addEventListener("change", calcularPresupuesto);
  campos.cantidad.addEventListener("input", calcularPresupuesto);
  ["integracionRss", "reservaOnline", "carritoCompras", "pasarelaPago"].forEach(
    (id) => campos[id].addEventListener("change", calcularPresupuesto)
  );

  // 🔹 Validar campos al perder el foco BLUR
  const validaciones = {
    nombre: {
      regex: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{3,15}$/,
      mensaje:
        "El nombre es obligatorio y debe contener solo letras (hasta 15 caracteres)",
    },
    apellido: {
      regex: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{3,40}$/,
      mensaje:
        "El apellido es obligatorio y debe contener solo letras (hasta 40 caracteres)",
    },
    telefono: {
      regex: /^[1-9]\d{8}$/,
      mensaje: "El teléfono debe ser un número válido de España",
    },
    email: {
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      mensaje: "El email es obligatorio y debe ser válido",
    },
    producto: {
      custom: (campo) => campo.value !== "Producto",
      mensaje: "Debes seleccionar un producto",
    },
    cantidad: {
      custom: (campo) => {
        const valor = parseInt(campo.value);
        return !isNaN(valor) && valor >= 1 && valor <= 12;
      },
      mensaje: "El plazo debe estar entre 1 y 12 meses",
    },
  };

  Object.keys(validaciones).forEach((id) => {
    const campo = campos[id];
    const regla = validaciones[id];

    campo.addEventListener("blur", () => {
      limpiarError(campo);

      let valido = true;
      if (regla.regex) valido = regla.regex.test(campo.value.trim());
      if (regla.custom) valido = regla.custom(campo);

      if (!valido) {
        mostrarError(campo, regla.mensaje);
      }
    });
  });

  // Validar al enviar
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Limpiar todos errores antes
    Object.values(campos).forEach((campo) => limpiarError(campo));

    if (validarCampos()) {
      alert("Formulario enviado correctamente");
      form.reset();
      calcularPresupuesto();
    } else {
      alert("Por favor corrige los errores en el formulario");
    }
  });

  // Inicializar presupuesto
  calcularPresupuesto();
});
