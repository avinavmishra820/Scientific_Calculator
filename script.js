const display = document.getElementById("display");
const historyBox = document.getElementById("historyBox");
const degToggle = document.getElementById("angleToggle");
const modeLabel = document.getElementById("modeLabel");
let lastClearTime = 0;

function append(val) {
    display.value += val;
}

function clearDisplay() {
    const now = Date.now();
    if (now - lastClearTime < 800) {
        historyBox.innerHTML = "<strong>History:</strong>";
    }
    display.value = "";
    lastClearTime = now;
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    let expr = display.value;
    try {
        if (degToggle.checked) {
            expr = expr.replace(/(sin|cos|tan)\(([^)]+)\)/g, (_, fn, x) => `${fn}(${x} deg)`);
        }
        const result = math.evaluate(expr);
        historyBox.innerHTML += `<div>${expr} = ${result}</div>`;
        display.value = result;
        historyBox.scrollTop = historyBox.scrollHeight;
    } catch {
        display.value = "Error";
    }
}

function openTab(tabId, event) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

function updateMode() {
    modeLabel.textContent = degToggle.checked ? "[DEG]" : "[RAD]";
}

function toggleTheme() {
    document.body.classList.toggle("light-mode");
}

// Add these functions to script.js

function createMatrixInputs() {
    const r = +document.getElementById("rows").value;
    const c = +document.getElementById("cols").value;
    const build = (elId) => {
        const cont = document.getElementById(elId);
        cont.innerHTML = "";
        for (let i = 0; i < r; i++) {
            const row = document.createElement("div");
            for (let j = 0; j < c; j++) {
                const inp = document.createElement("input");
                inp.type = "number";
                inp.className = "matrix-cell";
                inp.value = 0;
                inp.id = `${elId}_${i}_${j}`;
                row.appendChild(inp);
            }
            cont.appendChild(row);
        }
    };
    build("matrixA");
    build("matrixB");
}

function computeMatrix() {
    const r = +document.getElementById("rows").value;
    const c = +document.getElementById("cols").value;
    const read = (elId) => {
        const arr = [];
        for (let i = 0; i < r; i++) {
            const row = [];
            for (let j = 0; j < c; j++) {
                row.push(parseFloat(document.getElementById(`${elId}_${i}_${j}`).value) || 0);
            }
            arr.push(row);
        }
        return arr;
    };

    const A = read("matrixA");
    const B = read("matrixB");
    const op = document.getElementById("matrixOp").value;
    let result;

    try {
        switch (op) {
            case "add":
                result = math.add(A, B);
                break;
            case "multiply":
                result = math.multiply(A, B);
                break;
            case "det":
                result = math.det(A);
                break;
            case "inv":
                result = math.inv(A);
                break;
        }
        function displayMatrixAsGrid(matrix) {
            if (typeof matrix === "number") {
                return `<div class="scalar-result">${matrix}</div>`;
            }

            let html = "<table class='matrix-grid'>";
            for (let row of matrix) {
                html += "<tr>";
                for (let val of row) {
                    html += `<td>${math.format(val, { precision: 6 })}</td>`;
                }
                html += "</tr>";
            }
            html += "</table>";
            return html;
        }
        document.getElementById("matrixResult").innerHTML = displayMatrixAsGrid(result);
    } catch (err) {
        document.getElementById("matrixResult").textContent = "Error: " + err.message;
    }
}

// Initialize with default 2×2 on load
createMatrixInputs();


document.addEventListener("keydown", (e) => {
    if (!isNaN(e.key) || "+-*/().".includes(e.key)) {
        append(e.key);
    } else if (e.key === "Enter") {
        e.preventDefault();
        calculate();
    } else if (e.key === "Backspace") {
        backspace();
    } else if (e.key.toLowerCase() === "c") {
        clearDisplay();
    }
});
