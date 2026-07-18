async function signup() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const error =
        document.getElementById("error");

    error.innerText = "";

    if (
        !username ||
        !password ||
        !confirmPassword
    ) {

        error.innerText =
            "Please fill all fields.";

        return;

    }

    if (password !== confirmPassword) {

        error.innerText =
            "Passwords do not match.";

        return;

    }

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/register",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        username: username,

                        password: password

                    })

                }
            );

        const data =
            await response.json();

        if (response.ok) {

            alert(
                "Account created successfully!"
            );

            window.location.href =
                "login.html";

        }

        else {

            error.innerText =
                data.detail ||
                "Signup failed.";

        }

    }

    catch {

        error.innerText =
            "Could not connect to server.";

    }

}