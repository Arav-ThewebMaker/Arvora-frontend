async function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let data = await loginRequest(username, password);

    console.log(data);

    if (data.access_token) {

        localStorage.setItem("token", data.access_token);
        window.location.href = "dashboard.html";

    } else {

        document.getElementById("error").innerText =
            data.message || "Login failed";

    }
}