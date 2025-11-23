const display = document.getElementById("display");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const toggleHistoryBtn = document.getElementById("toggleHistory");

let expression = "";
let history = [];
let memoryValue = 0;

// ================= DISPLAY =================
function updateDisplay(value) {
    display.textContent = value;
}

// ================= NUMBER =================
function appendNumber(num) {
    expression += num;
    updateDisplay(expression);
}

// ================= DECIMAL =================
function appendDecimal() {
    if (expression === "" || /[+\-*/]$/.test(expression)) {
        expression += "0.";
    } else {
        let lastChunk = expression.split(/[\+\-\*\/]/).pop();
        if (!lastChunk.includes(".")) expression += ".";
    }
    updateDisplay(expression);
}

// ================= OPERATOR =================
function appendOperator(op) {
    if (expression === "") return;

    // jika operator terakhir, ganti (misal 5+ → 5-)
    if (/[+\-*/]$/.test(expression)) {
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }

    updateDisplay(expression);
}

// ================= CALCULATE =================
function calculate() {
    if (expression === "") return;

    try {
        let result = Function(`"use strict"; return (${expression})`)();
        result = parseFloat(result.toFixed(10));

        history.unshift(`${expression} = ${result}`);
        if (history.length > 5) history.pop();
        updateHistoryUI();

        expression = result.toString();
        updateDisplay(expression);
    } catch (e) {
        updateDisplay("Error");
        expression = "";
    }
}

// ================= CLEAR =================
function clearAll() {
    expression = "";
    updateDisplay("0");
}

function clearEntry() {
    if (expression.length > 0) {
        expression = expression.slice(0, -1);
        updateDisplay(expression || "0");
    }
}

// ================= HISTORY =================
toggleHistoryBtn.addEventListener("click", () => {
    historyPanel.style.display =
        historyPanel.style.display === "none" ? "block" : "none";
});

function updateHistoryUI() {
    historyList.innerHTML = "";
    history.forEach(item => {
        const div = document.createElement("div");
        div.textContent = item;
        div.style.marginBottom = "6px";

        div.onclick = () => {
            const result = item.split("=")[1].trim();
            expression = result;
            updateDisplay(result);
        };

        historyList.appendChild(div);
    });
}

// ================= MEMORY =================
function memoryAdd() {
    if (!isNaN(parseFloat(expression))) memoryValue += parseFloat(expression);
}

function memorySubtract() {
    if (!isNaN(parseFloat(expression))) memoryValue -= parseFloat(expression);
}

function memoryRecall() {
    expression = memoryValue.toString();
    updateDisplay(expression);
}

function memoryClear() {
    memoryValue = 0;
}

// ================= KEYBOARD FIXED =================
document.addEventListener("keydown", e => {
    const key = e.key;

    if (!isNaN(key)) {
        appendNumber(key);
        return;
    }

    if (["+", "-", "*", "/"].includes(key)) {
        appendOperator(key);
        return;
    }

    if (key === ".") {
        appendDecimal();
        return;
    }

    if (key === "Enter" || key === "=") {
        e.preventDefault();
        calculate();
        return;
    }

    if (key === "Backspace") {
        clearEntry();
        return;
    }

    if (key === "Escape") {
        clearAll();
        return;
    }
});
