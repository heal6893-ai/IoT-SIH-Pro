// Example for Temperature Gauge
const tempCtx = document.getElementById('temperatureGauge').getContext('2d');
const temperatureGauge = new Chart(tempCtx, {
    type: 'doughnut',
    data: {
        labels: ['Temperature', 'Remaining'],
        datasets: [{
            data: [25, 50-25], // Current value and remaining
            backgroundColor: ['#3b82f6', '#1f2937'], // Blue for value, dark for remaining
            borderWidth: 0
        }]
    },
    options: {
        rotation: -90,  // Start at top
        circumference: 180, // Half circle
        plugins: { legend: { display: false } },
        animation: {
            animateRotate: true,
            duration: 1000
        },
        cutout: '70%' // Make it look like gauge
    }
});

function updateTemperature(value) {
    temperatureGauge.data.datasets[0].data[0] = value;
    temperatureGauge.data.datasets[0].data[1] = 50 - value; // Remaining
    temperatureGauge.update(); // Animates automatically
}
