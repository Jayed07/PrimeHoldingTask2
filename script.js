document.addEventListener("DOMContentLoaded", function() {
    const carTypeSelect = document.getElementById('car-type');
    const carValueRange = document.getElementById('car-value-range');
    const carValueInput = document.getElementById('car-value');
    const leasePeriod = document.getElementById('lease-period');
    const downPayment = document.getElementById('down-payment');
    const downPaymentRange = document.getElementById('down-payment-range');
    const leasingCostDiv = document.getElementById('leasing-cost');
    const downPaymentValueDiv = document.getElementById('down-payment-value');
    const monthlyInstallmentDiv = document.getElementById('monthly-installment');
    const interestRateDiv = document.getElementById('interest-rate');
    const resultsHeading = document.querySelector("body > div > h2")

    function syncInputs(sourceInput, targetInput) {
        sourceInput.addEventListener('input', function() {
            targetInput.value = sourceInput.value;
            validateInputs();
        });
    }

    syncInputs(carValueRange, carValueInput);
    syncInputs(carValueInput, carValueRange);
    syncInputs(downPaymentRange, downPayment);
    syncInputs(downPayment, downPaymentRange);

    // adding event listeners on values changing to calculate dynamically
    carTypeSelect.addEventListener('change', calculate);
    leasePeriod.addEventListener('change', calculate);

    function validateInputs() {
        const carValue = parseFloat(carValueInput.value);
        const downPaymentPercent = parseFloat(downPayment.value);

        let carValueValid = true;
        let downPaymentValid = true;

        // validate car value
        if (carValue < 10000 || carValue > 200000 || isNaN(carValue)) {
            carValueValid = false;
            carValueInput.classList.add('invalid-input');
        } else {
            carValueInput.classList.remove('invalid-input');
        }

        // validate down payment
        if (downPaymentPercent < 10 || downPaymentPercent > 50 || isNaN(downPaymentPercent)) {
            downPaymentValid = false;
            downPayment.classList.add('invalid-input');
        } else {
            downPayment.classList.remove('invalid-input');
        }

        // enable or disable calculation based on validation
        const inputsValid = carValueValid && downPaymentValid;
        if (inputsValid) {
            calculate();
        } else {
            clearResults();
        }

        return inputsValid;
    }

    function calculate() {
        const carType = carTypeSelect.value;
        const carValue = parseFloat(carValueInput.value);
        const leaseMonths = parseInt(leasePeriod.value, 10);
        const downPaymentPercent = parseFloat(downPayment.value);

        
        if (isNaN(carValue) || isNaN(leaseMonths) || isNaN(downPaymentPercent)) {
            clearResults();
            return;
        }


        let interestRate;
        if (carType === 'brand-new') {
            interestRate = 0.0299;
        } else if (carType === 'used') {
            interestRate = 0.037;
        } else {
            clearResults();
            return;
        }

        const downPaymentValue = carValue * (downPaymentPercent / 100);
        const financingAmount = carValue - downPaymentValue;
        const monthlyInterestRate = interestRate / 12;

        // monthly installment using the EMI formula
        const monthlyInstallment = (financingAmount * monthlyInterestRate) / 
                                   (1 - Math.pow(1 + monthlyInterestRate, -leaseMonths));

        // total leasing cost
        const leasingCost = monthlyInstallment * leaseMonths + downPaymentValue;

        // adding the values to the results section
        leasingCostDiv.textContent = `Total Leasing Cost: €${leasingCost.toFixed(2)}`;
        downPaymentValueDiv.textContent = `Down Payment: €${downPaymentValue.toFixed(2)}`;
        monthlyInstallmentDiv.textContent = `Monthly Installment: €${monthlyInstallment.toFixed(2)}`;
        interestRateDiv.textContent = `Interest Rate: ${(interestRate * 100).toFixed(2)}%`;

        resultsHeading.style.display = 'block';
    }

    function clearResults() {
        leasingCostDiv.textContent = '';
        downPaymentValueDiv.textContent = '';
        monthlyInstallmentDiv.textContent = '';
        interestRateDiv.textContent = '';
    }

    calculate();
});