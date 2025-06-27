function openProject(projectId) {
    const details = {
        project1: "<b>Room Virtualization</b><br>Virtualize your room in 3D!",
        project2: "<b>\"Lil Guy\" 3D Model</b><br>A fun little 3D character.",
        project3: "<b>Liminal VR World</b><br>Explore liminal spaces in VR.",
        project4: "<b>6DoF Tracker</b><br>DIY 6DoF tracking hardware.",
        project5: "<b>Flaming Helmet</b><br>Yes, it was safe. Mostly.",
        project6: "<b>External Display</b><br>Attach extra screens to your Index.",
        project7: "<b>Finger Spacing</b><br>Knuckles controller finger tracking.",
        project8: "<b>Video Editing</b><br>My journey in video tutorials."
    };
    document.getElementById('wii-project-details').innerHTML = details[projectId] || "Project details coming soon!";
    document.getElementById('wii-project-modal').style.display = 'flex';
}
function closeProjectModal() {
    document.getElementById('wii-project-modal').style.display = 'none';
}