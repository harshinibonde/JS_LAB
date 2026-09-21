// ------------------------------------
// DOM ACCESS
// ------------------------------------

let schedules =
    document.querySelectorAll(".schedule");

let saved =
    document.getElementById("saved");

let clearBtn =
    document.getElementById("clearBtn");


// ------------------------------------
// LOAD SAVED DATA
// ------------------------------------

// Day from localStorage

let savedDay =
    localStorage.getItem("day");


// Schedule from localStorage

let savedSchedule =
    localStorage.getItem("schedule");


// Topic from sessionStorage

let savedTopic =
    sessionStorage.getItem("topic");


// ------------------------------------
// DISPLAY SAVED DATA
// ------------------------------------

if (
    savedDay != null &&
    savedSchedule != null
) {

    saved.style.color = "green";

    saved.innerHTML =

        "<b>Selected Day:</b> " +
        savedDay +
        "<br>" +

        "<b>Selected Schedule:</b> " +
        savedSchedule +
        "<br>" +

        "<b>Current Topic:</b> " +
        (savedTopic || "Not selected");

}


// ------------------------------------
// CLICK EVENT
// ------------------------------------

schedules.forEach(function(row) {

    row.addEventListener("click", function() {


        // Get Day

        let day =
            row.dataset.day;


        // Get Schedule

        let schedule =
            row.dataset.schedule;


        // Get Topic

        let topic =
            row.dataset.topic;


        // --------------------------------
        // ALERT BOX
        // --------------------------------

        alert(
            "Day: " + day +
            "\nSchedule: " + schedule +
            "\nTopic: " + topic
        );


        // --------------------------------
        // CHANGE TOPIC
        // --------------------------------

        let newTopic =
            prompt(
                "Enter new topic:",
                topic
            );


        // Check if user entered a topic

        if (
            newTopic != null &&
            newTopic.trim() != ""
        ) {

            newTopic =
                newTopic.trim();


            // Update topic in HTML

            row.dataset.topic =
                newTopic;


            // Update topic displayed in table

            row.cells[
                row.cells.length - 1
            ].innerHTML =
                newTopic;


            // Update topic variable

            topic =
                newTopic;

        }


        // --------------------------------
        // LOCAL STORAGE
        // --------------------------------

        localStorage.setItem(
            "day",
            day
        );

        localStorage.setItem(
            "schedule",
            schedule
        );


        // --------------------------------
        // SESSION STORAGE
        // --------------------------------

        sessionStorage.setItem(
            "topic",
            topic
        );


        // --------------------------------
        // DISPLAY SELECTED DATA
        // --------------------------------

        saved.style.color =
            "green";

        saved.innerHTML =

            "<b>Selected Day:</b> " +
            day +
            "<br>" +

            "<b>Selected Schedule:</b> " +
            schedule +
            "<br>" +

            "<b>Current Topic:</b> " +
            topic;


        // --------------------------------
        // HIGHLIGHT SELECTED ROW
        // --------------------------------

        schedules.forEach(
            function(item) {

                item.style.backgroundColor =
                    "";

            }
        );


        row.style.backgroundColor =
            "#fff3cd";

    });

});


// ------------------------------------
// CLEAR PREFERENCES
// ------------------------------------

clearBtn.addEventListener(
    "click",
    function() {


        // Remove Day

        localStorage.removeItem(
            "day"
        );


        // Remove Schedule

        localStorage.removeItem(
            "schedule"
        );


        // Remove Topic

        sessionStorage.removeItem(
            "topic"
        );


        // Display message

        saved.style.color =
            "red";

        saved.innerHTML =
            "Saved preferences cleared.";


        // Remove highlighting

        schedules.forEach(
            function(row) {

                row.style.backgroundColor =
                    "";

            }
        );

    }
);