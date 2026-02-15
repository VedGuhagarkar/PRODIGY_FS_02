const API_URL = "http://localhost:5000/api";

// LOGIN
async function login() 
{
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  try 
  {
    const res = await fetch(`${API_URL}/auth/login`, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) 
    {
      error.innerText = data.message || "Login failed";
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } catch 
  {
    error.innerText = "Server error";
  }
}

// LOGOUT
function logout() 
{
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// LOAD EMPLOYEES
async function loadEmployees() 
{
  const token = localStorage.getItem("token");
  if (!token) 
  {
    window.location.href = "login.html";
    return;
  }

  const res = await fetch(`${API_URL}/employees`, 
  {
    headers: { Authorization: token },
  });

  const employees = await res.json();
  const list = document.getElementById("employeeList");

  list.innerHTML = "";
  employees.forEach(emp => 
  {
    const li = document.createElement("li");
    li.innerHTML = `
      ${emp.name} - ${emp.department}
      <button onclick="deleteEmployee('${emp._id}')">Delete</button>
    `;
    list.appendChild(li);
  });
}

// ADD EMPLOYEE
async function addEmployee() 
{
  const token = localStorage.getItem("token");

  const employee = {
    name: name.value,
    email: email.value,
    role: role.value,
    department: department.value,
    salary: salary.value,
  };

  await fetch(`${API_URL}/employees`, 
  {
    method: "POST",
    headers: 
    {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(employee),
  });

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

// Auto-load employees on dashboard
if (window.location.pathname.includes("dashboard")) 
{
  loadEmployees();
}
