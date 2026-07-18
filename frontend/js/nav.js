function loadSidebar() {

    document.getElementById("sidebar").innerHTML = `
        <div class="sidebar">

            <div class="logo">
                Arvora
            </div>

            <a href="dashboard.html">Dashboard</a>
            <a href="exams.html">Exams</a>
            <a href="study_sessions.html">Study Sessions</a>

            <div class="bottom">
                <a href="login.html" onclick="logout()">Logout</a>
            </div>

        </div>
    `;
}

function logout() {
    localStorage.removeItem("token");
}