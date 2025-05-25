document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const salaryTypeSelect = document.getElementById('salary-type');
    const salaryAmountInput = document.getElementById('salary-amount');
    const salaryLabel = document.getElementById('salary-label');
    const yearSelect = document.getElementById('year');
    const disabilityCheckbox = document.getElementById('disability');
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Result elements
    const grossSalaryElement = document.getElementById('gross-salary');
    const incomeTaxElement = document.getElementById('income-tax');
    const healthInsuranceElement = document.getElementById('health-insurance');
    const pensionInsuranceElement = document.getElementById('pension-insurance');
    const unemploymentInsuranceElement = document.getElementById('unemployment-insurance');
    const netSalaryElement = document.getElementById('net-salary');
    
    // Tax rates for 2024
    const taxRates = {
        2024: {
            incomeTax: 0.10,
            healthInsurance: {
                employee: 0.032,
                employer: 0.048,
                disability: 0.016
            },
            pensionInsurance: {
                employee: 0.1412,
                employer: 0.048,
                disability: 0.0706
            },
            unemploymentInsurance: {
                employee: 0.008,
                employer: 0.004,
                disability: 0.004
            }
        },
        2023: {
            incomeTax: 0.10,
            healthInsurance: {
                employee: 0.032,
                employer: 0.048,
                disability: 0.016
            },
            pensionInsurance: {
                employee: 0.1412,
                employer: 0.048,
                disability: 0.0706
            },
            unemploymentInsurance: {
                employee: 0.008,
                employer: 0.004,
                disability: 0.004
            }
        }
    };
    
    // Update label based on salary type
    salaryTypeSelect.addEventListener('change', function() {
        if (this.value === 'gross') {
            salaryLabel.textContent = 'Брутна заплата (лв):';
        } else {
            salaryLabel.textContent = 'Нетна заплата (лв):';
        }
    });
    
    // Calculate button click handler
    calculateBtn.addEventListener('click', calculateSalary);
    
    // Also calculate when any input changes
    salaryAmountInput.addEventListener('input', calculateSalary);
    yearSelect.addEventListener('change', calculateSalary);
    disabilityCheckbox.addEventListener('change', calculateSalary);
    
    // Initial calculation
    calculateSalary();
    
    function calculateSalary() {
        const salaryType = salaryTypeSelect.value;
        const salaryAmount = parseFloat(salaryAmountInput.value) || 0;
        const year = yearSelect.value;
        const isDisability = disabilityCheckbox.checked;
        
        const rates = taxRates[year];
        
        let grossSalary, netSalary;
        
        if (salaryType === 'gross') {
            grossSalary = salaryAmount;
            netSalary = calculateNetSalary(grossSalary, rates, isDisability);
        } else {
            netSalary = salaryAmount;
            grossSalary = calculateGrossSalary(netSalary, rates, isDisability);
        }
        
        // Calculate all components
        const incomeTax = grossSalary * rates.incomeTax;
        
        const healthInsuranceRate = isDisability ? 
            rates.healthInsurance.disability : rates.healthInsurance.employee;
        const healthInsurance = grossSalary * healthInsuranceRate;
        
        const pensionInsuranceRate = isDisability ? 
            rates.pensionInsurance.disability : rates.pensionInsurance.employee;
        const pensionInsurance = grossSalary * pensionInsuranceRate;
        
        const unemploymentInsuranceRate = isDisability ? 
            rates.unemploymentInsurance.disability : rates.unemploymentInsurance.employee;
        const unemploymentInsurance = grossSalary * unemploymentInsuranceRate;
        
        // Update UI
        grossSalaryElement.textContent = grossSalary.toFixed(2) + ' лв';
        incomeTaxElement.textContent = incomeTax.toFixed(2) + ' лв';
        healthInsuranceElement.textContent = healthInsurance.toFixed(2) + ' лв';
        pensionInsuranceElement.textContent = pensionInsurance.toFixed(2) + ' лв';
        unemploymentInsuranceElement.textContent = unemploymentInsurance.toFixed(2) + ' лв';
        netSalaryElement.textContent = netSalary.toFixed(2) + ' лв';
    }
    
    function calculateNetSalary(grossSalary, rates, isDisability) {
        const incomeTax = grossSalary * rates.incomeTax;
        
        const healthInsuranceRate = isDisability ? 
            rates.healthInsurance.disability : rates.healthInsurance.employee;
        const healthInsurance = grossSalary * healthInsuranceRate;
        
        const pensionInsuranceRate = isDisability ? 
            rates.pensionInsurance.disability : rates.pensionInsurance.employee;
        const pensionInsurance = grossSalary * pensionInsuranceRate;
        
        const unemploymentInsuranceRate = isDisability ? 
            rates.unemploymentInsurance.disability : rates.unemploymentInsurance.employee;
        const unemploymentInsurance = grossSalary * unemploymentInsuranceRate;
        
        return grossSalary - incomeTax - healthInsurance - pensionInsurance - unemploymentInsurance;
    }
    
    function calculateGrossSalary(netSalary, rates, isDisability) {
        // This is more complex as we need to reverse the calculation
        // We'll use an iterative approach to approximate the gross salary
        
        let gross = netSalary * 1.5; // Initial guess
        let calculatedNet = calculateNetSalary(gross, rates, isDisability);
        let iterations = 0;
        const maxIterations = 20;
        const precision = 0.01;
        
        while (Math.abs(calculatedNet - netSalary) > precision && iterations < maxIterations) {
            if (calculatedNet < netSalary) {
                gross *= 1.01;
            } else {
                gross *= 0.99;
            }
            calculatedNet = calculateNetSalary(gross, rates, isDisability);
            iterations++;
        }
        
        return gross;
    }
});
