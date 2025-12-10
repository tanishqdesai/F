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
