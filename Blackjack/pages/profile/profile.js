const API =
    location.hostname === "localhost"
        ? "http://localhost/Blackjack/api"
        : "https://xtgrsandbox.nl/Blackjack/api";

const container = document.getElementById("main-container");
let currentUserId = localStorage.getItem("userId");

window.onload = () => {
    if (currentUserId) loadProfile();
    else renderLogin();
};

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderMessage(message, type = "error") {
    if (!message) return "";
    return `<p id="form-message" class="form-message ${type}">${escapeHtml(message)}</p>`;
}

function getCurrentUserId() {
    return localStorage.getItem("userId");
}

function setCurrentUserId(userId) {
    currentUserId = userId;
    if (userId) localStorage.setItem("userId", userId);
    else localStorage.removeItem("userId");
}

/* =========================
   LOGIN VIEW
========================= */
const USERNAME_MAX_LENGTH = 50;

function renderLogin(message = "", type = "error") {
    container.innerHTML = `
        <div id ="profile-container" class="content_container">
            <section>
                <div class="section-header">
                    <h1>Login</h1>
                    <p>Welcome back. Sign in to continue your blackjack journey.</p>
                </div>

                ${renderMessage(message, type)}

                <div class="field-group">
                    <label for="lu">Username</label>
                    <input id="lu" placeholder="Enter your username">
                </div>

                <div class="field-group">
                    <label for="lp">Password</label>
                    <input id="lp" type="password" placeholder="Enter your password">
                </div>

                <div class="buttons">
                    <button class="btn-primary" onclick="login()">Login</button>
                    <button class="btn-secondary" onclick="renderRegister()">Register</button>
                </div>
            </section>
        </div>
    `;
}

/* =========================
   REGISTER VIEW
========================= */
function renderRegister(message = "", type = "error") {
    container.innerHTML = `
        <div id ="profile-container" class="content_container">
            <section>
                <div class="section-header">
                    <h1>Create account</h1>
                    <p>Join the table and start tracking your progress.</p>
                </div>

                ${renderMessage(message, type)}

                <div class="field-group">
                    <label for="ru">Username</label>
                    <input id="ru" maxlength="${USERNAME_MAX_LENGTH}" placeholder="Choose a username">
                </div>

                <div class="field-group">
                    <label for="rp">Password</label>
                    <input id="rp" type="password" placeholder="Create a password">
                </div>

                <div class="buttons">
                    <button class="btn-primary" onclick="register()">Create account</button>
                    <button class="btn-secondary" onclick="renderLogin()">Back</button>
                </div>
            </section>
        </div>
    `;
}

/* =========================
   PROFILE VIEW
========================= */
function renderProfile(user, message = "", type = "success") {
    const username = user?.username || "Unknown user name";
    const created_date = user?.created_at || "Unknown creation date"

    container.innerHTML = `
        <div id ="profile-container" class="content_container">
            <section>
                <div class="section-header">
                    <h1>Profile</h1>
                </div>

                ${renderMessage(message, type)}
                <p class="profile-username">${escapeHtml(username)}</p>
                <p class="profile-username">${escapeHtml(created_date)}</p>

                <div class="section-divider"></div>

                <div class="field-group">
                    <p class="profile-card__subtitle">Update your account details to keep your profile secure.</p>
                </div>

                <div class="field-group">
                    <label for="nu">Username</label>
                    <input id="nu" maxlength="${USERNAME_MAX_LENGTH}" value="${escapeHtml(username)}">
                </div>

                <div class="field-group">
                    <label for="np">New password</label>
                    <input id="np" type="password" placeholder="Leave empty to keep current password">
                </div>

                <div class="buttons">
                    <button class="btn-primary" onclick="save()">Save changes</button>
                    <button class="btn-secondary" onclick="logout()">Logout</button>
                </div>
            </section>
        </div>
    `;
}

/* =========================
   LOGIN
========================= */
async function login() {
    const username = (document.getElementById("lu")?.value || "").trim();
    const password = document.getElementById("lp")?.value || "";

    if (!username || !password) {
        renderLogin("Please enter both your username and password.", "error");
        return;
    }

    const res = await fetch(`${API}/login.php`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!data.success) {
        renderLogin(data.message || "Login failed. Please check your username and password.", "error");
        return;
    }

    setCurrentUserId(data.userId);
    loadProfile();
}

/* =========================
   REGISTER
========================= */
async function register() {
    const username = (document.getElementById("ru")?.value || "").trim();
    const password = document.getElementById("rp")?.value || "";

    if (!username || !password) {
        renderRegister("Please enter a username and a password.", "error");
        return;
    }

    if (username.length > USERNAME_MAX_LENGTH) {
        renderRegister(`Username cannot be longer than ${USERNAME_MAX_LENGTH} characters.`, "error");
        return;
    }

    if (password.length < 6) {
        renderRegister("Password must be at least 6 characters long.", "error");
        return;
    }

    const res = await fetch(`${API}/register.php`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!data.success) {
        renderRegister(data.message || "Registration failed. Please try again.", "error");
        return;
    }

    setCurrentUserId(data.userId);
    loadProfile();
}

/* =========================
   LOAD PROFILE
========================= */
async function loadProfile(message = "", type = "success") {
    const id = getCurrentUserId();
    if (!id) {
        setCurrentUserId(null);
        renderLogin();
        return;
    }

    const res = await fetch(`${API}/get_user.php?id=${encodeURIComponent(id)}`);
    const user = await res.json();

    if (!user || !user.username) {
        setCurrentUserId(null);
        renderLogin();
        return;
    }

    renderProfile(user, message, type);
}

/* =========================
   SAVE
========================= */
async function save() {
    const id = getCurrentUserId();
    if (!id) {
        renderLogin();
        return;
    }

    const username = (document.getElementById("nu")?.value || "").trim();
    const password = document.getElementById("np")?.value || "";

    if (!username) {
        renderProfile({ username: "User" }, "Please enter a username.", "error");
        return;
    }

    if (username.length > USERNAME_MAX_LENGTH) {
        renderProfile({ username }, `Username cannot be longer than ${USERNAME_MAX_LENGTH} characters.`, "error");
        return;
    }

    if (password && password.length < 6) {
        renderProfile({ username }, "Password must be at least 6 characters long.", "error");
        return;
    }

    const res = await fetch(`${API}/update_user.php`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            userId: id,
            username,
            password: password || null
        })
    });

    const data = await res.json();
    if (!data.success) {
        renderProfile({ username }, data.message || "Your profile could not be updated.", "error");
        return;
    }

    loadProfile("Your profile was updated successfully.", "success");
}

/* =========================
   LOGOUT
========================= */
function logout() {
    setCurrentUserId(null);
    renderLogin();
}