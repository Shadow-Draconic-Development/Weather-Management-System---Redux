// Import necessary functions from other scripts
import { collectSeasonUrls } from './seasonUrlScript.js';
import { collectWaterSettings } from './waterScript.js';
import { collectWindSettings } from './windScript.js';
import { collectTempSettings } from './tempScript.js';
import { collectColorSettings } from './colorScript.js';

// Function to generate a JSON object based on all settings
async function generateJSON() {
    // Create a JSON object to hold the settings
    const settings = {
        water: {},
        wind: {},
        temperature: {},
        colors: {},
        url: {},
        unit: "",
    };

    // Collect water settings using the imported function
    const waterSettings = collectWaterSettings();
    if (waterSettings === null) {
        alert("Error collecting water settings. Please check the inputs and try again.");
        return null; // Stop function execution
    }

    // Add the collected water settings to the settings object
    settings.water = waterSettings;

    // Collect water settings using the imported function
    const windSettings = collectWindSettings();
    if (windSettings === null) {
        alert("Error collecting wind settings. Please check the inputs and try again.");
        return null; // Stop function execution
    }

    // Add the collected water settings to the settings object
    settings.wind = windSettings;

    // Collect water settings using the imported function
    const tempSettings = collectTempSettings();
    if (tempSettings === null) {
        alert("Error collecting temperature settings. Please check the inputs and try again.");
        return null; // Stop function execution
    }

    // Add the collected water settings to the settings object
    settings.temperature = tempSettings;

    // Collect color settings
    const colorSettings = collectColorSettings();
    
    // If there is an error during color settings collection, stop execution and inform the user
    if (colorSettings === null) {
        alert("Error collecting color settings. Please check the inputs and try again.");
        return null; // Stop function execution
    }
    
    // Add the validated color settings to the settings object
    settings.colors = colorSettings;

    // Collect season URLs and check validation
    const { imageUrls, urlsValid } = await collectSeasonUrls();
    if (!urlsValid) {
        alert("There was an error with the season URL validation. Please correct the errors and try again.");
        return null;
    }

    // Add the validated season URLs to the settings object
    settings.url = imageUrls;

    // Collect the unit setting from the input element with ID "unit"
    const unitInput = document.getElementById("unit");
    if (unitInput) {
        settings.unit = unitInput.value;
    }

    // Return the settings JSON object
    return settings;
}


// Function to copy JSON string to clipboard
function copyJSONToClipboard(jsonObject) {
    // Convert the JSON object to a compact JSON string
    const jsonString = JSON.stringify(jsonObject);

    // Copy the compact JSON string to the clipboard
    navigator.clipboard.writeText(jsonString)
        .then(() => {
            alert("JSON copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy text:", err);
        });

    // Convert the JSON object to a formatted JSON string
    const formattedJsonString = JSON.stringify(jsonObject, null, 2);

    // Display the formatted JSON string in the output element
    const jsonOutput = document.getElementById("jsonOutput");
    if (jsonOutput) {
        jsonOutput.textContent = formattedJsonString;
    }
}

// Initialization after document is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Only initialize form submission when the document is fully loaded
    initializeFormSubmission();
});

// Function to handle form submission and user interactions
async function initializeFormSubmission() {
    // Define the color settings; don't collect them here
    // Wait for user interactions or form submission to trigger the function
    let colorSettings = null;

    // Get the form element
    const form = document.getElementById("settingsForm");

    // Ensure the form exists
    if (!form) {
        console.error("Form with ID 'settingsForm' not found.");
        return;
    }

    // Add submit event listener to the form
    form.addEventListener("submit", async function(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Collect color settings only when form is submitted
        colorSettings = collectColorSettings();

        // Generate a JSON object based on water, wind, temperature, and color settings
        const jsonObject = await generateJSON();

        // If the JSON object is valid, proceed to copy it to the clipboard
        if (jsonObject) {
            copyJSONToClipboard(jsonObject);
        }
    });
}
