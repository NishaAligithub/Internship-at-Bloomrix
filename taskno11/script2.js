
let currentInput = "";

function updateDisplay(value) {
    const displayEl = document.getElementById("display");
    // Show 0 if the string is completely empty
    displayEl.textContent = value || "0";
}

function appendValue(value) {
    currentInput += value;
    updateDisplay(currentInput);
}

function clearDisplay() {
    currentInput = "";
    updateDisplay("");
}

// Math core functions
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
    return b === 0 ? "Error (Div by 0)" : a / b;
}

function calculate() {
    // Looks for operators (+, -, *, /) safely
    const operators = currentInput.match(/[\+\-\*\/]/);
    if (!operators) return;

    const operator = operators[0];
    const parts = currentInput.split(operator);

    const num1 = parseFloat(parts[0]);
    const num2 = parseFloat(parts[1]);

    let result;

    switch (operator) {
        case '+': result = add(num1, num2); break;
        case '-': result = subtract(num1, num2); break;
        case '*': result = multiply(num1, num2); break;
        case '/': result = divide(num1, num2); break;
        default: result = "Error";
    }

    updateDisplay(result);
    currentInput = result.toString();
}
