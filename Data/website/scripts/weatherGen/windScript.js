// Initialize a list to keep track of wind settings
const windSettings = [];

// Function to create a new wind setting
function createWindSetting() {
    const windSettingCount = windSettings.length + 1;

    const container = document.getElementById("windSettingsContainer");

    // Create a new fieldset for the wind setting
    const fieldset = document.createElement("fieldset");
    fieldset.id = `windSetting${windSettingCount}`;
    fieldset.windSettingIndex = windSettingCount;

    // Create a legend for the fieldset
    const legend = document.createElement("legend");
    legend.textContent = `Wind Setting ${windSettingCount}`;
    fieldset.appendChild(legend);

    // Create input elements for the wind setting
    const nameInput = createInputElement(`windSettingName${windSettingCount}`, "text", "Setting Name:");
    const minRateInput = createInputElement(`windSettingMinRate${windSettingCount}`, "number", "Min Rate:", 0.01);
    const maxRateInput = createInputElement(`windSettingMaxRate${windSettingCount}`, "number", "Max Rate:", 0.01);
    const conditionInput = createInputElement(`windSettingCondition${windSettingCount}`, "text", "Condition:");

    // Append all inputs and labels to the fieldset
    fieldset.appendChild(nameInput.label);
    fieldset.appendChild(nameInput.input);
    fieldset.appendChild(minRateInput.label);
    fieldset.appendChild(minRateInput.input);
    fieldset.appendChild(maxRateInput.label);
    fieldset.appendChild(maxRateInput.input);
    fieldset.appendChild(conditionInput.label);
    fieldset.appendChild(conditionInput.input);

    // Add a delete button to remove the wind setting
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        deleteWindSetting(windSettingCount, fieldset);
    };
    fieldset.appendChild(deleteButton);

    // Append the fieldset to the container
    container.appendChild(fieldset);

    // Add the new wind setting to the list
    windSettings.push(fieldset);
}

// Function to delete a wind setting and adjust numbering
function deleteWindSetting(windSettingCount, fieldset) {
    const container = document.getElementById("windSettingsContainer");

    // Remove the fieldset from the DOM
    container.removeChild(fieldset);

    // Remove the deleted setting from the list of wind settings
    windSettings.splice(windSettingCount - 1, 1);

    // Adjust numbering for the remaining wind settings
    for (let i = 0; i < windSettings.length; i++) {
        const fieldset = windSettings[i];
        const newWindSettingCount = i + 1;

        // Update the fieldset ID, legend, and input names/ids
        fieldset.id = `windSetting${newWindSettingCount}`;
        fieldset.windSettingIndex = newWindSettingCount;

        const legend = fieldset.querySelector("legend");
        legend.textContent = `Wind Setting ${newWindSettingCount}`;

        // Update input names and IDs
        const inputs = fieldset.querySelectorAll("input");
        inputs.forEach(input => {
            input.name = input.name.replace(/windSetting\d+/, `windSetting${newWindSettingCount}`);
            input.id = input.id.replace(/windSetting\d+/, `windSetting${newWindSettingCount}`);
        });

        // Update the delete button's function
        const deleteButton = fieldset.querySelector("button[type='button']");
        deleteButton.onclick = function() {
            deleteWindSetting(newWindSettingCount, fieldset);
        };
    }
}

// Function to validate wind settings
function validateWindSettings() {
    const settingNames = new Set(); // Use a set to track unique names
    for (let i = 0; i < windSettings.length; i++) {
        const settingName = document.getElementById(`windSettingName${i + 1}`).value.trim().toLowerCase();

        // Check if the setting name is blank
        if (!settingName) {
            alert(`Error: Wind Setting ${i + 1} has a blank name. Please provide a setting name.`);
            return false;
        }

        // Check if the setting name is a duplicate
        if (settingNames.has(settingName)) {
            alert(`Error: Wind Setting ${i + 1} has a duplicate name. Please provide a unique name.`);
            return false;
        }

        // Add the setting name to the set to track it
        settingNames.add(settingName);
    }
    return true;
}

// Function to validate `min_rate` and `max_rate`
function validateWindMinMaxRates() {
    for (let i = 0; i < windSettings.length; i++) {
        const minRateInput = document.getElementById(`windSettingMinRate${i + 1}`);
        const maxRateInput = document.getElementById(`windSettingMaxRate${i + 1}`);
        const minRate = parseFloat(minRateInput.value);
        const maxRate = parseFloat(maxRateInput.value);

        // Ensure both `min_rate` and `max_rate` are provided together
        if (!isNaN(minRate) && isNaN(maxRate)) {
            alert(`Error: Wind Setting ${i + 1} has a 'min_rate' without a 'max_rate'. Both must be provided together.`);
            return false;
        }
        if (!isNaN(maxRate) && isNaN(minRate)) {
            alert(`Error: Wind Setting ${i + 1} has a 'max_rate' without a 'min_rate'. Both must be provided together.`);
            return false;
        }

        // Ensure `max_rate` is greater than `min_rate`
        if (!isNaN(minRate) && !isNaN(maxRate) && maxRate <= minRate) {
            alert(`Error: Wind Setting ${i + 1} has 'max_rate' (${maxRate}) less than or equal to 'min_rate' (${minRate}).`);
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

function collectWindSettings() {
    // Implement data collection from wind form inputs here
    // Return an object or data structure representing wind settings
    // Example:
    const windData = {};
    const container = document.getElementById("windSettingsContainer");
    const fieldsets = container.querySelectorAll("fieldset");
    fieldsets.forEach((fieldset) => {
        const name = fieldset.querySelector("input[type='text']").value;
        const minRate = parseFloat(fieldset.querySelector("input[type='number'][id^='windSettingMinRate']").value);
        const maxRate = parseFloat(fieldset.querySelector("input[type='number'][id^='windSettingMaxRate']").value);
        const condition = fieldset.querySelector("input[type='text']").value;
        if (name && !isNaN(minRate) && !isNaN(maxRate) && condition) {
            windData[name] = {
                minRate,
                maxRate,
                condition,
            };
        }
    });
    return windData;
}


// Add event listener to the "Add Wind Setting" button
document.getElementById("addWindSetting").addEventListener("click", createWindSetting);

// Export the windSettings array
export { windSettings, validateWindSettings, validateWindMinMaxRates, collectWindSettings };
