const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if(data.token && data.role === "admin") {
    window.location.href = "admin.html";
  } else if(data.token) {
    alert("Logged in as user");
  } else {
    alert(data.message);
  }
});
