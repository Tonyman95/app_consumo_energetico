const devices = [];
let chart;
let predictionChart;
let trendChart;

const addDeviceData = () => {
    const device = document.getElementById('device').value;
    const power = parseFloat(document.getElementById('power').value);
    const duration = parseFloat(document.getElementById('duration').value);
    const price = parseFloat(document.getElementById('company').value);

    if (!device || isNaN(power) || isNaN(duration) || isNaN(price)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const dailyConsumption = (power * duration) / 1000; // kWh diarios
    const weeklyConsumption = dailyConsumption * 7; // kWh semanales
    const monthlyConsumption = dailyConsumption * 30; // kWh mensuales
    const monthlyCost = monthlyConsumption * price; // Costo mensual

    devices.push({ device, dailyConsumption, weeklyConsumption, monthlyConsumption, monthlyCost });
    updateTable();
    updateCharts();
    updateTrends();
    updateAdvice();
};

const updateTable = () => {
    const tableBody = document.querySelector('#consumption-table tbody');
    tableBody.innerHTML = '';

    devices.forEach(({ device, dailyConsumption, weeklyConsumption, monthlyConsumption, monthlyCost }) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${device}</td>
            <td>${dailyConsumption.toFixed(2)}</td>
            <td>${weeklyConsumption.toFixed(2)}</td>
            <td>${monthlyConsumption.toFixed(2)}</td>
            <td>${monthlyCost.toFixed(2)}</td>
        `;

        tableBody.appendChild(row);
    });
};

const updateCharts = () => {
    const ctx = document.getElementById('chart').getContext('2d');
    const predictionCtx = document.getElementById('prediction-chart').getContext('2d');

    const labels = devices.map(d => d.device);
    const dataMonthly = devices.map(d => d.monthlyConsumption);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Consumo Mensual (kWh)',
                data: dataMonthly,
                backgroundColor: labels.map((_, i) => `hsl(${i * 50}, 70%, 50%)`)
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
            },
        },
    });

    const predictionData = devices.map(({ dailyConsumption }) => {
        const adjustmentFactor = Math.exp(-0.05 * dailyConsumption); // Modelo exponencial
        return dailyConsumption * 30 * adjustmentFactor;
    });

    if (predictionChart) {
        predictionChart.destroy();
    }

    predictionChart = new Chart(predictionCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Consumo Ajustado por Eficiencia (kWh)',
                data: predictionData,
                borderColor: 'green',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
            },
        },
    });
};

const updateTrends = () => {
    const trendCtx = document.getElementById('trend-chart').getContext('2d');

    const labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    const trendData = devices.map(({ weeklyConsumption }) => {
        return labels.map((_, i) => weeklyConsumption * (1 + 0.1 * i)); // Aumento hipotético por semana
    });

    const datasets = trendData.map((data, index) => ({
        label: devices[index].device,
        data,
        borderColor: `hsl(${index * 50}, 70%, 50%)`,
        borderWidth: 2,
        fill: false
    }));

    if (trendChart) {
        trendChart.destroy();
    }

    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
            },
        },
    });
};

const updateAdvice = () => {
    const adviceList = document.getElementById('advice-list');
    adviceList.innerHTML = '';

    devices.forEach(({ device, dailyConsumption, monthlyCost }) => {
        const advice = document.createElement('li');

        if (dailyConsumption > 5) {
            advice.innerText = `El ${device} consume mucho. Considera reducir su uso para ahorrar en costos (consumo diario: ${dailyConsumption.toFixed(2)} kWh, costo mensual: $${monthlyCost.toFixed(2)}).`;
        } else {
            advice.innerText = `El ${device} tiene un consumo moderado. Puedes optimizar su uso para ahorrar más (consumo diario: ${dailyConsumption.toFixed(2)} kWh, costo mensual: $${monthlyCost.toFixed(2)}).`;
        }

        adviceList.appendChild(advice);
    });
};
