document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.getElementById('settingsForm');
    const locationSettingsContainer = document.getElementById('locationSettingsContainer');
    const jsonOutput = document.getElementById('jsonOutput');
    let usedLocationIndices = [];

    // Add a new location setting
    document.getElementById('addWaterSetting').addEventListener('click', function() {
        // Find the next available index
        const locationIndex = findNextAvailableIndex();
        const locationDiv = createLocationDiv(locationIndex);
        locationSettingsContainer.appendChild(locationDiv);
    });

    // Function to create a new location div
    function createLocationDiv(locationIndex) {
        const locationDiv = document.createElement('div');
        locationDiv.className = 'location-setting';
        locationDiv.dataset.locationIndex = locationIndex; // Store index in data attribute
        
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

        // Event listener for adding a season
        locationDiv.querySelector('.addSeasonBtn').addEventListener('click', function() {
            const seasonContainer = locationDiv.querySelector('.season-container');
            addSeasonDiv(seasonContainer);
        });

        // Event listener for removing the location
        locationDiv.querySelector('.removeLocationBtn').addEventListener('click', function() {
            removeLocation(locationDiv);
        });

        // Add the used index to the array of used indices
        usedLocationIndices.push(locationIndex);

        return locationDiv;
    }

    // Function to find the next available index
    function findNextAvailableIndex() {
        for (let i = 1; i <= usedLocationIndices.length + 1; i++) {
            if (!usedLocationIndices.includes(i)) {
                return i;
            }
        }
    }

    // Function to remove a location and shift data from subsequent locations
    function removeLocation(locationDiv) {
        const locationIndex = parseInt(locationDiv.dataset.locationIndex);
        const indexToRemove = Array.from(locationSettingsContainer.children).indexOf(locationDiv);
        const totalLocations = locationSettingsContainer.children.length;

        // Shift data from subsequent locations to the removed location
        for (let i = indexToRemove + 1; i < totalLocations; i++) {
            const currentLocation = locationSettingsContainer.children[i];
            const previousLocation = locationSettingsContainer.children[i - 1];
            
            // Shift data from current to previous
            const currentLocationNameInput = currentLocation.querySelector('[name="locationName"]');
            const currentPriorityInput = currentLocation.querySelector('[name="priority"]');
            const currentSeasonContainer = currentLocation.querySelector('.season-container');
            
            const previousLocationNameInput = previousLocation.querySelector('[name="locationName"]');
            const previousPriorityInput = previousLocation.querySelector('[name="priority"]');
            const previousSeasonContainer = previousLocation.querySelector('.season-container');
            
            // Copy data from current location to previous location
            previousLocationNameInput.value = currentLocationNameInput.value;
            previousPriorityInput.value = currentPriorityInput.value;
            previousSeasonContainer.innerHTML = currentSeasonContainer.innerHTML;
        }

        // Clear the data in the last location (do not remove it)
        const lastLocation = locationSettingsContainer.children[totalLocations - 1];
        clearLocationData(lastLocation);

        // Remove the location div from the container
        locationSettingsContainer.removeChild(locationDiv);

        // Remove the used index from the array of used indices
        const index = usedLocationIndices.indexOf(locationIndex);
        if (index !== -1) {
            usedLocationIndices.splice(index, 1);
        }
    }

    function clearLocationData(location) {
        // Clear the inputs and inner HTML of the season container
        const locationNameInput = location.querySelector('[name="locationName"]');
        const priorityInput = location.querySelector('[name="priority"]');
        const seasonContainer = location.querySelector('.season-container');
    
        // Reset the value of the location name input to an empty string
        locationNameInput.value = '';
    
        // Reset the value of the priority input to an empty string
        priorityInput.value = '';
    
        // Clear the inner HTML of the season container to remove all seasons
        seasonContainer.innerHTML = '';
    }

    // Add a new season div within a location
    function addSeasonDiv(seasonContainer) {
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

        // Event listener for adding a water condition
        seasonDiv.querySelector('.addWaterConditionBtn').addEventListener('click', function() {
            const waterConditionContainer = seasonDiv.querySelector('.water-condition-container');
            addWaterConditionDiv(waterConditionContainer);
        });

        // Event listener for adding a wind condition
        seasonDiv.querySelector('.addWindConditionBtn').addEventListener('click', function() {
            const windConditionContainer = seasonDiv.querySelector('.wind-condition-container');
            addWindConditionDiv(windConditionContainer);
        });

        // Event listener for removing the season
        seasonDiv.querySelector('.removeSeasonBtn').addEventListener('click', function() {
            seasonContainer.removeChild(seasonDiv);
        });

        seasonContainer.appendChild(seasonDiv);
    }

    // Add a new water condition div within a season
    function addWaterConditionDiv(waterConditionContainer) {
        const waterConditionDiv = document.createElement('div');
        waterConditionDiv.className = 'water-condition-setting';
        waterConditionDiv.innerHTML = `
            <div style="padding-left: 20px; margin-bottom: 10px;">
                <label>Threshold: <input type="number" min="1" name="waterThreshold" placeholder="e.g. 1"></label><br>
                <label>Condition: <input type="text" name="waterCondition" placeholder="e.g. Clear"></label><br>
            </div>
            <button type="button" class="removeWaterConditionBtn">Remove Water Condition</button>
        `;

        // Event listener for removing the water condition
        waterConditionDiv.querySelector('.removeWaterConditionBtn').addEventListener('click', function() {
            waterConditionContainer.removeChild(waterConditionDiv);
        });

        waterConditionContainer.appendChild(waterConditionDiv);
    }

    // Add a new wind condition div within a season
    function addWindConditionDiv(windConditionContainer) {
        const windConditionDiv = document.createElement('div');
        windConditionDiv.className = 'wind-condition-setting';
        windConditionDiv.innerHTML = `
            <div style="padding-left: 20px; margin-bottom: 10px;">
                <label>Threshold: <input type="number" min="1" name="windThreshold" placeholder="e.g. 1"></label><br>
                <label>Condition: <input type="text" name="windCondition" placeholder="e.g. Light Breeze"></label><br>
            </div>
            <button type="button" class="removeWindConditionBtn">Remove Wind Condition</button>
        `;

        // Event listener for removing the wind condition
        windConditionDiv.querySelector('.removeWindConditionBtn').addEventListener('click', function() {
            windConditionContainer.removeChild(windConditionDiv);
        });

        windConditionContainer.appendChild(windConditionDiv);
    }

    // Function to generate JSON based on user input
    function generateJson() {
        const locations = {};

        // Iterate through each location div
        Array.from(locationSettingsContainer.children).forEach((locationDiv, locationIndex) => {
            const locationName = locationDiv.querySelector('[name="locationName"]').value || `Location${locationIndex + 1}`;
            const priority = locationDiv.querySelector('[name="priority"]').value || 999;
            const seasons = {};

            // Iterate through each season div within the current location
            Array.from(locationDiv.querySelectorAll('.season-setting')).forEach((seasonDiv, seasonIndex) => {
                const seasonName = seasonDiv.querySelector('[name="seasonName"]').value || `Season${seasonIndex + 1}`;
                const tempDice = seasonDiv.querySelector('[name="tempDice"]').value || "";
                const tempBase = seasonDiv.querySelector('[name="tempBase"]').value || 32;
                const waterDice = seasonDiv.querySelector('[name="waterDice"]').value || "1d20";
                const windDice = seasonDiv.querySelector('[name="windDice"]').value || "1d100";

                // Retrieve the conditions from the season div
                const waterConditions = retrieveConditions(seasonDiv, 'water');
                const windConditions = retrieveConditions(seasonDiv, 'wind');

                // Add the season data to the seasons dictionary
                seasons[seasonName] = {
                    temp_dice: tempDice,
                    temp_base: tempBase,
                    water_dice: waterDice,
                    water_conditions: waterConditions,
                    wind_dice: windDice,
                    wind_conditions: windConditions
                };
            });

            // Add the location data to the locations dictionary
            locations[locationName] = {
                priority: Number(priority),
                Seasons: seasons
            };
        });

        // Convert locations dictionary to JSON
        const jsonData = JSON.stringify(locations, null, 2);

        // Display the formatted JSON in the output element
        jsonOutput.textContent = jsonData;

        // Copy unformatted JSON string to the clipboard
        navigator.clipboard.writeText(JSON.stringify(locations))
            .then(() => {
                // Notify the user via a popup that the JSON was copied to the clipboard
                alert('JSON copied to clipboard!');
            })
            .catch((err) => {
                console.error("Failed to copy JSON to clipboard:", err);
            });
    }

    // Function to retrieve conditions from a season div
    function retrieveConditions(seasonDiv, type) {
        const conditionContainer = seasonDiv.querySelector(`.${type}-condition-container`);
        const conditions = {};

        Array.from(conditionContainer.children).forEach((conditionDiv, index) => {
            const threshold = conditionDiv.querySelector(`[name="${type}Threshold"]`).value;
            const condition = conditionDiv.querySelector(`[name="${type}Condition"]`).value;

            // Add each condition to the conditions dictionary
            if (threshold && condition) {
                conditions[threshold] = condition;
            }
        });

        return conditions;
    }

    // Event listener for form submission
    settingsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        generateJson();
    });
});
