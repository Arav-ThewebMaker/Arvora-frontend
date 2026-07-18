console.log("dashboard loaded");

async function loadDashboard() {

    let token = localStorage.getItem("token");

    let response = await fetch(
        "https://arvora-backend.onrender.com/dashboard?study_time=60",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    let data = await response.json();

    let progress = 10;

    if (data.exams_readiness.length > 0) {
        progress += 30;
        document.getElementById("examGoal").innerHTML =
            "✅ Add your first exam";

    }
    if (data.total_sessions > 0) {
        progress += 30;
        document.getElementById("sessionGoal").innerHTML =
            "✅ Complete your first study session";
    }
    if (data.current_streak > 0) {
        progress += 30;
        document.getElementById("streakGoal").innerHTML =
            "✅ Build your first streak";
    }
    if (
        localStorage.getItem("setupComplete")
    ) {
        document
            .getElementById("welcomeCard")
            .remove();
    }
    else {
        document.getElementById("journeyProgress")
            .style.width = progress + "%";
        document.getElementById("journeyText")
            .innerText =
            progress + "% Complete";
        if (progress >= 100) {
            showSetupCompleteAnimation();
        }

    }

    console.log(data);

    // Performance
    document.getElementById("performanceScore").innerHTML =
        `🎯 ${data.performance_score.score}%<br>
    <span style="font-size:14px;color:#64748b;">
        ${data.performance_score.grade}
    </span>`;

    document.getElementById("performanceBar")
        .style.width =
        data.performance_score.score + "%";

    // Overview
    document.getElementById("studyMinutes").innerText =
        `📚 ${data.total_study_minutes} min`;

    document.getElementById("totalSessions").innerText =
        `📝 ${data.total_sessions} session(s)`;

    document.getElementById("currentStreak").innerText =
        `🔥 ${data.current_streak} day(s)`;

    // Weekly
    document.getElementById("weeklySessions").innerText =
        `📅 ${data.weekly_sessions} session(s)`;

    document.getElementById("uniqueDays").innerText =
        `🗓 ${data.unique_study_days} day(s)`;

    // Averages
    document.getElementById("averageFocus").innerText =
        `🎯 ${data.average_focus}/10`;

    document.getElementById("focusBar")
        .style.width =
        (data.average_focus * 10) + "%";

    document.getElementById("averageRating").innerText =
        `⭐ ${data.average_rating}/5`;

    document.getElementById("averageSessionLength").innerText =
        `⏱ ${data.average_session_length} min`;

    // Subject
    document.getElementById("topSubject").innerText =
        data.most_studied_subject.top_subject
            ? `📖 ${data.most_studied_subject.top_subject}`
            : "📖 No study sessions";

    // Productive Day
    const day = data.productive_weekday;

    document.getElementById("productiveDay").innerText =
        day.day
            ? `🏆 ${day.day} • ${day.minutes} min`
            : "🏆 No study sessions yet";
    // Weak Subjects

    let weakContainer =
        document.getElementById("weakSubjects");

    weakContainer.innerHTML = "";

    if (data.weak_subjects.length === 0) {

        weakContainer.innerHTML = `
        <div class="exam-card">
            No exams added yet.
        </div>
    `;

    } else {

        data.weak_subjects.forEach(subject => {

            let div = document.createElement("div");

            div.className = "exam-card";

            div.innerHTML = `
                <b>📕 ${subject.subject}</b>
                <br>
                ⚠️ Weakness: <b>${subject.weakness}%</b>
                <br>
                📈 Readiness: <b>${subject.readiness}%</b>
            `;

            weakContainer.appendChild(div);

        });

    }

    // Exam Readiness

    let readinessContainer =
        document.getElementById("examReadiness");

    readinessContainer.innerHTML = "";

    data.exams_readiness.forEach(exam => {

        let div = document.createElement("div");

        div.className = "exam-card";

        div.innerHTML = `
            <b>📘 ${exam.subject}</b>
            <br>
            📊 Readiness: <b>${exam.readiness}%</b>
        `;

        readinessContainer.appendChild(div);

    });

    // Daily Plan

    let planContainer =
        document.getElementById("dailyPlan");

    planContainer.innerHTML = "";

    data.daily_plan.forEach(item => {

        let div = document.createElement("div");

        div.className = "exam-card";

        div.innerHTML = `
            <b>📖 ${item.subject}</b>
            <br>
            ⏱️ Study: <b>${item.minutes} min</b>
            <br>
            ⚡ Urgency: <b>${item.urgency}%</b>
        `;

        planContainer.appendChild(div);

    });

    // Weekly Study Graph

    const labels = data.weekly_graph.map(item => item.day);
    const minutes = data.weekly_graph.map(item => item.minutes);

    const ctx = document.getElementById("weeklyChart");

    new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Study Minutes",

                data: minutes,

                borderColor: "#003cff66",

                backgroundColor: "#003cff66",

                fill: true,

                tension: 0.25,

                borderWidth: 3,

                pointRadius: 5,

                pointHoverRadius: 7,

                pointBackgroundColor: "#2563eb",

                pointBorderColor: "#ffffff",

                pointBorderWidth: 2,

                pointHoverBackgroundColor: "#1d4ed8",

                pointHoverBorderColor: "#ffffff"

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "#0f172a",
                    titleColor: "#ffffff",
                    bodyColor: "#38bdf8",
                    borderColor: "#38bdf8",
                    borderWidth: 1,
                    cornerRadius: 10,
                    padding: 12,

                    callbacks: {

                        title: function (context) {
                            return context[0].label;
                        },

                        label: function (context) {
                            return "📚 " + context.parsed.y + " Minute(s)";
                        }

                    }
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    grid: {
                        color: "#f9fafc"
                    },

                    ticks: {
                        color: "rgb(0, 0, 0)"
                    },

                    title: {
                        display: true,
                        text: "Minutes",
                        color: "rgb(0, 0, 0)"
                    }

                },

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {
                        color: "rgb(0, 0, 0)"
                    },

                    title: {
                        display: true,
                        text: "Day",
                        color: "rgb(0, 0, 0)"
                    }

                }

            }

        }

    });

    const pie = document.getElementById("subjectPie");

    const pieLabels =
        data.subject_distribution.map(
            x => x.subject
        );

    const totalMinutes = data.subject_distribution.reduce(
        (sum, subject) => sum + subject.minutes,
        0
    );

    const piePercentages = data.subject_distribution.map(
        subject => Math.round((subject.minutes / totalMinutes) * 100, 1)
    );

    new Chart(pie, {

        type: "pie",

        data: {

            labels: pieLabels,

            datasets: [{

                data: piePercentages,

                backgroundColor: [

                    "#3b82f6",
                    "#22c55e",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#06b6d4",
                    "#ec4899",

                ],

                borderWidth: 2,

                borderColor: "#ffffff",

                hoverOffset: 18

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                tooltip: {

                    callbacks: {

                        label: function (context) {

                            const data = context.dataset.data;

                            const total = data.reduce((a, b) => a + b, 0);

                            const value = context.raw;

                            const percentage = ((value / total) * 100).toFixed(1);

                            return `${context.label}: ${percentage}%`;

                        }

                    }

                },

                legend: {

                    position: "right"

                }

            }

        }

    });

}

function showSetupCompleteAnimation() {
    console.log("SETUP ANIMATION STARTED");

    const card =
        document.getElementById("welcomeCard");


    card.innerHTML = `

        <div class="celebration">

            <h1>
            🎉 Ready!
            </h1>

            <p>
            Your Arvora study space is complete 🚀
            </p>

            <div class="confetti">
                ✨ ✨ ✨ ✨ ✨
            </div>

        </div>

    `;


    card.classList.add(
        "setup-complete"
    );


    setTimeout(() => {
        card.classList.add("hide-card");
        setTimeout(() => {
            card.remove();
            localStorage.setItem(
                "setupComplete",
                "true"
            );
        }, 1000);
    }, 5000);

}

loadDashboard();
