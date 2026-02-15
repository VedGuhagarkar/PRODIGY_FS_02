const API_URL = "http://127.0.0.1:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // If on dashboard page
  if (window.location.pathname.includes("dashboard")) {
    if (!token) {
      window.location.href = "login.html";
    } else {
      loadEmployees();
    }
  }

  // If on login page
  if (window.location.pathname.includes("login")) {
    if (token) {
      window.location.href = "dashboard.html";
    }
  }
});


// LOGIN
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  console.log("Login response:", data);

  if (!res.ok) {
    alert("Login failed");
    return;
  }

  // STORE TOKEN
  localStorage.setItem("token", data.token);
  console.log("Stored token:", data.token);

  window.location.href = "dashboard.html";
}




// LOGOUT
function logout() 
{
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// LOAD EMPLOYEES
async function loadEmployees() {
  const token = localStorage.getItem("token");
  console.log("Token:", token);

  const res = await fetch(`${API_URL}/employees`, {
    headers: { Authorization: token },
  });

  console.log("Response status:", res.status);

  const employees = await res.json();
  console.log("Employees:", employees);

  const table = document.getElementById("employeeTable");
  table.innerHTML = "";

  employees.forEach(emp => {
    table.innerHTML += `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.role}</td>
        <td>${emp.department}</td>
        <td>${emp.salary}</td>
      </tr>
    `;
  });
}



// ADD EMPLOYEE
async function addEmployee() {
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);

  const name = document.querySelector('input[placeholder="Name"]').value;
  const email = document.querySelector('input[placeholder="Email"]').value;
  const role = document.querySelector('input[placeholder="Role"]').value;
  const department = document.querySelector('input[placeholder="Department"]').value;
  const salary = document.querySelector('input[placeholder="Salary"]').value;

  if (!name || !email || !role || !department || !salary) {
    alert("Fill all fields");
    return;
  }

  const res = await fetch(`${API_URL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, email, role, department, salary })
  });

  const data = await res.json();
  console.log("Response:", data);

  if (!res.ok) {
    alert(data.message);
    return;
  }

  loadEmployees();
}




// DELETE EMPLOYEE
async function deleteEmployee(id) 
{
  const token = localStorage.getItem("token");

  await fetch(`${API_URL}/employees/${id}`, 
  {
    method: "DELETE",
    headers: { Authorization: token },
  });

  loadEmployees();
}

let editingId = null;

function editEmployee(id) {
  editingId = id;

  fetch(`${API_URL}/employees`, {
    headers: { Authorization: localStorage.getItem("token") }
  })
  .then(res => res.json())
  .then(data => {
    const emp = data.find(e => e._id === id);

    name.value = emp.name;
    email.value = emp.email;
    role.value = emp.role;
    department.value = emp.department;
    salary.value = emp.salary;
  });
}


// Auto-load employees on dashboard
if (window.location.pathname.includes("dashboard")) 
{
  loadEmployees();
}

function clearForm() {
  name.value = "";
  email.value = "";
  role.value = "";
  department.value = "";
  salary.value = "";
}
