// -------------------------- app.js --------------------------

// Historical data arrays
let temperatureHistory = [];
let humidityHistory = [];
let turbidityHistory = [];
let phHistory = [];
let bacteriaHistory = [];
let maxHistory = 20; // keep last 20 readings

// -------------------------- Chart Setup --------------------------

// Temperature Gauge
const tempCtx = document.getElementById('temperatureGauge').getContext('2d');
const temperatureGauge = new Chart(tempCtx, {
    type: 'doughnut',
    data: { labels: ['Temp','Remaining'], datasets: [{ data: [0,50], backgroundColor:['#3b82f6','#1f2937'], borderWidth:0 }] },
    options: { rotation: -90, circumference:180, cutout:'70%', plugins:{legend:{display:false}}, animation:{animateRotate:true, duration:1000} }
});

// Bacteria Gauge
const bactCtx = document.getElementById('bacteriaGauge').getContext('2d');
const bacteriaGauge = new Chart(bactCtx, {
    type: 'doughnut',
    data: { labels: ['Bacteria','Remaining'], datasets: [{ data: [0,500], backgroundColor:['#ef4444','#1f2937'], borderWidth:0 }] },
    options: { rotation:-90, circumference:180, cutout:'70%', plugins:{legend:{display:false}}, animation:{animateRotate:true,duration:1000} }
});

// Humidity Line Chart
const humCtx = document.getElementById('humidityChart').getContext('2d');
const humidityChart = new Chart(humCtx, {
    type:'line',
    data: { labels:[], datasets:[{label:'Humidity %', data:[], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.2)', tension:0.4, fill:true, pointRadius:4}] },
    options:{responsive:true, scales:{y:{min:0,max:100,title:{display:true,text:'%'}},x:{title:{display:true,text:'Time'}}}, animation:{duration:1000,easing:'easeOutQuart'}, plugins:{legend:{display:false}}}
});

// Turbidity Bar Chart
const turbCtx = document.getElementById('turbidityChart').getContext('2d');
const turbidityChart = new Chart(turbCtx, {
    type:'bar',
    data: { labels:['Current'], datasets:[{label:'Turbidity NTU', data:[0], backgroundColor:'#f59e0b'}] },
    options:{scales:{y:{min:0,max:100},x:{display:false}}, animation:{duration:1000,easing:'easeOutBounce'}, plugins:{legend:{display:false}}}
});

// pH Line Chart
const phCtx = document.getElementById('phChart').getContext('2d');
const phChart = new Chart(phCtx, {
    type:'line',
    data:{ labels:[], datasets:[{label:'pH', data:[], borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.2)', tension:0.4, fill:true, pointRadius:4}] },
    options:{scales:{y:{min:0,max:14,title:{display:true,text:'pH'}},x:{title:{display:true,text:'Time'}}}, animation:{duration:1000}, plugins:{legend:{display:false}}}
});

// Analysis Tab Charts
const tempTrendCtx = document.getElementById('temperatureTrend').getContext('2d');
const tempTrendChart = new Chart(tempTrendCtx, { type:'line', data:{ labels:[], datasets:[{label:'Temperature °C', data:[], borderColor:'#3b82f6', fill:true, backgroundColor:'rgba(59,130,246,0.2)', tension:0.4}] }, options:{animation:{duration:800}} });

const bactTrendCtx = document.getElementById('bacteriaTrend').getContext('2d');
const bactTrendChart = new Chart(bactTrendCtx, { type:'line', data:{ labels:[], datasets:[{label:'Bacteria CFU/mL', data:[], borderColor:'#ef4444', fill:true, backgroundColor:'rgba(239,68,68,0.2)', tension:0.4}] }, options:{animation:{duration:800}} });

// -------------------------- Simulate or Fetch Data --------------------------

function generateRandomData() {
    return {
        temperature: Math.floor(Math.random()*50),
        humidity: Math.floor(Math.random()*100),
        turbidity: Math.floor(Math.random()*100),
        ph: (Math.random()*2 + 6.5).toFixed(1),
        bacteria: Math.floor(Math.random()*1000)
    };
}

async function fetchSensorData() {
    try {
        const response = await fetch('/api/sensor'); // replace with real endpoint
        return await response.json();
    } catch(e){
        return generateRandomData(); // fallback to simulation
    }
}

// -------------------------- Update Dashboard --------------------------

function updateDashboard(data) {
    // Update gauges
    temperatureGauge.data.datasets[0].data[0] = data.temperature;
    temperatureGauge.data.datasets[0].data[1] = 50 - data.temperature;
    temperatureGauge.update();
    document.getElementById('temperatureNumeric').textContent = `${data.temperature} °C`;

    bacteriaGauge.data.datasets[0].data[0] = data.bacteria;
    bacteriaGauge.data.datasets[0].data[1] = 500 - data.bacteria;
    bacteriaGauge.update();
    document.getElementById('bacteriaNumeric').textContent = `${data.bacteria} CFU/mL`;

    // Update line charts
    appendHistory(temperatureHistory, data.temperature);
    appendHistory(humidityHistory, data.humidity);
    appendHistory(turbidityHistory, data.turbidity);
    appendHistory(phHistory, data.ph);
    appendHistory(bacteriaHistory, data.bacteria);

    updateLineChart(humidityChart, humidityHistory);
    updateLineChart(phChart, phHistory);
    updateBarChart(turbidityChart, data.turbidity);

    // Analysis charts
    updateLineChart(tempTrendChart, temperatureHistory);
    updateLineChart(bactTrendChart, bacteriaHistory);

    // Update stats
    updateStats('tempAvg','tempMax','tempMin',temperatureHistory);
    updateStats('bactAvg','bactMax','bactMin',bacteriaHistory);
}

// -------------------------- Helper Functions --------------------------

function appendHistory(arr,value){
    arr.push(value);
    if(arr.length>maxHistory) arr.shift();
}

function updateLineChart(chart,data){
    chart.data.labels = data.map((_,i)=>i+1);
    chart.data.datasets[0].data = data;
    chart.update();
}

function updateBarChart(chart,value){
    chart.data.datasets[0].data = [value];
    chart.update();
}

function updateStats(avgId,maxId,minId,data){
    document.getElementById(avgId).textContent = (data.reduce((a,b)=>a+b,0)/data.length).toFixed(1);
    document.getElementById(maxId).textContent = Math.max(...data);
    document.getElementById(minId).textContent = Math.min(...data);
}

// -------------------------- Monitoring Loop --------------------------

const modeToggle = document.getElementById('modeToggle');

setInterval(async () => {
    let data;
    if(modeToggle.checked){
        data = await fetchSensorData(); // live
    } else {
        data = generateRandomData(); // simulate
    }
    updateDashboard(data);
}, 5000);

// -------------------------- Clock --------------------------
setInterval(()=>{
    document.getElementById('clock').textContent = new Date().toLocaleTimeString();
},1000);

const ctx = document.getElementById("temperatureGauge").getContext("2d");
const gauge = new Chart(ctx, {
  type: "gauge",
  data: {
    datasets: [
      {
        value: 25,
        minValue: 0,
        data: [50], // max
        backgroundColor: ["#3b82f6"],
      },
    ],
  },
  options: {
    responsive: true,
    needle: { radiusPercentage: 2, widthPercentage: 3, lengthPercentage: 80 },
    valueLabel: { formatter: (value) => `${value}°C` },
  },
});
