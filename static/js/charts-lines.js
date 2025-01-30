/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
const lineConfig = {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Respuestas',
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: [43, 48, 40, 54, 67, 73, 100],
        fill: false,
      },
      {
        label: 'Paid',
        fill: false,
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: '#7e3af2',
        borderColor: '#7e3af2',
        data: [24, 50, 64, 74, 52, 51, 65],
      },
    ],
  },
  options: {
    responsive: true,
    /**
     * Default legends are ugly and impossible to style.
     * See examples in charts.html to add your own legends
     *  */
    legend: {
      display: false,
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Month',
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value',
        },
      },
    },
  },
}

// change this to the id of your chart element in HMTL
const lineCtx = document.getElementById('line')
window.myLine = new Chart(lineCtx, lineConfig)

// Función para procesar el JSON
countCommentsByMonth = (data) => {

  //Inicializar contadores por rango de horas
  const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

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
    if (!savedTime) {
      return;
    }
    const dt = parseCustomDate(savedTime);
    const month = dt.getMonth() + 1;

    console.log(month)

    // Clasificar en el rango correspondiente
    if (month == 1) {
      counts[0]++;
    } else if (month == 2) {
      counts[1]++;
    } else if (month == 3) {
      counts[2]++;
    } else if (month == 4) {
      counts[3]++;
    } else if (month == 5) {
      counts[4]++;
    } else if (month == 6) {
      counts[5]++;
    } else if (month == 7) {
      counts[6]++;
    } else if (month == 8) {
      counts[7]++;
    } else if (month == 9) {
      counts[8]++;
    } else if (month == 10) {
      counts[9]++;
    } else if (month == 11) {
      counts[10]++;
    } else if (month == 12) {
      counts[11]++;
    } else {
      console.log("NO SE SUMÓ NADA")
    }
  });

  return { labels, counts };
}

update = () => {
  fetch('/api/v1/landing')
    .then(response => response.json())
    .then(data => {

      let { labels, counts } = countCommentsByMonth(data)

      console.log("Datos procesados:", labels, counts);

      // Reset data
      window.myLine.data.labels = [];
      window.myLine.data.datasets.forEach(dataset => dataset.data = []);

      // New data
      window.myLine.data.labels = [...labels];
      window.myLine.data.datasets[0].data = [...counts];

      window.myLine.update();

    })
    .catch(error => console.error('Error:', error));
}

update();