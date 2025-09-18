const humCtx = document.getElementById('humidityChart').getContext('2d');
const humidityChart = new Chart(humCtx, {
    type: 'line',
    data: {
        labels: ['0s','5s','10s','15s','20s'], // Time intervals
        datasets: [{
            label: 'Humidity %',
            data: [45, 50, 55, 60, 58],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.2)',
            fill: true,
            tension: 0.4, // Smooth curve
            pointRadius: 4
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { min: 0, max: 100, title: { display: true, text: '%' } },
            x: { title: { display: true, text: 'Time' } }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        plugins: { legend: { display: false } }
    }
});
