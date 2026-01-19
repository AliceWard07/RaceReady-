document.addEventListener("DOMContentLoaded", () => {
  let NameInput = document.getElementById("Name");
  let EmailInput = document.getElementById("Email");
  let PasswordInput = document.getElementById("Password");
  let Button = document.getElementById("Button");

  let users = JSON.parse(localStorage.getItem("users")) || [];

  Button.addEventListener("click", signUp);

  function signUp() {
    let Name = NameInput.value.trim();
    let Email = EmailInput.value.trim();
    let Password = PasswordInput.value;

    if (!Name || !Email || !Password) {
      alert("Please fill in all fields.");
      return;
    }

    if (users.some(u => u.Email === Email)) {
      alert("Email already in use.");
      return;
    }

    if (!ValidEmail(Email)) {
      alert("Invalid email format.");
      return;
    }

    if (!ValidPassword(Password)) {
      alert("Password must be at least 8 characters and include at least 1 capital letter and 1 number.");
      return;
    }

    let user = { Name, Email, Password, times: [] };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful!");
    clearForm();
    window.location.href = "index.html";
  }

  function ValidEmail(email) {
    return email.includes("@") && email.includes(".");
  }

  function ValidPassword(password) {
    if (password.length < 8) return false;
    return /[0-9]/.test(password) && /[A-Z]/.test(password);
  }

  function clearForm() {
    NameInput.value = "";
    EmailInput.value = "";
    PasswordInput.value = "";
  }
});






