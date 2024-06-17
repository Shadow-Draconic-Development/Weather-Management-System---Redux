// mainScript.js
import { collectSeasonUrls } from './seasonUrlScript.js';
import { collectWaterSettings } from './waterScript.js';
import { collectWindSettings } from './windScript.js';
import { collectTempSettings } from './tempScript.js';
import { collectColorSettings } from './colorScript.js';

async function generateJSON() {
    const settings = {
        water: {},
        wind: {},
        temp: {},
        colors: {},
        url: {},
        unit: "",
    };

    const waterSettings = collectWaterSettings();
    if (waterSettings === null) {
        alert("Error collecting water settings. Please check the inputs and try again.");
        return null;
    }
    settings.water = waterSettings;

    const windSettings = collectWindSettings();
    if (windSettings === null) {
        alert("Error collecting wind settings. Please check the inputs and try again.");
        return null;
    }
    settings.wind = windSettings;

    const tempSettings = collectTempSettings();
    if (tempSettings === null) {
        alert("Error collecting temperature settings. Please check the inputs and try again.");
        return null;
    }
    settings.temp = tempSettings;

    const colorSettings = collectColorSettings();
    if (colorSettings === null) {
        alert("Error collecting color settings. Please check the inputs and try again.");
        return null;
    }
    settings.colors = colorSettings;

    const { imageUrls, urlsValid } = await collectSeasonUrls();
    if (!urlsValid) {
        alert("There was an error with the season URL validation. Please correct the errors and try again.");
        return null;
    }
    settings.url = imageUrls;

    const unitInput = document.getElementById("unit");
    if (unitInput) {
        settings.unit = unitInput.value;
    }

    return settings;
}

function copyJSONToClipboard(jsonObject) {
    const jsonString = JSON.stringify(jsonObject);

    navigator.clipboard.writeText(jsonString)
        .then(() => {
            alert("JSON copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy text:", err);
        });

    const formattedJsonString = JSON.stringify(jsonObject, null, 2);
    const jsonOutput = document.getElementById("jsonOutput");
    if (jsonOutput) {
        jsonOutput.textContent = formattedJsonString;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    initializeFormSubmission();
});

async function initializeFormSubmission() {
    let colorSettings = null;
    const form = document.getElementById("settingsForm");
    if (!form) {
        console.error("Form with ID 'settingsForm' not found.");
        return;
    }

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        colorSettings = collectColorSettings();
        const jsonObject = await generateJSON();
        if (jsonObject) {
            copyJSONToClipboard(jsonObject);
        }
    });
}
