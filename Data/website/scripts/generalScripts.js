// generalScripts.js

document.addEventListener("DOMContentLoaded", function() {
    // Create dark mode toggle button
    const toggleButton = document.createElement("button");
    toggleButton.innerText = "Toggle Dark Mode";
    toggleButton.id = "darkModeToggle";
    document.body.insertBefore(toggleButton, document.querySelector(".header-container"));

    // Set initial theme based on device preference
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkMode) {
        document.body.classList.add("dark-mode");
    }

    // Function to toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    // Add click event listener to toggle button
    toggleButton.addEventListener("click", toggleDarkMode);

    // Disable autocomplete for all input fields
    const inputFields = document.querySelectorAll("input");
    inputFields.forEach(input => {
        input.setAttribute("autocomplete", "off");
    });
});

// Source - https://stackoverflow.com/a/65502583
// Posted by Wenfang Du, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-29, License - CC BY-SA 4.0

window.addEventListener('beforeunload', evt => {
  // Recommended
  evt.preventDefault()
  // Included for legacy support, e.g. Chrome/Edge < 119
  evt.returnValue = true
})

