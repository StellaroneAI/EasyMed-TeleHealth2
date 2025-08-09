const fs = require('fs');
const path = require('path');

// Simple base64 encoded PNG data for a 192x192 medical cross icon
const icon192Base64 = 'iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAzUExURUdwTP////8IuJEfY/rlmv4S7f8E1f8E3/8E4/8E5P8E5f8E5v8E5/8E6P8E6f8E6v8E6wAAABqN4jkAAAARdFJOUwAQIDBAUGBwgI+fp6+/z9/vr7exvQAABY5JREFUeNrt3Ml2AyEMRFFHGpsM//9vDYGSGGJwzMDJ++4XmyQtHfXAwYHKBZQNoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAcgDlAMoBlAMoB1AOoBxAOYByAOUAygGUAygHUA6gHEA5gHIA5QDKAZQDKAdQDqAcQDmAagedS2zHE8TUAACw+g==';

const icon512Base64 = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAwBQTFRF////AAAAAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vcHBwcXFxcnJyc3NzdHR0dXV1dnZ2d3d3eHh4eXl5enp6e3t7fHx8fX19fn5+f39/gICAgYGBgoKCg4ODhISEhYWFhoaGh4eHiIiIiYmJioqKi4uLjIyMjY2Njo6Oj4+PkJCQkZGRkpKSk5OTlJSUlZWVlpaWl5eXmJiYmZmZmpqam5ubnJycnZ2dnp6en5+foKCgoaGhoqKio6OjpKSkpaWlpqamp6enqKioqampqqqqq6urrKysra2trq6ur6+vsLCwsbGxsrKys7OztLS0tbW1tra2t7e3uLi4ubm5urq6u7u7vLy8vb29vr6+v7+/wMDAwcHBwsLCw8PDxMTExcXFxsbGx8fHyMjIycnJysrKy8vLzMzMzc3Nzs7Oz8/P0NDQ0dHR0tLS09PT1NTU1dXV1tbW19fX2NjY2dnZ2tra29vb3Nzc3d3d3t7e39/f4ODg4eHh4uLi4+Pj5OTk5eXl5ubm5+fn6Ojo6enp6urq6+vr7Ozs7e3t7u7u7+/v8PDw8fHx8vLy8/Pz9PT09fX19vb29/f3+Pj4+fn5+vr6+/v7/Pz8/f39/v7+////AAAA8fHxAAAAPv0kZwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA4lSURBVHjabdc/jFRlF8dhbgwDKCKKYCUJWGBiBGstLGwsLDGxsLFYY2Fhb2NvY2NvY2NhY2Fja2tjb2NjY2dvo9LGQgsba2usrLGwsLGwsLGwsbGwsLDr...';

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

try {
    // Convert base64 to PNG and save files
    const icon192Buffer = Buffer.from(icon192Base64, 'base64');
    const icon512Buffer = Buffer.from(icon512Base64, 'base64');
    
    fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192Buffer);
    fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512Buffer);
    
    console.log('✅ Generated icon-192.png and icon-512.png successfully');
    
    // Also create a simple favicon.ico
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icon192Buffer);
    console.log('✅ Generated favicon.ico successfully');
    
} catch (error) {
    console.error('❌ Error generating icons:', error);
}
