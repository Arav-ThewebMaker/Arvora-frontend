let currentExamId = null;

async function loadExams() {
    try {
        let res = await fetch("http://127.0.0.1:8000/exams", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!res.ok) {
            console.log("Failed to load exams:", res.status);
            return;
        }

        let data = await res.json();
        console.log(data);

        let container = document.getElementById("examList");
        container.innerHTML = "";

        data.forEach(exam => {
            let div = document.createElement("div");
            div.className = "exam-card";

            div.innerHTML = `
                <div>
                    <b>${exam.subject}</b><br>
                    Date: ${exam.date}<br>
                    Target: ${exam.target_percentage}%<br>
                    Importance: ${exam.importance}
                </div>

                <button onclick="deleteExam(${exam.id})">Delete</button>
                <button onclick="openEditModal(${exam.id})">Edit</button>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.log("Network error:", err);
    }
}


async function addExam() {

    let subject =
        document.getElementById("subject").value;


    if (subject === "custom") {

        subject =
            document.getElementById("customSubject").value;

    } let date = document.getElementById("date").value;
    let target = document.getElementById("target_percentage").value;
    let importance = document.getElementById("importance").value;

    let res = await fetch("http://127.0.0.1:8000/exams", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            subject,
            date,
            target_percentage: parseInt(target),
            importance: parseInt(importance)
        })
    });

    let data = await res.json();
    console.log(data);

    loadExams();
}

async function deleteExam(id) {

    let res = await fetch(`http://127.0.0.1:8000/exams/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    let data = await res.json();
    console.log(data);

    loadExams();
}

function openEditModal(id) {

    currentExamId = id;

    document.getElementById("editModal").style.display = "block";
}

function closeModal() {

    document.getElementById("editModal").style.display = "none";
}

async function saveEdit() {

    let subject =
        document.getElementById("editSubject").value;

    let date =
        document.getElementById("editDate").value;

    let target =
        document.getElementById("editTarget").value;

    let importance =
        document.getElementById("editImportance").value;

    await fetch(
        `http://127.0.0.1:8000/exams/${currentExamId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                subject: subject,
                date: date,
                target_percentage: parseInt(target),
                importance: parseInt(importance)
            })
        }
    );

    closeModal();

    loadExams();
}

function recommendImportance() {

    const date =
        document.getElementById("date").value;


    if (!date) return;


    const examDate = new Date(date);

    const today = new Date();


    const daysLeft = Math.ceil(
        (examDate - today) /
        (1000 * 60 * 60 * 24)
    );


    const importance =
        document.getElementById("importance");


    if (daysLeft <= 7) {

        importance.value = "5";

    }

    else if (daysLeft <= 30) {

        importance.value = "3";

    }

    else {

        importance.value = "1";

    }

}

function setTarget(value) {

    document.getElementById(
        "target_percentage"
    ).value = value;

}

function checkCustomSubject() {

    const subject =
        document.getElementById("subject").value;


    const custom =
        document.getElementById("customSubject");


    if (subject === "custom") {

        custom.style.display = "block";

    }

    else {

        custom.style.display = "none";

    }

}