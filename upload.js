<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FileShare - Upload</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <h1>FileShare</h1>
        <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="myfiles.html">My Files</a></li>
            <li><a href="downloads.html">Downloads</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="card">
            <h2>Upload File</h2>
            <form id="uploadForm">
                <div class="form-group">
                    <label for="file">Select File (PDF or MP4, max 20MB)</label>
                    <input type="file" id="file" name="file" accept=".pdf,.mp4" required>
                </div>
                <div class="form-group">
                    <label for="privacy">Privacy Setting</label>
                    <select id="privacy" name="privacy" required>
                        <option value="private">Private (Only accessible via share link)</option>
                        <option value="public">Public (Visible to everyone)</option>
                    </select>
                </div>
                <button type="submit" class="btn">Upload</button>
            </form>
            <div id="uploadProgress" class="hidden" style="margin-top: 1rem;">
                <p>Uploading... <span id="progressText">0%</span></p>
                <div style="width: 100%; background: #f0f0f0; border-radius: 5px; overflow: hidden;">
                    <div id="progressBar" style="height: 20px; background: #667eea; width: 0%;"></div>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
    // Check if user is logged in
        if (!window.auth.isLoggedIn()) {
            window.location.href = 'login.html';
        }
        
        document.getElementById('uploadForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('file');
            const privacy = document.getElementById('privacy').value;
            const file = fileInput.files[0];
            
            // Basic validation
            if (!file) {
                alert('Please select a file');
                return;
            }
            
            // Check file type
            const allowedTypes = ['application/pdf', 'video/mp4'];
            if (!allowedTypes.includes(file.type)) {
                alert('Only PDF and MP4 files are allowed');
                return;
            }
            
            // Check file size (20MB)
            if (file.size > 20 * 1024 * 1024) {
                alert('File size must be less than 20MB');
                return;
            }
