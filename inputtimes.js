// DOM elements
let courseType = document.getElementById("courseType");
let strokeSelect = document.getElementById("stroke");
let distanceSelect = document.getElementById("distance");
let swimTimeInput = document.getElementById("swimTime");
let swimDateInput = document.getElementById("swimDate");
let commentsInput = document.getElementById("comments");
let happinessInput = document.getElementById("happiness");
let saveButton = document.getElementById("saveButton");
let suggestionDiv = document.getElementById("suggestion");

const VALID_EVENTS = {
    LC: {
        Freestyle: [50, 100, 200, 400, 800, 1500],
        Backstroke: [50, 100, 200],
        Breaststroke: [50, 100, 200],
        Butterfly: [50, 100, 200],
        IM: [200, 400]         
    },
    SC: {
        Freestyle: [50, 100, 200, 400, 800, 1500],
        Backstroke: [50, 100, 200],
        Breaststroke: [50, 100, 200],
        Butterfly: [50, 100, 200],
        IM: [100, 200, 400]     
    }
};


function updateDistances() {
    const course = courseType.value;
    const stroke = strokeSelect.value;
    
    const validDistances = VALID_EVENTS[course]?.[stroke] || [];

    distanceSelect.innerHTML = "";

    validDistances.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = `${d}m`;
        distanceSelect.appendChild(opt);
    });
}
strokeSelect.addEventListener("change", updateDistances);
courseType.addEventListener("change", updateDistances);

updateDistances();
// Load users
let users = JSON.parse(localStorage.getItem("users")) || [];
let username = localStorage.getItem("username");
let currentUser = users.find(u => u.Name === username);

if (!currentUser) {
    alert("Error: No logged-in user found.");
    window.location.href = "index.html";
}

currentUser.times = currentUser.times || [];
// comment analysis
function analyzeComment(comment) {
    comment = comment.toLowerCase();
    if(comment.includes("tired") || comment.includes("exhausted")) {
        return "Your tiredness suggests you may need a better night's sleep before racing. Also, make sure you are recovering properly between races.";
    }
    if(comment.includes("strong finish")) {
        return "Your comments about a strong finish indicate good endurance. Keep training consistently!";
    }
    if(comment.includes("weak finish") || comment.includes("slow finish")) {
        return "A slow finish might indicate endurance issues or mispacing. Consider endurance sets and race-pace practice.";
    }
    if(comment.includes("slow start") || comment.includes("bad finish")) {
        return "Consider working on your reaction time off the blocks and front-end pace in training.";
    }
    if(comment.includes("slow turns") || comment.includes("bad turns") || comment.includes("bad turn")) {
        return "Practice turns and underwater work off the walls to improve turns.";
    }
    if(comment.includes("technique") || comment.includes("stroke")) {
        return "Video analysis or technique drills recommended.";
    }
    return "Keep training consistently and track your times!";
}

// Show suggestion on comment blur
commentsInput.addEventListener("blur", () => {
    let comment = commentsInput.value;
    if(comment.trim() !== "") {
        suggestionDiv.textContent = "Suggestion: " + analyzeComment(comment);
    } else {
        suggestionDiv.textContent = "";
    }
});

// Validate swim time format
function validateSwimTime(time) {
    const pattern = /^(\d+:\d{2}\.\d{2}|\d+\.\d{2}\.\d{2}|\d{1,2}:\d{2}|\d+\.\d{2}|\d+)$/;
    return pattern.test(time.trim());
}
function isZeroTime(time) {
    function toSeconds(t) {
        if (t.includes(":")) {
            const parts = t.split(":").map(Number);
            if (parts.length === 2) return parts[0] * 60 + parts[1];
            if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }

        if (/^\d+\.\d+\.\d+$/.test(t)) {
            const [m, s, h] = t.split(".").map(Number);
            return m * 60 + s + h / 100;
        }

        const f = parseFloat(t);
        return isNaN(f) ? 0 : f;
    }

    return toSeconds(time.trim()) <= 0;
}
function exceedsWordLimit(text, limit = 100) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    return words.length > limit;
}


// Save time
function saveTime() {
    let course = courseType.value;
    let stroke = strokeSelect.value;
    let distance = distanceSelect.value;
    let time = swimTimeInput.value.trim();
    let date = swimDateInput.value;
    let comments = commentsInput.value.trim();
    let happiness = happinessInput.value;

    if(!time || !date) {
        alert("Please enter both time and date.");
        return;
    }
    // Prevent future dates
const today = new Date();
today.setHours(0, 0, 0, 0);

const enteredDate = new Date(date);
if (enteredDate > today) {
    alert("Date cannot be in the future.");
    return;
}


    if(!validateSwimTime(time)) {
        alert("Invalid time format. Use formats like 28.32 or 1:02.45 or 1.02.45");
        return;
    }
    if (isZeroTime(time)) {
    alert("Swim time must be greater than zero.");
    return;
}

    if (!VALID_EVENTS[course]?.[stroke]?.includes(Number(distance))) {
    alert("Invalid event for selected course.");
    return;
}
    if (exceedsWordLimit(comments, 100)) {
        alert("Comments are limited to 100 words.");
    return;
}




    let entry = { 
        course,      // ← FIX ADDED
        stroke, 
        distance, 
        time, 
        date, 
        comments, 
        happiness 
    };

    currentUser.times.push(entry);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Time saved successfully!");
    clearForm();
}


// Clear form
function clearForm() {
    courseType.value = "LC";
    strokeSelect.value = "Freestyle";
    distanceSelect.value = "50";
    swimTimeInput.value = "";
    swimDateInput.value = "";
    commentsInput.value = "";
    happinessInput.value = "";
}

// Event listener
saveButton.addEventListener("click", saveTime);

