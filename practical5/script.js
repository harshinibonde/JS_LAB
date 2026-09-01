let arr = [];

function buildArray() {
    arr = [];
    arr.push(Number(document.getElementById("v1").value));
    arr.push(Number(document.getElementById("v2").value));
    arr.push(Number(document.getElementById("v3").value));
    arr.push(Number(document.getElementById("v4").value));
    arr.push(Number(document.getElementById("v5").value));

    console.log("Array built:", arr);
    render();
}

function render(highlightMax, highlightMin) {
    const cells = document.getElementById("cells");
    cells.innerHTML = "";

    arr.forEach(function (value, index) {
        let cellClass = "";
        if (value === highlightMax) cellClass = "is-max";
        if (value === highlightMin) cellClass = "is-min";

        cells.innerHTML += `<span class="val ${cellClass}">${value}</span>`;
    });

    document.getElementById("result").innerHTML = "";
}


function showMinMax() {
    let max = arr.reduce((a, b) => (a > b ? a : b));
    let min = arr.reduce((a, b) => (a < b ? a : b));

    console.log("Maximum value:", max);
    console.log("Minimum value:", min);

    render(max, min);

    document.getElementById("result").innerHTML = `
        <p class="max">max → ${max}</p>
        <p class="min">min → ${min}</p>
    `;
}