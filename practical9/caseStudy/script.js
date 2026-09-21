// ==========================================
// SEMINAR SCHEDULE PLANNER
// Practical 9 - Web Storage API
// ==========================================


// DOM ACCESS

const schedules =
    document.querySelectorAll(".schedule-row");

const saved =
    document.getElementById("saved");

const clearBtn =
    document.getElementById("clearBtn");

const editBtn =
    document.getElementById("editBtn");

const modal =
    document.getElementById("modal");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const saveTopicBtn =
    document.getElementById("saveTopicBtn");

const topicInput =
    document.getElementById("topicInput");

const emptyState =
    document.getElementById("emptyState");

const sessionDetails =
    document.getElementById("sessionDetails");

const selectedBadge =
    document.getElementById("selectedBadge");

const selectedDay =
    document.getElementById("selectedDay");

const selectedSchedule =
    document.getElementById("selectedSchedule");

const selectedTopic =
    document.getElementById("selectedTopic");


// Stores the currently selected row

let selectedRow = null;


// ==========================================
// LOAD SAVED DATA
// ==========================================

// Day is stored in localStorage
let savedDay =
    localStorage.getItem("day");

// Schedule is stored in localStorage
let savedSchedule =
    localStorage.getItem("schedule");

// Topic is stored in sessionStorage
let savedTopic =
    sessionStorage.getItem("topic");


// ==========================================
// DISPLAY SAVED DATA
// ==========================================

if (
    savedDay !== null &&
    savedSchedule !== null
) {

    saved.innerHTML =
        "<strong>Saved session:</strong> " +
        savedDay +
        " • " +
        savedSchedule;

    saved.style.color = "#60781f";


    // Find matching row

    schedules.forEach(function (row) {

        if (
            row.dataset.day === savedDay &&
            row.dataset.schedule === savedSchedule
        ) {

            selectedRow = row;

            row.classList.add("selected");

            displaySession(row);
        }

    });

}


// ==========================================
// DISPLAY SESSION
// ==========================================

function displaySession(row) {

    const day =
        row.dataset.day;

    const schedule =
        row.dataset.schedule;

    const topic =
        row.dataset.topic;


    selectedDay.textContent =
        day;

    selectedSchedule.textContent =
        schedule;

    selectedTopic.textContent =
        topic;


    selectedBadge.textContent =
        day;

    selectedBadge.classList.add("active");


    emptyState.style.display =
        "none";

    sessionDetails.classList.add(
        "active"
    );
}


// ==========================================
// CLICK EVENT
// ==========================================

schedules.forEach(function (row) {

    row.addEventListener(
        "click",
        function () {

            // Remove previous selection

            schedules.forEach(
                function (item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


            // Select current row

            row.classList.add(
                "selected"
            );


            selectedRow = row;


            // Get information

            const day =
                row.dataset.day;

            const schedule =
                row.dataset.schedule;

            const topic =
                row.dataset.topic;


            // Display selected session

            displaySession(row);


            // ==================================
            // LOCAL STORAGE
            // ==================================

            localStorage.setItem(
                "day",
                day
            );

            localStorage.setItem(
                "schedule",
                schedule
            );


            // ==================================
            // SESSION STORAGE
            // ==================================

            sessionStorage.setItem(
                "topic",
                topic
            );


            // Update saved message

            saved.innerHTML =
                "<strong>Saved session:</strong> " +
                day +
                " • " +
                schedule;

            saved.style.color =
                "#60781f";
        }
    );

});


// ==========================================
// EDIT TOPIC
// ==========================================

editBtn.addEventListener(
    "click",
    function () {

        if (selectedRow === null) {
            return;
        }


        topicInput.value =
            selectedRow.dataset.topic;


        modal.classList.add(
            "show"
        );


        topicInput.focus();
    }
);


// ==========================================
// SAVE UPDATED TOPIC
// ==========================================

saveTopicBtn.addEventListener(
    "click",
    function () {

        if (selectedRow === null) {
            return;
        }


        const newTopic =
            topicInput.value.trim();


        if (newTopic === "") {

            topicInput.focus();

            return;
        }


        // Update data attribute

        selectedRow.dataset.topic =
            newTopic;


        // Update topic displayed in table

        selectedRow.querySelector(
            ".topic"
        ).textContent =
            newTopic;


        // Update selected details

        selectedTopic.textContent =
            newTopic;


        // Save topic in sessionStorage

        sessionStorage.setItem(
            "topic",
            newTopic
        );


        // Close modal

        modal.classList.remove(
            "show"
        );


        // Display message

        saved.innerHTML =
            "<strong>Topic updated:</strong> " +
            newTopic;

        saved.style.color =
            "#60781f";
    }
);


// ==========================================
// CLOSE MODAL
// ==========================================

closeModal.addEventListener(
    "click",
    function () {

        modal.classList.remove(
            "show"
        );

    }
);


cancelBtn.addEventListener(
    "click",
    function () {

        modal.classList.remove(
            "show"
        );

    }
);


// Close modal when clicking outside it

modal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === modal
        ) {

            modal.classList.remove(
                "show"
            );

        }

    }
);


// ==========================================
// CLEAR SAVED PREFERENCES
// ==========================================

clearBtn.addEventListener(
    "click",
    function () {

        // Remove localStorage values

        localStorage.removeItem(
            "day"
        );

        localStorage.removeItem(
            "schedule"
        );


        // Remove sessionStorage value

        sessionStorage.removeItem(
            "topic"
        );


        // Remove selected row

        schedules.forEach(
            function (row) {

                row.classList.remove(
                    "selected"
                );

            }
        );


        selectedRow = null;


        // Reset details panel

        emptyState.style.display =
            "block";

        sessionDetails.classList.remove(
            "active"
        );

        selectedBadge.textContent =
            "None";

        selectedBadge.classList.remove(
            "active"
        );


        selectedDay.textContent =
            "—";

        selectedSchedule.textContent =
            "—";

        selectedTopic.textContent =
            "—";


        // Display confirmation

        saved.innerHTML =
            "Saved preferences cleared.";

        saved.style.color =
            "#a13d3d";
    }
);