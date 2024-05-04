// Initialize a list to keep track of temperature settings
const temperatureSettings = [];

// Function to create a new temperature setting
function createTemperatureSetting() {
    const temperatureSettingCount = temperatureSettings.length + 1;

    const container = document.getElementById("temperatureSettingsContainer");

    // Create a new fieldset for the temperature setting
    const fieldset = document.createElement("fieldset");
    fieldset.id = `temperatureSetting${temperatureSettingCount}`;
    fieldset.temperatureSettingIndex = temperatureSettingCount;

    // Create a legend for the fieldset
    const legend = document.createElement("legend");
    legend.textContent = `Temperature Setting ${temperatureSettingCount}`;
    fieldset.appendChild(legend);

    // Create input elements for the temperature setting
    const nameInput = createInputElement(`temperatureSettingName${temperatureSettingCount}`, "text", "Setting Name:");
    const minTempInput = createInputElement(`temperatureSettingMinTemp${temperatureSettingCount}`, "number", "Min Temp:");
    const maxTempInput = createInputElement(`temperatureSettingMaxTemp${temperatureSettingCount}`, "number", "Max Temp:");
    const conditionInput = createInputElement(`temperatureSettingCondition${temperatureSettingCount}`, "text", "Condition:");

    // Append all inputs and labels to the fieldset
    fieldset.appendChild(nameInput.label);
    fieldset.appendChild(nameInput.input);
    fieldset.appendChild(minTempInput.label);
    fieldset.appendChild(minTempInput.input);
    fieldset.appendChild(maxTempInput.label);
    fieldset.appendChild(maxTempInput.input);
    fieldset.appendChild(conditionInput.label);
    fieldset.appendChild(conditionInput.input);

    // Add a delete button to remove the temperature setting
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        deleteTemperatureSetting(temperatureSettingCount, fieldset);
    };
    fieldset.appendChild(deleteButton);

    // Append the fieldset to the container
    container.appendChild(fieldset);

    // Add the new temperature setting to the list
    temperatureSettings.push(fieldset);
}

// Function to delete a temperature setting and adjust numbering
function deleteTemperatureSetting(temperatureSettingCount, fieldset) {
    const container = document.getElementById("temperatureSettingsContainer");

    // Remove the fieldset from the DOM
    container.removeChild(fieldset);

    // Remove the deleted setting from the list of temperature settings
    temperatureSettings.splice(temperatureSettingCount - 1, 1);

    // Adjust numbering for the remaining temperature settings
    for (let i = 0; i < temperatureSettings.length; i++) {
        const fieldset = temperatureSettings[i];
        const newTemperatureSettingCount = i + 1;

        // Update the fieldset ID, legend, and input names/ids
        fieldset.id = `temperatureSetting${newTemperatureSettingCount}`;
        fieldset.temperatureSettingIndex = newTemperatureSettingCount;

        const legend = fieldset.querySelector("legend");
        legend.textContent = `Temperature Setting ${newTemperatureSettingCount}`;

        // Update input names and IDs
        const inputs = fieldset.querySelectorAll("input");
        inputs.forEach(input => {
            input.name = input.name.replace(/temperatureSetting\d+/, `temperatureSetting${newTemperatureSettingCount}`);
            input.id = input.id.replace(/temperatureSetting\d+/, `temperatureSetting${newTemperatureSettingCount}`);
        });

        // Update the delete button's function
        const deleteButton = fieldset.querySelector("button[type='button']");
        deleteButton.onclick = function() {
            deleteTemperatureSetting(newTemperatureSettingCount, fieldset);
        };
    }
}

// Function to validate temperature settings
function validateTemperatureSettings() {
    const settingNames = new Set(); // Use a set to track unique names
    for (let i = 0; i < temperatureSettings.length; i++) {
        const settingName = document.getElementById(`temperatureSettingName${i + 1}`).value.trim().toLowerCase();

        // Check if the setting name is blank
        if (!settingName) {
            alert(`Error: Temperature Setting ${i + 1} has a blank name. Please provide a setting name.`);
            return false;
        }

        // Check if the setting name is a duplicate
        if (settingNames.has(settingName)) {
            alert(`Error: Temperature Setting ${i + 1} has a duplicate name. Please provide a unique name.`);
            return false;
        }

        // Add the setting name to the set to track it
        settingNames.add(settingName);
    }
    return true;
}

// Function to validate `min_temp` and `max_temp`
function validateTemperatureMinMax() {
    for (let i = 0; i < temperatureSettings.length; i++) {
        const minTempInput = document.getElementById(`temperatureSettingMinTemp${i + 1}`);
        const maxTempInput = document.getElementById(`temperatureSettingMaxTemp${i + 1}`);
        const minTemp = parseFloat(minTempInput.value);
        const maxTemp = parseFloat(maxTempInput.value);

        // Ensure both `min_temp` and `max_temp` are provided together
        if (!isNaN(minTemp) && isNaN(maxTemp)) {
            alert(`Error: Temperature Setting ${i + 1} has a 'min_temp' without a 'max_temp'. Both must be provided together.`);
            return false;
        }
        if (!isNaN(maxTemp) && isNaN(minTemp)) {
            alert(`Error: Temperature Setting ${i + 1} has a 'max_temp' without a 'min_temp'. Both must be provided together.`);
            return false;
        }

        // Ensure `max_temp` is greater than `min_temp`
        if (!isNaN(minTemp) && !isNaN(maxTemp) && maxTemp <= minTemp) {
            alert(`Error: Temperature Setting ${i + 1} has 'max_temp' (${maxTemp}) less than or equal to 'min_temp' (${minTemp}).`);
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

// Add event listener to the "Add Temperature Setting" button
document.getElementById("addTemperatureSetting").addEventListener("click", createTemperatureSetting);

// Export the temperatureSettings array
export { temperatureSettings, validateTemperatureSettings, validateTemperatureMinMax };
