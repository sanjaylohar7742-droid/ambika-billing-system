async function signupUser() {

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message = document.getElementById("message");

    // Check password match
    if (password !== confirmPassword) {

        message.style.color = "red";
        message.innerText = "Passwords do not match!";

        return;
    }

    // Phone required
    if (!phone) {

        message.style.color = "red";
        message.innerText = "Phone number is required!";

        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/signup",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            message.style.color = "green";
            message.innerText =
                "Account Created Successfully!";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } else {

            message.style.color = "red";
            message.innerText = data.message;

        }

    } catch (error) {

        console.error(error);

        message.style.color = "red";
        message.innerText = "Server Error!";

    }
}