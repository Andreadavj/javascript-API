async function obtenerTiposDeCambio() {
    try {
        const respuesta = await fetch('https://mindicador.cl/api');
        if (!respuesta.ok) {
            throw new Error('Error al obtener los tipos de cambio');
        }
        const data = await respuesta.json();
        return data;
    } catch (error) {
        mostrarErrorEnDOM(error.message);
    }
}

function mostrarErrorEnDOM(mensaje) {
    document.getElementById('error').innerText = mensaje;
}

function calcularCambio(monto, tipoCambio) {
    const resultado = monto / tipoCambio;
    document.getElementById('resultado').innerText = `Resultado: ${resultado.toFixed(2)}`;
}

function obtenerMonedaSeleccionada() {
    const select = document.getElementById('moneda');
    return select.value;
}

async function convertir() {
    const monto = document.getElementById('monto').value;
    const moneda = obtenerMonedaSeleccionada();
    const tiposDeCambio = await obtenerTiposDeCambio();

    if (moneda === 'dolar') {
        calcularCambio(monto, tiposDeCambio.dolar.valor);
    } else if (moneda === 'euro') {
        calcularCambio(monto, tiposDeCambio.euro.valor);
    }

    // Luego llamas a una función que obtenga los valores históricos para el gráfico y los renderice
    const datosHistoricos = await obtenerDatosHistoricos(moneda);
    crearGrafico(datosHistoricos);
}

async function obtenerDatosHistoricos(moneda) {
    // Lógica para obtener datos históricos (puedes hacer otra petición a la API)
    // Por ejemplo, podrías usar una ruta como: https://mindicador.cl/api/{moneda}
    const respuesta = await fetch(`https://mindicador.cl/api/${moneda}`);
    const data = await respuesta.json();

    const fechas = data.serie.slice(0, 10).map(d => d.fecha);
    const valores = data.serie.slice(0, 10).map(d => d.valor);

    return { fechas, valores };
}

function crearGrafico(datos) {
    const ctx = document.getElementById('miGrafico').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datos.fechas,
            datasets: [{
                label: 'Valor en los últimos 10 días',
                data: datos.valores,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
    });
}