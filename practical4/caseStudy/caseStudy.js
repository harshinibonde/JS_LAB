// Function to reverse a string
function reverseString(str) {
    return str.split("").reverse().join("");
}

// Closure
function message() {
    let msg = "Palindrome Checker";

    function display() {
        return msg;
    }
    return display;
}

// Main Function
function checkPalindrome() {
    try {
        let word = document.getElementById("word").value.trim();
        let resultBox = document.getElementById("result");

        if (word === "") {
            resultBox.style.display = "none";
            throw "Please enter a word.";
        }

        if (!/^[A-Za-z]+$/.test(word)) {
            resultBox.style.display = "none";
            throw "Only alphabets are allowed.";
        }

        if (word.length < 3) {
            resultBox.style.display = "none";
            throw "Please enter at least 3 characters.";
        }

        if (word.length > 20) {
            resultBox.style.display = "none";
            throw "Character limit exceeded (20 characters).";
        }

        let input = word.toLowerCase();
        let reverse = reverseString(input);

        let result = "";

        if (input === reverse) {
            result = "Palindrome";
        } else {
            result = "Not a Palindrome";
        }

        resultBox.style.display = "block";
        resultBox.innerHTML =
            "<h3>" + message()() + "</h3>" +
            "<p><strong>Word:</strong> " + word + "</p>" +
            "<p><strong>Result:</strong> " + result + "</p>";

    } catch (error) {
        alert(error);
    }
}