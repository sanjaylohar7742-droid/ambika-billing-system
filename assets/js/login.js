async function loginUser() {

    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {

        const response = await fetch("https://ambika-billing-system.onrender.com/api/auth/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                phone,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {

            // Save Token
            localStorage.setItem("token", data.token);

            // Save User Details
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.style.color = "green";
            message.innerText = "Login Successful!";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);

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