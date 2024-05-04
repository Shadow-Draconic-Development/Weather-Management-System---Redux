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
});
