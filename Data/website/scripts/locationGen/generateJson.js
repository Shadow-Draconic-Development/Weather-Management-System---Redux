import { loadFormState, clearAllFormStates, setupAutoSave } from "../persistence.js";

document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.getElementById("settingsForm");
    const locationSettingsContainer = document.getElementById("locationSettingsContainer");
    const jsonOutput = document.getElementById("jsonOutput");
    let usedLocationIndices = [];

    // Load saved state if available
    const savedState = loadFormState("location");
    if (savedState && savedState.locations && savedState.locations.length > 0) {
        restoreSavedState(savedState);
    }

    // Setup auto-save
    setupAutoSave("location", "locationSettingsContainer", collectLocationState);

    document.getElementById("addWaterSetting").addEventListener("click", function() {
        const locationIndex = findNextAvailableIndex();
        const locationDiv = createLocationDiv(locationIndex);
        locationSettingsContainer.appendChild(locationDiv);
    });

    function createLocationDiv(locationIndex) {
        const locationDiv = document.createElement('div');
        locationDiv.className = 'location-setting';
        locationDiv.dataset.locationIndex = locationIndex;

        locationDiv.innerHTML = `
            <h3>Location</h3>
            <label for="locationName">Location Name:</label>
            <input type="text" id="locationName" name="locationName" placeholder="Location Name">
            <label for="priority">Priority:</label>
            <input type="number" id="priority" name="priority" min="0" placeholder="999">
            <button type="button" class="addSeasonBtn">Add Season</button>
            <button type="button" class="removeLocationBtn">Remove Location</button>
            <div class="season-container"></div>
        `;

        locationDiv.querySelector('.addSeasonBtn').addEventListener('click', function() {
            const seasonContainer = locationDiv.querySelector('.season-container');
            addSeasonDiv(seasonContainer);
        });

        locationDiv.querySelector('.removeLocationBtn').addEventListener('click', function() {
            removeLocation(locationDiv);
        });

        usedLocationIndices.push(locationIndex);

        return locationDiv;
    }

    function findNextAvailableIndex() {
        for (let i = 1; i <= usedLocationIndices.length + 1; i++) {
            if (!usedLocationIndices.includes(i)) {
                return i;
            }
        }
    }

    function removeLocation(locationDiv) {
        const locationIndex = parseInt(locationDiv.dataset.locationIndex);
        const indexToRemove = Array.from(locationSettingsContainer.children).indexOf(locationDiv);
        const totalLocations = locationSettingsContainer.children.length;

        for (let i = indexToRemove + 1; i < totalLocations; i++) {
            const currentLocation = locationSettingsContainer.children[i];
            const previousLocation = locationSettingsContainer.children[i - 1];

            const currentLocationNameInput = currentLocation.querySelector('[name="locationName"]');
            const currentPriorityInput = currentLocation.querySelector('[name="priority"]');
            const currentSeasonContainer = currentLocation.querySelector('.season-container');

            const previousLocationNameInput = previousLocation.querySelector('[name="locationName"]');
            const previousPriorityInput = previousLocation.querySelector('[name="priority"]');
            const previousSeasonContainer = previousLocation.querySelector('.season-container');

            previousLocationNameInput.value = currentLocationNameInput.value;
            previousPriorityInput.value = currentPriorityInput.value;
            previousSeasonContainer.innerHTML = currentSeasonContainer.innerHTML;
        }

        const lastLocation = locationSettingsContainer.children[totalLocations - 1];
        clearLocationData(lastLocation);

        locationSettingsContainer.removeChild(locationDiv);

        const index = usedLocationIndices.indexOf(locationIndex);
        if (index !== -1) {
            usedLocationIndices.splice(index, 1);
        }
    }

    function clearLocationData(location) {
        const locationNameInput = location.querySelector('[name="locationName"]');
        const priorityInput = location.querySelector('[name="priority"]');
        const seasonContainer = location.querySelector('.season-container');

        locationNameInput.value = '';
        priorityInput.value = '';
        seasonContainer.innerHTML = '';
    }

    function addSeasonDiv(seasonContainer) {
        createSeasonDiv(seasonContainer);
    }

    function addWaterConditionDiv(waterConditionContainer) {
        createWaterConditionDiv(waterConditionContainer);
    }

    function addWindConditionDiv(windConditionContainer) {
        createWindConditionDiv(windConditionContainer);
    }

    function generateJson() {
        const locations = {};

        Array.from(locationSettingsContainer.children).forEach((locationDiv) => {
            const locationName = locationDiv.querySelector('[name="locationName"]').value || `Location`;
            const priority = locationDiv.querySelector('[name="priority"]').value || 999;
            const seasons = {};

            Array.from(locationDiv.querySelectorAll('.season-setting')).forEach((seasonDiv) => {
                const seasonName = seasonDiv.querySelector('[name="seasonName"]').value || `Season`;
                const tempDice = seasonDiv.querySelector('[name="tempDice"]').value || "2d10";
                const tempBase = seasonDiv.querySelector('[name="tempBase"]').value || 32;
                const waterDice = seasonDiv.querySelector('[name="waterDice"]').value || "1d20";
                const windDice = seasonDiv.querySelector('[name="windDice"]').value || "1d100";

                const waterConditions = retrieveConditions(seasonDiv, 'water');
                const windConditions = retrieveConditions(seasonDiv, 'wind');

                seasons[seasonName] = {
                    temp_dice: tempDice,
                    temp_base: Number(tempBase),
                    water_dice: waterDice,
                    water_conditions: waterConditions,
                    wind_dice: windDice,
                    wind_conditions: windConditions
                };
            });

            locations[locationName] = {
                priority: Number(priority),
                ...seasons
            };
        });

        const jsonString = JSON.stringify(locations).replace(/['‘’‚‛]/g, "\\'"); // Use regex for compatibility
        const formattedJsonData = `'${jsonString}'`;

        jsonOutput.textContent = formattedJsonData;

        navigator.clipboard.writeText(formattedJsonData)
            .then(() => {
                alert("JSON copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy JSON to clipboard:", err);
            });
    }

    function retrieveConditions(seasonDiv, type) {
        const conditionContainer = seasonDiv.querySelector(`.${type}-condition-container`);
        const conditions = {};

        Array.from(conditionContainer.children).forEach((conditionDiv) => {
            const threshold = conditionDiv.querySelector(`[name="${type}Threshold"]`).value;
            const condition = conditionDiv.querySelector(`[name="${type}Condition"]`).value;

            if (threshold && condition) {
                conditions[threshold] = condition;
            }
        });

        return conditions;
    }

    function collectLocationState() {
        const locations = [];
        Array.from(locationSettingsContainer.children).forEach((locationDiv) => {
            const locationName = locationDiv.querySelector('[name="locationName"]').value || '';
            const priority = locationDiv.querySelector('[name="priority"]').value || '';
            const seasons = [];

            Array.from(locationDiv.querySelectorAll('.season-setting')).forEach((seasonDiv) => {
                const seasonName = seasonDiv.querySelector('[name="seasonName"]').value || '';
                const tempDice = seasonDiv.querySelector('[name="tempDice"]').value || '';
                const tempBase = seasonDiv.querySelector('[name="tempBase"]').value || '';
                const waterDice = seasonDiv.querySelector('[name="waterDice"]').value || '';
                const windDice = seasonDiv.querySelector('[name="windDice"]').value || '';

                const waterConditions = [];
                seasonDiv.querySelectorAll('.water-condition-setting').forEach((condDiv) => {
                    waterConditions.push({
                        threshold: condDiv.querySelector('[name="waterThreshold"]').value || '',
                        condition: condDiv.querySelector('[name="waterCondition"]').value || ''
                    });
                });

                const windConditions = [];
                seasonDiv.querySelectorAll('.wind-condition-setting').forEach((condDiv) => {
                    windConditions.push({
                        threshold: condDiv.querySelector('[name="windThreshold"]').value || '',
                        condition: condDiv.querySelector('[name="windCondition"]').value || ''
                    });
                });

                seasons.push({
                    seasonName,
                    tempDice,
                    tempBase,
                    waterDice,
                    windDice,
                    waterConditions,
                    windConditions
                });
            });

            locations.push({
                locationName,
                priority,
                seasons
            });
        });

        return { locations };
    }

    function restoreSavedState(savedState) {
        if (!savedState.locations) return;

        savedState.locations.forEach((locationData) => {
            const locationDiv = createLocationDiv(usedLocationIndices.length + 1);
            locationDiv.querySelector('[name="locationName"]').value = locationData.locationName || '';
            locationDiv.querySelector('[name="priority"]').value = locationData.priority || '';

            locationData.seasons.forEach((seasonData) => {
                const seasonContainer = locationDiv.querySelector('.season-container');
                const seasonDiv = createSeasonDiv(seasonContainer);

                seasonDiv.querySelector('[name="seasonName"]').value = seasonData.seasonName || '';
                seasonDiv.querySelector('[name="tempDice"]').value = seasonData.tempDice || '';
                seasonDiv.querySelector('[name="tempBase"]').value = seasonData.tempBase || '';
                seasonDiv.querySelector('[name="waterDice"]').value = seasonData.waterDice || '';
                seasonDiv.querySelector('[name="windDice"]').value = seasonData.windDice || '';

                seasonData.waterConditions.forEach((condData) => {
                    const waterContainer = seasonDiv.querySelector('.water-condition-container');
                    const condDiv = createWaterConditionDiv(waterContainer);
                    condDiv.querySelector('[name="waterThreshold"]').value = condData.threshold || '';
                    condDiv.querySelector('[name="waterCondition"]').value = condData.condition || '';
                });

                seasonData.windConditions.forEach((condData) => {
                    const windContainer = seasonDiv.querySelector('.wind-condition-container');
                    const condDiv = createWindConditionDiv(windContainer);
                    condDiv.querySelector('[name="windThreshold"]').value = condData.threshold || '';
                    condDiv.querySelector('[name="windCondition"]').value = condData.condition || '';
                });
            });

            locationSettingsContainer.appendChild(locationDiv);
        });
    }

    function createSeasonDiv(seasonContainer) {
        const seasonDiv = document.createElement('div');
        seasonDiv.className = 'season-setting';
        seasonDiv.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4>Season Name: <input type="text" name="seasonName" placeholder="e.g. Spring"></h4>
                <div style="display: flex; flex-direction: column;">
                    <label>Temperature Dice Type: <input type="text" name="tempDice" placeholder="e.g. 2d10"></label>
                    <label>Temperature Base: <input type="number" name="tempBase" placeholder="e.g. 32"></label>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label>Water Dice Type: <input type="text" name="waterDice" placeholder="e.g. 1d20"></label>
                    <button type="button" class="addWaterConditionBtn">Add Water Condition</button>
                    <div class="water-condition-container"></div>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label>Wind Dice Type: <input type="text" name="windDice" placeholder="e.g. 1d100"></label>
                    <button type="button" class="addWindConditionBtn">Add Wind Condition</button>
                    <div class="wind-condition-container"></div>
                </div>
            </div>
            <button type="button" class="removeSeasonBtn">Remove Season</button>
        `;

        seasonDiv.querySelector('.addWaterConditionBtn').addEventListener('click', function() {
            const waterConditionContainer = seasonDiv.querySelector('.water-condition-container');
            createWaterConditionDiv(waterConditionContainer);
        });

        seasonDiv.querySelector('.addWindConditionBtn').addEventListener('click', function() {
            const windConditionContainer = seasonDiv.querySelector('.wind-condition-container');
            createWindConditionDiv(windConditionContainer);
        });

        seasonDiv.querySelector('.removeSeasonBtn').addEventListener('click', function() {
            seasonContainer.removeChild(seasonDiv);
        });

        seasonContainer.appendChild(seasonDiv);
        return seasonDiv;
    }

    function createWaterConditionDiv(waterConditionContainer) {
        const waterConditionDiv = document.createElement('div');
        waterConditionDiv.className = 'water-condition-setting';
        waterConditionDiv.innerHTML = `
            <div style="padding-left: 20px; margin-bottom: 10px;">
                <label>Threshold: <input type="number" min="1" name="waterThreshold" placeholder="e.g. 1"></label><br>
                <label>Condition: <input type="text" name="waterCondition" placeholder="e.g. Clear"></label><br>
            </div>
            <button type="button" class="removeWaterConditionBtn">Remove Water Condition</button>
        `;

        waterConditionDiv.querySelector('.removeWaterConditionBtn').addEventListener('click', function() {
            waterConditionContainer.removeChild(waterConditionDiv);
        });

        waterConditionContainer.appendChild(waterConditionDiv);
        return waterConditionDiv;
    }

    function createWindConditionDiv(windConditionContainer) {
        const windConditionDiv = document.createElement('div');
        windConditionDiv.className = 'wind-condition-setting';
        windConditionDiv.innerHTML = `
            <div style="padding-left: 20px; margin-bottom: 10px;">
                <label>Threshold: <input type="number" min="1" name="windThreshold" placeholder="e.g. 1"></label><br>
                <label>Condition: <input type="text" name="windCondition" placeholder="e.g. Light Breeze"></label><br>
            </div>
            <button type="button" class="removeWindConditionBtn">Remove Wind Condition</button>
        `;

        windConditionDiv.querySelector('.removeWindConditionBtn').addEventListener('click', function() {
            windConditionContainer.removeChild(windConditionDiv);
        });

        windConditionContainer.appendChild(windConditionDiv);
        return windConditionDiv;
    }

    settingsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        generateJson();
    });
});
