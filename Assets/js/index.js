const API_URL = "https://mindicador.cl/api";
const btnConvertir = document.getElementById("convertir");
const resultado = document.getElementById("resultado");
const ctx = document.getElementById("grafico").getContext("2d");
let chart;

btnConvertir.addEventListener("click", async () => {
  const monto = parseFloat(document.getElementById("monto").value);
  const moneda = document.getElementById("moneda").value;

  if (isNaN(monto) || monto <= 0) {
    resultado.innerHTML = "Ingrese un monto válido.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${moneda}`);
    if (!res.ok) throw new Error("Error al conectar con la API");

    const data = await res.json();
    const valorActual = data.serie[0].valor;

    const conversion = (monto / valorActual).toFixed(2);
    resultado.innerHTML = `${monto} CLP = ${conversion} ${moneda.toUpperCase()}`;

    // gráfico 
    const ultimos10 = data.serie.slice(0, 10).reverse();
    const labels = ultimos10.map(d => new Date(d.fecha).toLocaleDateString());
    const valores = ultimos10.map(d => d.valor);

    if (chart) chart.destroy(); 
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Historial últimos 10 días (${moneda})`,
          data: valores,
          borderWidth: 2,
          fill: false,
        }]
      },
      options: { responsive: true }
    });

  } catch (error) {
    resultado.innerHTML = `Error: ${error.message}`;
  }
});