function getStars(rating) {
    let stars = "";
    rating = parseInt(rating);
    for (let i = 1; i <= 5; i++) {
        stars += (i <= rating) ? "★" : "☆";
    }
    return stars;
}
function loadCourses() {
    fetch("./courses.xml")
    .then(res => res.text())
    .then(data => {
        let xml = new DOMParser().parseFromString(data, "text/xml");
        let courses = xml.getElementsByTagName("course");

        let output = "";

        for (let c of courses) {
            let id = c.getAttribute("id");
            let title = c.getElementsByTagName("title")[0].textContent;
            let instructor = c.getElementsByTagName("instructor")[0].textContent;
            let price = c.getElementsByTagName("price")[0].textContent;
            let rating = c.getElementsByTagName("rating")[0].textContent;
            let image = c.getElementsByTagName("image")[0].textContent;

            output += `
            <div class="card">
                <img src="${image}" class="course-img">
                <h3>${title}</h3>
                <p>Instructor: ${instructor}</p>
                <p>₹${price}</p>
                <p class="stars">${getStars(rating)}</p>
                <button onclick="viewCourse('${id}')">View Details</button>
            </div>`;
        }

        document.getElementById("course-list").innerHTML = output;
    });
}


function viewCourse(id) {
    window.location.href = "courses_details.html?course=" + id;
}
function loadCourseDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("course");

    if (!id) return;

    fetch("./courses.xml")
    .then(res => res.text())
    .then(data => {
        let xml = new DOMParser().parseFromString(data, "text/xml");
        let courses = xml.getElementsByTagName("course");

        for (let c of courses) {
            if (c.getAttribute("id") === id) {
                document.getElementById("title").innerText =
                    c.getElementsByTagName("title")[0].textContent;

                document.getElementById("desc").innerText =
                    c.getElementsByTagName("description")[0].textContent;

                document.getElementById("instructor").innerText =
                    c.getElementsByTagName("instructor")[0].textContent;

                document.getElementById("duration").innerText =
                    c.getElementsByTagName("duration")[0].textContent;

                let rating = c.getElementsByTagName("rating")[0].textContent;
                document.getElementById("rating").innerText = getStars(rating);

                document.getElementById("course-img").src =
                    c.getElementsByTagName("image")[0].textContent;

                document.getElementById("curriculum").innerHTML =
                    "<li>Basics</li><li>Advanced</li><li>Projects</li>";
            }
        }
    });
}

function enrollCourse() {
    let isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
        alert("Please login to enroll!");
        window.location.href = "login.html";
        return;
    }

    const title = document.getElementById("title").innerText;
    alert("You have successfully enrolled in " + title + "!");
}

function loginUser() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let savedEmail = localStorage.getItem("userEmail");
    let savedPassword = localStorage.getItem("userPassword");

    if (email === savedEmail && password === savedPassword) {
        localStorage.setItem("isLoggedIn", "true");
        alert("Login Successful!");
        window.location.href = "courses.html";
        return false;
    } else {
        alert("Invalid credentials!");
        return false;
    }
}
function registerUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
        alert("Passwords do not match!");
        return false;
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    alert("Registration Successful!");
    showLogin();
    return false;
}

function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("form-title").innerText = "Register";
}

function showLogin() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("form-title").innerText = "Login";
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    alert("Logged out!");
    window.location.href = "index.html";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

document.addEventListener("DOMContentLoaded", () => {
    loadCourseDetails();
});