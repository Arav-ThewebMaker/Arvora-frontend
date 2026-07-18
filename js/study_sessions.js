let editingSessionId = null;
let sessions = [];

async function loadSessions() {
    console.log(localStorage.getItem("token"))


    let res = await fetch(
        "http://127.0.0.1:8000/study-session",
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
    console.log(res.status);


    let data = await res.json();

    sessions = data;

    console.log(data);

    let container =
        document.getElementById("sessionList");

    container.innerHTML = "";

    data.forEach(session => {

        let div =
            document.createElement("div");

        div.className = "exam-card";

        div.innerHTML = `
            <div>

                <b>${session.subject}</b><br>

                Chapter: ${session.chapter_name}<br>

                Date: ${session.date}<br>

                Minutes: ${session.minutes}<br>

                Focus: ${session.focus}/10<br>

                Method: ${session.method}<br>

                Rating: ${session.rating}/5

            </div>

            <button onclick="deleteSession(${session.id})">
                Delete
            </button>

            <button onclick="openEditModal(${session.id})">
                Edit
            </button>
        `;

        container.appendChild(div);

    });

}

async function addSession() {

    let subject =
        document.getElementById("subject").value;

    let date =
        document.getElementById("date").value;

    let minutes =
        document.getElementById("minutes").value;

    let focus =
        document.getElementById("focus").value;

    let studyMethod =
        document.getElementById("studyMethod").value;

    let rating =
        document.getElementById("rating").value;

    let chapter =
        document.getElementById("chapter").value;

    let res = await fetch(
        "http://127.0.0.1:8000/study-session",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },

            body: JSON.stringify({

                subject: subject,

                date: date,

                minutes: parseInt(minutes),

                focus: parseInt(focus),

                study_method: studyMethod,

                rating: parseInt(rating),

                chapter_name: chapter

            })
        }
    );

    let data = await res.json();

    console.log(data);

    loadSessions();

}

async function deleteSession(id) {

    let res = await fetch(
        `http://127.0.0.1:8000/study-session/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    let data = await res.json();

    console.log(data);

    loadSessions();
}

function openEditModal(id) {

    editingSessionId = id;

    let session = sessions.find(s => s.id === id);

    if (!session) return;

    document.getElementById("editSubject").value = session.subject;
    document.getElementById("editChapter").value = session.chapter_name;
    document.getElementById("editDate").value = session.date;
    document.getElementById("editMinutes").value = session.minutes;
    document.getElementById("editFocus").value = session.focus;
    document.getElementById("editStudyMethod").value = session.method;
    document.getElementById("editRating").value = session.rating;
    document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {

    document.getElementById("editModal").style.display = "none"
}

async function saveEdit() {

    let res = await fetch(
        `http://127.0.0.1:8000/study-session/${editingSessionId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },

            body: JSON.stringify({

                subject: document.getElementById("editSubject").value,
                chapter_name: document.getElementById("editChapter").value,
                date: document.getElementById("editDate").value,
                minutes: parseInt(document.getElementById("editMinutes").value),
                focus: parseInt(document.getElementById("editFocus").value),
                study_method: document.getElementById("editStudyMethod").value,
                rating: parseInt(document.getElementById("editRating").value)

            })
        }
    );

    let data = await res.json();
    console.log(data);

    closeEditModal();
    loadSessions();

}