async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("mailerBox").style.display = "block";
  } else {
    alert("Invalid Login");
  }
}

async function sendMail() {
  const payload = {
    firstName: document.getElementById("firstName").value,
    sentFrom: document.getElementById("sentFrom").value,
    appPassword: document.getElementById("appPassword").value,
    subject: document.getElementById("subject").value,
    body: document.getElementById("body").value,
    mails: document.getElementById("mails").value
  };

  document.getElementById("status").innerText = "Sending...";

  const res = await fetch("/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  document.getElementById("status").innerText = data.message;
}