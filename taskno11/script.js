(function () {
    "use strict";
    const displayEl = document.getElementById('display');

    let currentInput = '0';       
    let previousValue = null;     
    let operator = null;          
    let shouldResetDisplay = false;
    let justEvaluated = false;    

    function updateDisplay() {
        // limit displayed length for cleanliness
        let val = currentInput;
        if (val.length > 14) {
            if (val.includes('.')) {
                val = val.slice(0, 14);
            } else {
                val = val.slice(0, 14);
            }
        }
        displayEl.textContent = val || '0';
    }

    function add(a, b) {
        return a + b;
    }

    function subtract(a, b) {
        return a - b;
    }

    function multiply(a, b) {
        return a * b;
    }

    function divide(a, b) {
        if (b === 0) {
            return 'Error';
        }
        return a / b;
    }

    function modulo(a, b) {
        if (b === 0) {
            return 'Error';
        }
        return a % b;
    }

    function operate(op, a, b) {
        // convert to numbers
        const numA = parseFloat(a);
        const numB = parseFloat(b);

        if (isNaN(numA) || isNaN(numB)) {
            return 'Error';
        }


        let result;
        if (op === '+') {
            result = add(numA, numB);
        } else if (op === '-') {
            result = subtract(numA, numB);
        } else if (op === '*') {
            result = multiply(numA, numB);
        } else if (op === '/') {
            result = divide(numA, numB);
        } else if (op === '%') {
            result = modulo(numA, numB);
        } else {
            return 'Error';
        }

        // handle error string from divide/modulo
        if (result === 'Error') {
            return 'Error';
        }

        // round to avoid floating point noise
        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = parseFloat(result.toPrecision(12));
        }
        return result;
    }

    // ---------- evaluate current expression ----------
    function evaluate() {
        if (operator === null || previousValue === null) {
            return currentInput;
        }

        const result = operate(operator, previousValue, currentInput);

        if (result === 'Error') {
            currentInput = 'Error';
            operator = null;
            previousValue = null;
            shouldResetDisplay = true;
            updateDisplay();
            return 'Error';
        }

        // store result as string
        const resultStr = String(result);
        currentInput = resultStr;
        previousValue = resultStr;
        operator = null;
        shouldResetDisplay = true;
        justEvaluated = true;
        updateDisplay();
        return resultStr;
    }

    // ---------- handle digit input ----------
    function inputDigit(digit) {
        if (justEvaluated) {
            // after =, start fresh
            currentInput = '0';
            previousValue = null;
            operator = null;
            justEvaluated = false;
            shouldResetDisplay = false;
        }

        if (shouldResetDisplay) {
            currentInput = '0';
            shouldResetDisplay = false;
        }

        // limit input length
        if (currentInput.replace('-', '').replace('.', '').length >= 14) {
            return;
        }

        if (currentInput === '0' && digit !== '.') {
            currentInput = digit;
        } else {
            currentInput += digit;
        }
        updateDisplay();
    }

    // ---------- handle decimal ----------
    function inputDecimal() {
        if (justEvaluated) {
            currentInput = '0';
            previousValue = null;
            operator = null;
            justEvaluated = false;
            shouldResetDisplay = false;
        }

        if (shouldResetDisplay) {
            currentInput = '0';
            shouldResetDisplay = false;
        }

        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    // ---------- handle operator ----------
    function handleOperator(op) {
        // if there's an error, reset
        if (currentInput === 'Error') {
            resetCalculator();
            return;
        }

        const currentNum = parseFloat(currentInput);
        if (isNaN(currentNum) && currentInput !== 'Error') {
            return;
        }

        if (operator !== null && previousValue !== null && !shouldResetDisplay) {
            // chain calculation: evaluate previous before new operator
            const result = operate(operator, previousValue, currentInput);
            if (result === 'Error') {
                currentInput = 'Error';
                operator = null;
                previousValue = null;
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            const resultStr = String(result);
            currentInput = resultStr;
            previousValue = resultStr;
        } else {
            // first operator or after reset
            previousValue = currentInput;
        }

        operator = op;
        shouldResetDisplay = true;
        justEvaluated = false;
        updateDisplay();
    }

    // ---------- clear (CLR) ----------
    function resetCalculator() {
        currentInput = '0';
        previousValue = null;
        operator = null;
        shouldResetDisplay = false;
        justEvaluated = false;
        updateDisplay();
    }

    // ---------- delete (DEL) ----------
    function deleteLast() {
        if (justEvaluated) {
            resetCalculator();
            return;
        }
        if (currentInput === 'Error') {
            resetCalculator();
            return;
        }
        if (currentInput.length <= 1) {
            currentInput = '0';
        } else {
            currentInput = currentInput.slice(0, -1);
        }
        updateDisplay();
    }

    // ---------- equals ----------
    function handleEquals() {
        if (currentInput === 'Error') {
            resetCalculator();
            return;
        }

        // if no operator, but there's a value, just display it (no change)
        if (operator === null) {
            // if there's a previous value and no operator, maybe just stay
            return;
        }

        // evaluate
        const result = evaluate();
        if (result === 'Error') {
            // error state already set in evaluate
            return;
        }
        // evaluate sets currentInput, previousValue, operator=null, shouldResetDisplay=true
        justEvaluated = true;
    }

    // ---------- event listener ----------
    document.querySelector('.button-grid').addEventListener('click', function (e) {
        const btn = e.target.closest('.btn');
        if (!btn) return;

        const action = btn.dataset.action;
        const value = btn.dataset.value;

        // ---- dispatch with if / else if ----
        if (action === 'digit') {
            inputDigit(value);
        } else if (action === 'decimal') {
            inputDecimal();
        } else if (action === 'operator') {
            handleOperator(value);
        } else if (action === 'clear') {
            resetCalculator();
        } else if (action === 'delete') {
            deleteLast();
        } else if (action === 'equals') {
            handleEquals();
        } else {
            // fallback (should not happen)
        }
    });

    // ---------- keyboard support (bonus) ----------
    document.addEventListener('keydown', function (e) {
        const key = e.key;
        if (key >= '0' && key <= '9') {
            e.preventDefault();
            inputDigit(key);
        } else if (key === '.') {
            e.preventDefault();
            inputDecimal();
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            e.preventDefault();
            // map * to *, / to /
            handleOperator(key);
        } else if (key === '%') {
            e.preventDefault();
            handleOperator('%');
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            handleEquals();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            e.preventDefault();
            resetCalculator();
        } else if (key === 'Backspace') {
            e.preventDefault();
            deleteLast();
        }
    });

    // ---------- init display ----------
    updateDisplay();
})();