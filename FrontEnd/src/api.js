const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  
  // Add auth token to headers if available
  const token = getAuthToken();
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  
  const res = await fetch(url, options);

  if (!res.ok) {
    let detail = 'Request failed';
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch (_) {
      // ignore json parse errors
    }
    throw new Error(detail);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function login({ email, password }) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return data; // { access_token, token_type }
}

export async function googleLogin(idToken) {
  return request('/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_token: idToken }),
  });
}

export async function getCurrentUser() {
  return request('/api/auth/me', {
    method: 'GET',
  });
}

export async function register({ fullName, email, dueDate, userType, password }) {
  // Send dates as YYYY-MM-DD strings (no timezone conversion needed)
  return request('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,      due_date: dueDate || null,      due_date: dueDate || null,
      user_type: userType,
    }),
  });
}

// ===== Static Data Endpoints =====
export async function getDailyTip() {
  return request('/api/static/daily-tip');
}

export async function getNutritionTips() {
  return request('/api/static/nutrition-tips');
}

export async function getVaccineSchedule() {
  return request('/api/static/vaccine-schedule');
}

export async function getFeedingGuide() {
  return request('/api/static/feeding-guide');
}

export async function getSafeFoods() {
  return request('/api/static/safe-foods');
}

// ===== Growth Records =====
export async function getGrowthRecords() {
  return request('/api/growth/records');
}

export async function createGrowthRecord(recordData) {
  return request('/api/growth/records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recordData),
  });
}

export async function deleteGrowthRecord(recordId) {
  return request(`/api/growth/records/${recordId}`, {
    method: 'DELETE',
  });
}

// ===== Babies =====
export async function getBabies() {
  return request('/api/babies');
}

export async function getBaby(babyId) {
  return request(`/api/babies/${babyId}`);
}

export async function createBaby(babyData) {
  return request('/api/babies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(babyData),
  });
}

export async function updateBaby(babyId, babyData) {
  return request(`/api/babies/${babyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(babyData),
  });
}

export async function deleteBaby(babyId) {
  return request(`/api/babies/${babyId}`, {
    method: 'DELETE',
  });
}

export async function getBabyGrowthRecords(babyId) {
  return request(`/api/babies/${babyId}/growth`);
}

// ===== Reminders =====
export async function getReminders() {
  return request('/api/reminders/');
}

export async function createReminder(reminderData) {
  return request('/api/reminders/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reminderData),
  });
}

export async function completeReminder(reminderId) {
  return request(`/api/reminders/${reminderId}/complete`, {
    method: 'PATCH',
  });
}

export async function deleteReminder(reminderId) {
  return request(`/api/reminders/${reminderId}`, {
    method: 'DELETE',
  });
}

// ===== Profile Endpoints =====
export async function getUserProfile() {
  return request('/api/profile', {
    method: 'GET',
  });
}

export async function updateUserProfile(profileData) {
  return request('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
}

export async function saveEmergencyContact(contactData) {
  return request('/api/profile/emergency-contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactData),
  });
}

export async function getEmergencyContact() {
  return request('/api/profile/emergency-contact', {
    method: 'GET',
  });
}

export async function deleteEmergencyContact() {
  return request('/api/profile/emergency-contact', {
    method: 'DELETE',
  });
}

export async function sendPartnerInvite(partnerEmail) {
  return request('/api/profile/partner-invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partner_email: partnerEmail }),
  });
}

export async function getPartnerInvitations() {
  return request('/api/profile/partner-invitations', {
    method: 'GET',
  });
}

export async function acceptPartnerInvitation(invitationId) {
  return request(`/api/profile/partner-invitations/${invitationId}/accept`, {
    method: 'PATCH',
  });
}

export async function declinePartnerInvitation(invitationId) {
  return request(`/api/profile/partner-invitations/${invitationId}/decline`, {
    method: 'PATCH',
  });
}

// ===== Vaccine Endpoints =====
export async function getAllVaccines() {
  return request('/api/vaccines');
}

export async function getVaccineById(vaccineId) {
  return request(`/api/vaccines/${vaccineId}`);
}

export async function getUserVaccineReminders() {
  return request('/api/vaccines/reminders/user');
}

export async function createVaccineReminder(vaccineData) {
  return request('/api/vaccines/reminders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vaccineData),
  });
}

export async function updateVaccineReminderStatus(reminderId, statusData) {
  return request(`/api/vaccines/reminders/${reminderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(statusData),
  });
}

export async function deleteVaccineReminder(reminderId) {
  return request(`/api/vaccines/reminders/${reminderId}`, {
    method: 'DELETE',
  });
}

// ===== Auth Token Management =====
export function setAuthToken(token) {
  if (!token) return;
  localStorage.setItem('auth_token', token);
}

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token');
}

