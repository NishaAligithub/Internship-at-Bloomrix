const alertButton = document.getElementById('alertBtn');
alertButton.addEventListener('click', () => {
    alert('Hello! This is your JavaScript alert message.');
});

const changeTextButton = document.getElementById('changeTextBtn');
const dynamicParagraph = document.getElementById('dynamic-text');

changeTextButton.addEventListener('click', () => {
    dynamicParagraph.textContent = 'Hello this task 10 completed';
    
});


const calcButton = document.getElementById('calcBtn');
const resultSpan = document.getElementById('result');

calcButton.addEventListener('click', () => {
    let number1 = 10;
    let number2 = 20;
    let sum = number1 + number2; // Basic arithmetic operation

    resultSpan.textContent = sum;
});
