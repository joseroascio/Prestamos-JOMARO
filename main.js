// Aca siempre van a estar mis prestamos
let prestamos = [];

window.addEventListener('load', () => {
  fetch("./data.json")
  .then(response => response.json())
  .then(data => {
    prestamos = data
  })
}
  
);

class Usuario {
  constructor(nombreApellido, edad, sueldo, mail) {
    this.nombreApellido = nombreApellido;
    this.edad = edad;
    this.sueldo = sueldo;
    this.mail = mail;
  }
}

class Prestamo {
  constructor(monto, cuotas) {
    this.monto = monto;
    this.cuotas = cuotas;
  }
}

const titulo = document.getElementById("titulo");
titulo.innerHTML = "JOMARO - CASA DE PRESTAMOS";

const tituloTerciario = document.getElementById("tituloTerciario");
tituloTerciario.innerHTML = "Completa los siguientes datos";

const cambiarColorNombre = (nombreCompleto) => {
  const tituloSecundario = document.getElementById("tituloSecundario");
  tituloSecundario.innerHTML = `Bienvenid@ ${nombreCompleto}, gracias por solicitar 
  tu prestamo personal.`;
  tituloSecundario.addEventListener("mouseover", () => {
    tituloSecundario.className = "purple";
  });
  tituloSecundario.addEventListener("mouseout", () => {
    tituloSecundario.className = "morado";
  });
};

let estaPermitido = (sueldo, edad, cuotas) => {
  if (sueldo < 30000 || edad >= 56 || cuotas > 60) {
    return false;
  } else if (sueldo >= 30000 && edad >= 18 && edad <= 55) {
    return true;
  }
};

const calcularCuota = (monto, cuotas) => {
  return parseInt(monto / cuotas);
};

let calcularInteres = (monto, cuotas) => {
  if (monto <= 30000 && cuotas >= 12 && cuotas <= 18) {
    return 0.3;
  } else if (monto <= 75000 && cuotas >= 19 && cuotas <= 36) {
    return 0.5;
  } else if (monto <= 120000 && cuotas >= 37 && cuotas <= 60) {
    return 0.7;
  }
};

let calculoMontoFinal = (monto, interes) => {
  return monto * interes + monto;
};

const simularPrestamo = () => {
  const nombreCompleto = document.getElementById("input-nombre").value;
  cambiarColorNombre(nombreCompleto);
  const sueldo = document.getElementById("input-sueldo").value;
  const edad = document.getElementById("input-edad").value;
  const mail = document.getElementById("input-email").value;
  const usuario = new Usuario(nombreCompleto, edad, sueldo, mail);
  console.debug(usuario);

  const monto = parseInt(document.getElementById("input-monto").value);
  const cuotas = parseInt(document.getElementById("input-cuotas").value);

  const prestamo = new Prestamo(monto, cuotas);

  const clienteEstaPermitido = estaPermitido(sueldo, edad, cuotas);
  if (clienteEstaPermitido) {
    const valorCuota = calcularCuota(monto, cuotas);
    const tasaInteres = calcularInteres(monto, cuotas);
    const totalidadCobrar = parseFloat(calculoMontoFinal(monto, tasaInteres));

    const mensajeFinal = (`Tu prestamo de $${monto} fue aprobado en un plazo de ${cuotas} cuotas con una tasa de interes de ${tasaInteres}%. 
    El valor de tu cuota ser?? de $${valorCuota}. Al finalizar el per??odo se abonar?? un total de $${totalidadCobrar}.`);
    console.log(mensajeFinal);
    

    Swal.fire({
      title: 'Solicitud aprobada',
      text: 'Disfruta de tu prestamo JOMARO.',
      imageUrl: './prestamo-aprobado.png',
      imageWidth: 400,
      imageHeight: 250,
      position: "top-center",
      icon: 'success',
      imageAlt: 'Custom image'
    })

   
    prestamos.push({
      nombreCompleto: usuario.nombreApellido,
      monto: prestamo.monto,
      cuotas: prestamo.cuotas,
    });

    const lista = document.getElementById("informe-prestamos");
    

    const prestamosEntregados = obtenerPrestamosEntregados();

    if (prestamosEntregados != null) {
      prestamos = prestamosEntregados.concat(prestamos);
      const prestamosFiltrados = prestamosPorMonto(prestamos);
      // voy a ver los prestamos que cumplen: item.monto >60000
      for (const prestamoFiltrado of prestamosFiltrados) {
        
        const li = document.createElement("li");
        li.innerHTML = `Nombre: ${prestamoFiltrado.nombreCompleto} 
                        Monto: ${prestamoFiltrado.monto} 
                        Cuotas:${prestamoFiltrado.cuotas}`;
        lista.append(li);
      }
    }
    //seteo en el local todos los prestamos
    localStorage.setItem("prestamosEntregados",JSON.stringify(prestamos)); 

  } else {
    Swal.fire({
      icon: 'error',
      title: 'Solicitud rechazada',
      text: 'No cumples con los requisitos necesarios',
    })
  }
};


const obtenerPrestamosEntregados = () => {
  return JSON.parse(localStorage.getItem("prestamosEntregados"));
};

const prestamosPorMonto = (prestamosEntregados) => {
  return prestamosEntregados.filter((item) => item.monto > 60000);
};

let boton = document.getElementById("boton");
boton.addEventListener("click", simularPrestamo);

let formulario = document.getElementById("formulario");
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
});


