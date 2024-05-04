// Initialize a list to keep track of water settings
const waterSettings = [];

// Function to create a new water setting
function createWaterSetting() {
    const waterSettingCount = waterSettings.length + 1;

    const container = document.getElementById("waterSettingsContainer");

    // Create a new fieldset for the water setting
    const fieldset = document.createElement("fieldset");
    fieldset.id = `waterSetting${waterSettingCount}`;
    fieldset.waterSettingIndex = waterSettingCount;

    // Create a legend for the fieldset
    const legend = document.createElement("legend");
    legend.textContent = `Water Setting ${waterSettingCount}`;
    fieldset.appendChild(legend);

    // Create input elements for the water setting
    const nameInput = createInputElement(`waterSettingName${waterSettingCount}`, "text", "Setting Name:");
    const minRateInput = createInputElement(`waterSettingMinRate${waterSettingCount}`, "number", "Min Rate:", 0.01);
    const maxRateInput = createInputElement(`waterSettingMaxRate${waterSettingCount}`, "number", "Max Rate:", 0.01);
    const conditionInput = createInputElement(`waterSettingCondition${waterSettingCount}`, "text", "Condition:");

    // Append all inputs and labels to the fieldset
    fieldset.appendChild(nameInput.label);
    fieldset.appendChild(nameInput.input);
    fieldset.appendChild(minRateInput.label);
    fieldset.appendChild(minRateInput.input);
    fieldset.appendChild(maxRateInput.label);
    fieldset.appendChild(maxRateInput.input);
    fieldset.appendChild(conditionInput.label);
    fieldset.appendChild(conditionInput.input);

    // Add a delete button to remove the water setting
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        deleteWaterSetting(waterSettingCount, fieldset);
    };
    fieldset.appendChild(deleteButton);

    // Append the fieldset to the container
    container.appendChild(fieldset);

    // Add the new water setting to the list
    waterSettings.push(fieldset);
}

// Function to delete a water setting and adjust numbering
function deleteWaterSetting(waterSettingCount, fieldset) {
    const container = document.getElementById("waterSettingsContainer");

    // Remove the fieldset from the DOM
    container.removeChild(fieldset);

    // Remove the deleted setting from the list of water settings
    waterSettings.splice(waterSettingCount - 1, 1);

    // Adjust numbering for the remaining water settings
    for (let i = 0; i < waterSettings.length; i++) {
        const fieldset = waterSettings[i];
        const newWaterSettingCount = i + 1;

        // Update the fieldset ID, legend, and input names/ids
        fieldset.id = `waterSetting${newWaterSettingCount}`;
        fieldset.waterSettingIndex = newWaterSettingCount;

        const legend = fieldset.querySelector("legend");
        legend.textContent = `Water Setting ${newWaterSettingCount}`;

        // Update input names and IDs
        const inputs = fieldset.querySelectorAll("input");
        inputs.forEach(input => {
            input.name = input.name.replace(/waterSetting\d+/, `waterSetting${newWaterSettingCount}`);
            input.id = input.id.replace(/waterSetting\d+/, `waterSetting${newWaterSettingCount}`);
        });

        // Update the delete button's function
        const deleteButton = fieldset.querySelector("button[type='button']");
        deleteButton.onclick = function() {
            deleteWaterSetting(newWaterSettingCount, fieldset);
        };
    }
}

// Function to validate water settings
function validateWaterSettings() {
    const settingNames = new Set(); // Use a set to track unique names
    for (let i = 0; i < waterSettings.length; i++) {
        const settingName = document.getElementById(`waterSettingName${i + 1}`).value.trim().toLowerCase();

        // Check if the setting name is blank
        if (!settingName) {
            alert(`Error: Water Setting ${i + 1} has a blank name. Please provide a setting name.`);
            return false;
        }

        // Check if the setting name is a duplicate
        if (settingNames.has(settingName)) {
            alert(`Error: Water Setting ${i + 1} has a duplicate name. Please provide a unique name.`);
            return false;
        }

        // Add the setting name to the set to track it
        settingNames.add(settingName);
    }
    return true;
}

// Function to validate `min_rate` and `max_rate`
function validateMinMaxRates() {
    for (let i = 0; i < waterSettings.length; i++) {
        const minRateInput = document.getElementById(`waterSettingMinRate${i + 1}`);
        const maxRateInput = document.getElementById(`waterSettingMaxRate${i + 1}`);
        const minRate = parseFloat(minRateInput.value);
        const maxRate = parseFloat(maxRateInput.value);

        // Ensure both `min_rate` and `max_rate` are provided together
        if (!isNaN(minRate) && isNaN(maxRate)) {
            alert(`Error: Water Setting ${i + 1} has a 'min_rate' without a 'max_rate'. Both must be provided together.`);
            return false;
        }
        if (!isNaN(maxRate) && isNaN(minRate)) {
            alert(`Error: Water Setting ${i + 1} has a 'max_rate' without a 'min_rate'. Both must be provided together.`);
            return false;
        }

        // Ensure `max_rate` is greater than `min_rate`
        if (!isNaN(minRate) && !isNaN(maxRate) && maxRate <= minRate) {
            alert(`Error: Water Setting ${i + 1} has 'max_rate' (${maxRate}) less than or equal to 'min_rate' (${minRate}).`);
            return false;
        }
    }
    return true;
}

// Function to create an input element with a label
function createInputElement(id, type, labelText, step = null) {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = id;

    if (step) {
        input.step = step;
    }

    return { label, input };
}

// Add event listener to the "Add Water Setting" button
document.getElementById("addWaterSetting").addEventListener("click", createWaterSetting);

// Export the waterSettings array
export { waterSettings, validateWaterSettings, validateMinMaxRates };
