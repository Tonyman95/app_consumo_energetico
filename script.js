const appliances = []; // Matriz para almacenar electrodomésticos
let energyChart; // Variable para almacenar el gráfico

document.getElementById("addAppliance").addEventListener("click", function() {
    const appliance = document.getElementById("appliance").value.trim();
    const power = parseFloat(document.getElementById("power").value);
    const time = parseFloat(document.getElementById("time").value);
    const companyRate = parseFloat(document.getElementById("company").value);

    if (!appliance || isNaN(power) || isNaN(time) || isNaN(companyRate) || power <= 0 || time <= 0 || companyRate <= 0) {
        alert("Por favor, introduce valores válidos.");
        return;
    }

    const energy = (power * time) / 1000; // kWh
    const cost = energy * companyRate;

    // Agregar el electrodoméstico a la matriz
    appliances.push({ appliance, power, time, energy, cost });

    // Actualizar la tabla
    updateTable();
    // Limpiar el formulario
    document.getElementById("energyForm").reset();
});



function updateTable() {
    const tableBody = document.getElementById("appliancesTable").querySelector("tbody");
    tableBody.innerHTML = "";

    let totalEnergy = 0;
    let totalCost = 0;

    appliances.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.appliance}</td>
            <td>${item.power}</td>
            <td>${item.time}</td>
            <td>${item.energy.toFixed(2)}</td>
            <td>${item.cost.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);

        totalEnergy += item.energy;
        totalCost += item.cost;
    });

    document.getElementById("totalEnergy").textContent = totalEnergy.toFixed(2);
    document.getElementById("totalCost").textContent = totalCost.toFixed(2);
    // Actualizar el gráfico
    updateChart();
}

function updateChart() {
    const labels = appliances.map(item => item.appliance); // Nombres de los electrodomésticos
    const energyData = appliances.map(item => item.energy); // Consumos en kWh
    const costData = appliances.map(item => item.cost); // Costos en pesos

    const ctx = document.getElementById('energyChart').getContext('2d');

    // Destruir el gráfico anterior si existe
    if (energyChart) {
        energyChart.destroy();
    }

    energyChart = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico (puedes cambiarlo a 'line', 'pie', etc.)
        data: {
            labels: labels,
            datasets: [
                
                {
                    label: 'Costo (Pesos)',
                    data: costData,
                    backgroundColor: 'rgba(128, 255, 0, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
