const form = document.getElementById("regForm");

function showError(fieldId, message) {
    document.getElementById(fieldId).classList.add("invalid");
    document.getElementById(fieldId + "Error").textContent = message;
}


function clearError(fieldId) {
    document.getElementById(fieldId).classList.remove("invalid");
    document.getElementById(fieldId + "Error").textContent = "";
}

form.addEventListener("submit", function (e) {

    e.preventDefault();

    let isValid = true;

    ["firstName", "lastName", "birthday", "username", "email", "website", "password", "rePassword"].forEach(clearError);
    document.getElementById("termsError").textContent = "";
    document.getElementById("successMsg").textContent = "";

    const firstName = document.getElementById("firstName").value.trim();
    if (firstName === "") {
        showError("firstName", "First name is required");
        isValid = false;
    }

    const lastName = document.getElementById("lastName").value.trim();
    if (lastName === "") {
        showError("lastName", "Last name is required");
        isValid = false;
    }

    const birthday = document.getElementById("birthday").value;
    if (birthday === "") {
        showError("birthday", "Birthday is required");
        isValid = false;
    }

    const username = document.getElementById("username").value.trim();
    if (username === "") {
        showError("username", "Username is required");
        isValid = false;
    }

    const email = document.getElementById("email").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        showError("email", "Email is required");
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showError("email", "Enter a valid email address");
        isValid = false;
    }

    const website = document.getElementById("website").value.trim();
    const websitePattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;
    if (website !== "" && !websitePattern.test(website)) {
        showError("website", "Enter a valid website (e.g. www.example.com)");
        isValid = false;
    }

    const password = document.getElementById("password").value;
    if (password === "") {
        showError("password", "Password is required");
        isValid = false;
    } else if (password.length < 6) {
        showError("password", "Password must be at least 6 characters");
        isValid = false;
    }

    const rePassword = document.getElementById("rePassword").value;
    if (rePassword === "") {
        showError("rePassword", "Please re-enter your password");
        isValid = false;
    } else if (rePassword !== password) {
        showError("rePassword", "Passwords do not match");
        isValid = false;
    }

    const terms = document.getElementById("terms").checked;
    if (!terms) {
        document.getElementById("termsError").textContent = "You must agree to the terms and conditions";
        isValid = false;
    }

    if (isValid) {
        document.getElementById("successMsg").textContent = "Account created successfully!";
        form.reset();
    }
});

document.getElementById("rePassword").addEventListener("blur", function () {
    const password = document.getElementById("password").value;
    const rePassword = this.value;

    if (rePassword !== "" && rePassword !== password) {
        showError("rePassword", "Passwords do not match");
    } else {
        clearError("rePassword");
    }
});

const allFields = ["firstName", "lastName", "birthday", "username", "email", "website", "password", "rePassword"];

allFields.forEach(function (fieldId) {
    document.getElementById(fieldId).addEventListener("focus", function () {
        clearError(fieldId);
    });
});

document.getElementById("terms").addEventListener("change", function () {
    if (this.checked) {
        document.getElementById("termsError").textContent = "";
    } else {
        document.getElementById("termsError").textContent = "You must agree to the terms and conditions";
    }
});

document.getElementById("birthday").addEventListener("change", function () {
    if (this.value === "") {
        showError("birthday", "Birthday is required");
    } else {
        clearError("birthday");
    }
});