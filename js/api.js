const API_URL = "https://phrase-brethren-retrain.ngrok-free.dev";

async function loginRequest(username, password) {

    let response = await fetch(
        `${API_URL}/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })
        }
    );

    return await response.json();
}

async function getDashboard() {

    let token = localStorage.getItem("token");

    let response = await fetch(
        "http://127.0.0.1:8000/dashboard?study_time=60",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return await response.json();
}