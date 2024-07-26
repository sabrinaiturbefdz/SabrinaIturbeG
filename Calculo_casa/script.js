// Function to format numbers with commas as thousand separators
function formatNumber(value) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Function to handle user input and add commas
function formatNumberInput(input) {
    var value = input.value.replace(/,/g, ''); // Remove existing commas
    if (!isNaN(value) && value.trim() !== '') {
        input.value = formatNumber(parseFloat(value));
    }
}

// Main function to calculate the mortgage
function calculateMortgage() {
    var homePrice = parseFloat(document.getElementById('homePrice').value.replace(/,/g, ''));
    var downPayment = parseFloat(document.getElementById('downPayment').value.replace(/,/g, ''));
    var annualInterestRate = parseFloat(document.getElementById('annualInterestRate').value) / 100 / 12;
    var years = parseInt(document.getElementById('years').value);
    var numberOfPayments = years * 12;

    // Add these console logs for debugging
    console.log("Home Price:", homePrice);
    console.log("Down Payment:", downPayment);
    console.log("Annual Interest Rate:", annualInterestRate);
    console.log("Years:", years);
    console.log("Number of Payments:", numberOfPayments);

    var principal = homePrice - downPayment;
    var closingCosts = 6000; // Approximately $6000
    var pmi = 0;

    if (downPayment / homePrice < 0.20) {
        pmi = principal * 0.01 / 12; // PMI approximately 1% annually, divided by 12 months
    }

    var monthlyPayment = (principal * annualInterestRate * Math.pow((1 + annualInterestRate), numberOfPayments) / (Math.pow((1 + annualInterestRate), numberOfPayments) - 1)) + pmi;
    var totalPayment = monthlyPayment * numberOfPayments;
    var totalInterestPaid = totalPayment - principal - pmi * numberOfPayments;
    var downPaymentPercentage = (downPayment / homePrice * 100).toFixed(2);

    var totalAnnualIncludingPMI = (monthlyPayment + pmi) * 12 + 2200 + 900; // Including PMI, property taxes, and home insurance
    var totalMonthlyIncludingPMI = monthlyPayment + pmi + 300; // Including PMI and estimated utility bills

    var amortizationSchedule = generateAmortizationSchedule(principal, annualInterestRate, numberOfPayments, monthlyPayment, pmi);

    // Update results
    document.getElementById('monthlyPayment').innerText = 'Pago Mensual: $' + formatNumber(monthlyPayment);
    document.getElementById('totalPayment').innerText = 'Pago Total al final del plazo: $' + formatNumber(totalPayment);
    document.getElementById('totalInterestPaid').innerText = 'Total de Intereses Pagados: $' + formatNumber(totalInterestPaid);
    document.getElementById('closingCosts').innerText = 'Costos de Cierre (no incluido en el pago mensual): $' + formatNumber(closingCosts);
    document.getElementById('pmiCost').innerText = pmi > 0 ? 'Costo de PMI Mensual (no incluido en el pago mensual): $' + formatNumber(pmi) : 'No se requiere PMI';
    document.getElementById('downPaymentPercentage').innerText = 'Porcentaje del Pago Inicial: ' + downPaymentPercentage + '%';
    document.getElementById('totalAnnualIncludingPMI').innerText = 'Costo Anual Total (incluyendo PMI, impuestos y seguro): $' + formatNumber(totalAnnualIncludingPMI);
    document.getElementById('totalMonthlyIncludingPMI').innerText = 'Costo Mensual Total (incluyendo PMI y servicios): $' + formatNumber(totalMonthlyIncludingPMI);

    displayAmortizationSchedule(amortizationSchedule);
}

// Function to generate the amortization schedule
function generateAmortizationSchedule(principal, monthlyInterestRate, numberOfPayments, monthlyPayment, pmi) {
    var schedule = [];
    var balance = principal;
    for (var i = 0; i < numberOfPayments; i++) {
        var interestPayment = balance * monthlyInterestRate;
        var principalPayment = monthlyPayment - interestPayment - pmi;
        balance -= principalPayment;
        var year = Math.floor(i / 12) + 1;
        schedule.push({
            paymentNumber: i + 1,
            year: year,
            interestPayment: interestPayment,
            principalPayment: principalPayment,
            balance: balance
        });
    }
    return schedule;
}

// Function to display the amortization schedule
function displayAmortizationSchedule(schedule) {
    var scheduleTable = document.getElementById('amortizationSchedule');
    scheduleTable.innerHTML = "<tr><th>Pago</th><th>Año</th><th>Interés</th><th>Principal</th><th>Saldo</th></tr>";
    schedule.forEach(function (payment) {
        var row = scheduleTable.insertRow();
        row.insertCell(0).innerText = formatNumber(payment.paymentNumber);
        row.insertCell(1).innerText = 'Año ' + payment.year;
        row.insertCell(2).innerText = '$' + formatNumber(payment.interestPayment);
        row.insertCell(3).innerText = '$' + formatNumber(payment.principalPayment);
        row.insertCell(4).innerText = '$' + formatNumber(payment.balance);

        // Set background color based on interest and principal
        if (payment.interestPayment > payment.principalPayment) {
            row.style.backgroundColor = '#ffcccc'; // Light red
        } else if (payment.principalPayment > payment.interestPayment) {
            row.style.backgroundColor = '#ccffcc'; // Light green
        } else {
            row.style.backgroundColor = '#ffffcc'; // Light yellow
        }
    });
}

// Add event listeners to format inputs on blur
document.getElementById('homePrice').addEventListener('blur', function () { formatNumberInput(this); });
document.getElementById('downPayment').addEventListener('blur', function () { formatNumberInput(this); });
document.getElementById('annualInterestRate').addEventListener('blur', function () { formatNumberInput(this); });
document.getElementById('years').addEventListener('change', calculateMortgage);
document.getElementById('calculateButton').addEventListener('click', calculateMortgage);
