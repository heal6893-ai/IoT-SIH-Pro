const turbCtx = document.getElementById('turbidityChart').getContext('2d');
const turbidityChart = new Chart(turbCtx, {
    type: 'bar',
    data: {
        labels: ['Current'],
        datasets: [{
            label: 'Turbidity NTU',
            data: [30],
            backgroundColor: '#f59e0b'
        }]
    },
    options: {
        scales: {
            y: { min: 0, max: 100 },
            x: { display: false }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutBounce'
        },
        plugins: { legend: { display: false } }
    }
});
