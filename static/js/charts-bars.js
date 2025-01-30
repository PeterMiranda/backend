/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
const barConfig = {
  type: 'bar',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Respuestas',
        backgroundColor: '#0694a2',
        // borderColor: window.chartColors.red,
        borderWidth: 1,
        data: [-3, 14, 52, 74, 33, 90, 70],
      },
    ],
  },
  options: {
    responsive: true,
    legend: {
      display: false,
    },
  },
}

const barsCtx = document.getElementById('bar')
window.myBar = new Chart(barsCtx, barConfig)

// Función para procesar el JSON
countCommentsByDay = (data) => {

  //Inicializar contadores por rango de horas
  const labels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const counts = [0, 0, 0, 0, 0, 0, 0]

  function parseCustomDate(dateStr) {

    // Formato "30/01/2025, 10:15 AM"
    let [datePart, timePart] = dateStr.split(", ");
    let [day, month, year] = datePart.split("/").map(Number);
    let [time, period] = timePart.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convertir formato AM/PM a 24 horas
    if (period === "a. m." && hours !== 12) {
      hours += 12;
    } else if (period === "p. m." && hours === 12) {
      hours = 0;
    }

    return new Date(year, month - 1, day, hours, minutes);
  }

  Object.values(data).forEach(record => {
    const savedTime = record.joinTime;
    if (!savedTime) return;

    const dt = parseCustomDate(savedTime);
    if (!dt) return;

    const dayOfWeek = dt.getDay(); // Obtener el día de la semana (0-6)

    counts[dayOfWeek]++; // Incrementar contador del día correspondiente
  });

  return { labels, counts };
}

update = () => {
  fetch('/api/v1/landing')
    .then(response => response.json())
    .then(data => {

      let { labels, counts } = countCommentsByDay(data)

      console.log("Datos procesados:", labels, counts);

      // Reset data
      window.myBar.data.labels = [];
      window.myBar.data.datasets.forEach(dataset => dataset.data = []);

      // New data
      window.myBar.data.labels = [...labels];
      window.myBar.data.datasets[0].data = [...counts];

      window.myBar.update();

    })
    .catch(error => console.error('Error:', error));
}

update();
