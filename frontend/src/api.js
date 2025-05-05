const API_BASE_URL = "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  options.headers = {
    "Content-Type": "application/json",
    ...headers,
  };
  if (options.body && typeof options.body !== "string") {
    options.body = JSON.stringify(options.body);
  }
  const response = await fetch(API_BASE_URL + path, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }
  return data;
}

// Authentication APIs
export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function signup(full_name, email, phone, password, role = "patient") {
  return request("/auth/signup", {
    method: "POST",
    body: { full_name, email, phone, password, role },
  });
}

// Dashboard
export async function getDashboard() {
  return request("/dashboard");
}

// Appointments
export async function getAppointments() {
  return request("/appointments");
}

export async function bookAppointment(doctor_name, department, scheduled_at) {
  return request("/appointments", {
    method: "POST",
    body: { doctor_name, department, scheduled_at },
  });
}

// Medical Records
export async function getMedicalRecords() {
  return request("/records");
}

// Billing
export async function getBilling() {
  return request("/billing");
}

// Notifications
export async function getNotifications() {
  return request("/notifications");
}

// Bed Status
export async function getBedStatus() {
  return request("/bed-status");
}

// Chatbot
export async function askChatbot(question) {
  return request("/chatbot", {
    method: "POST",
    body: { question },
  });
}