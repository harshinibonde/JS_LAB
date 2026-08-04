const subjects = [
  { id: "sub1", name: "Maths" },
  { id: "sub2", name: "Physics" },
  { id: "sub3", name: "Chemistry" },
  { id: "sub4", name: "Computer Sci" },
  { id: "sub5", name: "English" }
];

function getGrade(avg) {
  if (avg >= 90) return "A+";
  if (avg >= 80) return "A";
  if (avg >= 70) return "B";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  if (avg >= 35) return "E";
  return "F";
}

function calculateGrade() {
  const name = document.getElementById("name").value.trim();
  const prn = document.getElementById("prn").value.trim();
  const branch = document.getElementById("branch").value.trim();
  const semester = document.getElementById("semester").value.trim();
  const resultDiv = document.getElementById("result");

  if (!name || !prn) {
    resultDiv.innerHTML = '<span class="error">Please fill in name and PRN.</span>';
    return;
  }

  let total = 0;
  let marksList = [];

  for (const sub of subjects) {
    const raw = document.getElementById(sub.id).value.trim();

    if (raw === "") {
      resultDiv.innerHTML = `<span class="error">Please enter marks for ${sub.name}.</span>`;
      return;
    }

    const marks = Number(raw);

    if (isNaN(marks) || marks < 0 || marks > 100) {
      resultDiv.innerHTML = `<span class="error">${sub.name} marks must be between 0 and 100.</span>`;
      return;
    }

    marksList.push({ name: sub.name, marks: marks });
    total += marks;
  }

  const average = total / subjects.length;
  const grade = getGrade(average);
  const isFail = marksList.some(s => s.marks < 35);

  const rows = marksList.map(s =>
    `<tr><td>${s.name}</td><td>${s.marks}</td></tr>`
  ).join("");

  resultDiv.innerHTML = `
    <div class="info-box">
      <div class="info-row"><span>Name</span><span>${name}</span></div>
      <div class="info-row"><span>PRN</span><span>${prn}</span></div>
      ${branch ? `<div class="info-row"><span>Branch</span><span>${branch}</span></div>` : ""}
      ${semester ? `<div class="info-row"><span>Semester</span><span>${semester}</span></div>` : ""}
    </div>

    <table class="subject-table">
      <tr><th>Subject</th><th>Marks</th></tr>
      ${rows}
    </table>

    <div class="stats-row">
      <div class="stat-box">
        <div class="stat-label">Total</div>
        <div class="stat-value">${total} / ${subjects.length * 100}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Average</div>
        <div class="stat-value">${average.toFixed(1)}%</div>
      </div>
    </div>

    <div class="success-box">
      <div>${isFail ? "Result: FAIL (one or more subjects below 35)" : "Overall Grade"}</div>
      <div class="grade-badge ${isFail ? "fail" : ""}">${grade}</div>
    </div>
  `;
}