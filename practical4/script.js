function validation(regNumber) {
  try {

    if (!regNumber || regNumber.trim() === "") {
      throw new Error("Vehicle number cannot be empty");
    }

    regNumber = regNumber.trim().toUpperCase();

    if (regNumber.length !== 10) {
      throw new Error("Vehicle number must have exactly 10 characters");
    }

    const stateCode = regNumber.substring(0, 2);
    if (!/^[A-Z]{2}$/.test(stateCode)) {
      throw new Error("First 2 characters must be uppercase alphabets (state code)");
    }

    const districtCode = regNumber.substring(2, 4);
    if (!/^[0-9]{2}$/.test(districtCode)) {
      throw new Error("Characters 3-4 must be digits (district code)");
    }

    const series = regNumber.substring(4, 6);
    if (!/^[A-Z]{2}$/.test(series)) {
      throw new Error("Characters 5-6 must be alphabets (series code)");
    }

    const vehicleNo = regNumber.substring(6, 10);
    if (!/^[0-9]{4}$/.test(vehicleNo)) {
      throw new Error("Last 4 characters must be digits (vehicle number)");
    }

    return { valid: true, message: "Valid vehicle registration number: " + regNumber };

  } catch (error) {
    return { valid: false, message: error.message };
  }
}

function checkVehicleNumber() {
  const input = document.getElementById("vehicleNumber").value;
  const resultDiv = document.getElementById("result");

  const result = validation(input);

  if (result.valid) {
    resultDiv.textContent = result.message;
    resultDiv.className = "valid";
  } else {
    resultDiv.textContent = "Error: " + result.message;
    resultDiv.className = "invalid";
    alert(result.message);
  }
}