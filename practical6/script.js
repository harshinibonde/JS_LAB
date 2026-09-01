function reverseString() {
    const str = document.getElementById("reverseStr").value;
    const reversed = str.split("").reverse().join("");

    document.getElementById("reverseOutput").innerHTML = `
        <p><b>Original:</b> ${str}</p>
        <p><b>Reversed:</b> ${reversed}</p>
    `;
}

function countVowels() {
    const str = document.getElementById("vowelStr").value;

    const vowelRegex = /[aeiou]/gi;

    const matches = str.match(vowelRegex);

    const count = matches ? matches.length : 0;

    document.getElementById("vowelOutput").innerHTML = `
        <p><b>Total Vowels:</b> ${count}</p>
    `;
}