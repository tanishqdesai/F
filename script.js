// Common utility functions
const API_URL = 'http://localhost:5000/api';

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Show/hide navigation based on auth status
function updateNavigation() {
    const token = localStorage.getItem('token');
    const authLinks = document.querySelectorAll('.auth-link');
    const guestLinks = document.querySelectorAll('.guest-link');
    
    if (token) {
        authLinks.forEach(link => link.classList.remove('hidden'));
        guestLinks.forEach(link => link.classList.add('hidden'));
    } else {
        authLinks.forEach(link => link.classList.add('hidden'));
        guestLinks.forEach(link => link.classList.remove('hidden'));
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Show alert
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 5000);
}

// Export functions for use in HTML files
window.auth = {
    isLoggedIn,
    getAuthHeaders,
    updateNavigation,
    logout,
    formatFileSize,
    formatDate,
    showAlert,
    API_URL
};

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', updateNavigation);
