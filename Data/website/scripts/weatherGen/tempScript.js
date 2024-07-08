// tempScript.js
const temperatureSettings = [];

function createTemperatureSetting() {
    const temperatureSettingCount = temperatureSettings.length + 1;
    const container = document.getElementById("temperatureSettingsContainer");

    const fieldset = document.createElement("fieldset");
    fieldset.id = `temperatureSetting${temperatureSettingCount}`;
    fieldset.temperatureSettingIndex = temperatureSettingCount;

    const legend = document.createElement("legend");
    legend.textContent = `Temperature Setting`;
    fieldset.appendChild(legend);

    const nameInput = createInputElement(`temperatureSettingName${temperatureSettingCount}`, "text", "Setting Name:");
    const minRateInput = createInputElement(`temperatureSettingMinRate${temperatureSettingCount}`, "number", "Min Temp:", 0.01);
    const maxRateInput = createInputElement(`temperatureSettingMaxRate${temperatureSettingCount}`, "number", "Max Temp:", 0.01);
    const conditionInput = createInputElement(`temperatureSettingCondition${temperatureSettingCount}`, "text", "Condition:");

    fieldset.appendChild(nameInput.label);
    fieldset.appendChild(nameInput.input);
    fieldset.appendChild(minRateInput.label);
    fieldset.appendChild(minRateInput.input);
    fieldset.appendChild(maxRateInput.label);
    fieldset.appendChild(maxRateInput.input);
    fieldset.appendChild(conditionInput.label);
    fieldset.appendChild(conditionInput.input);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        deleteTemperatureSetting(temperatureSettingCount, fieldset);
    };
    fieldset.appendChild(deleteButton);

    container.appendChild(fieldset);
    temperatureSettings.push(fieldset);
}

function deleteTemperatureSetting(temperatureSettingCount, fieldset) {
    const container = document.getElementById("temperatureSettingsContainer");
    container.removeChild(fieldset);
    temperatureSettings.splice(temperatureSettingCount - 1, 1);
    for (let i = 0; i < temperatureSettings.length; i++) {
        const fieldset = temperatureSettings[i];
        const newTemperatureSettingCount = i + 1;
        fieldset.id = `temperatureSetting${newTemperatureSettingCount}`;
        fieldset.temperatureSettingIndex = newTemperatureSettingCount;
        const legend = fieldset.querySelector("legend");
        legend.textContent = `Temperature Setting ${newTemperatureSettingCount}`;
        const inputs = fieldset.querySelectorAll("input");
        inputs.forEach(input => {
            input.name = input.name.replace(/temperatureSetting\d+/, `temperatureSetting${newTemperatureSettingCount}`);
            input.id = input.id.replace(/temperatureSetting\d+/, `temperatureSetting${newTemperatureSettingCount}`);
        });
        const deleteButton = fieldset.querySelector("button[type='button']");
        deleteButton.onclick = function() {
            deleteTemperatureSetting(newTemperatureSettingCount, fieldset);
        };
    }
}

function collectTempSettings() {
    const tempData = {};
    const container = document.getElementById("temperatureSettingsContainer");
    const fieldsets = container.querySelectorAll("fieldset");
    fieldsets.forEach((fieldset) => {
        const name = fieldset.querySelector(`#temperatureSettingName${fieldset.temperatureSettingIndex}`).value;
        const minRate = parseFloat(fieldset.querySelector(`#temperatureSettingMinRate${fieldset.temperatureSettingIndex}`).value);
        const maxRate = parseFloat(fieldset.querySelector(`#temperatureSettingMaxRate${fieldset.temperatureSettingIndex}`).value);
        const condition = fieldset.querySelector(`#temperatureSettingCondition${fieldset.temperatureSettingIndex}`).value;
        if (name && !isNaN(minRate) && !isNaN(maxRate) && condition) {
            tempData[name] = {
                minRate,
                maxRate,
                condition
            };
        }
    });
    return tempData;
}

function validateTemperatureSettings() {
    const settingNames = new Set();
    for (let i = 0; i < temperatureSettings.length; i++) {
        const settingName = document.getElementById(`temperatureSettingName${i + 1}`).value.trim().toLowerCase();
        if (!settingName) {
            alert(`Error: Temperature Setting ${i + 1} has a blank name. Please provide a setting name.`);
            return false;
        }
        if (settingNames.has(settingName)) {
            alert(`Error: Temperature Setting ${i + 1} has a duplicate name. Please provide a unique name.`);
            return false;
        }
        settingNames.add(settingName);
    }
    return true;
}

function validateTemperatureMinMax() {
    for (let i = 0; i < temperatureSettings.length; i++) {
        const minRateInput = document.getElementById(`temperatureSettingMinRate${i + 1}`);
        const maxRateInput = document.getElementById(`temperatureSettingMaxRate${i + 1}`);
        const minRate = parseFloat(minRateInput.value);
        const maxRate = parseFloat(maxRateInput.value);
        if (!isNaN(minRate) && isNaN(maxRate)) {
            alert(`Error: Temperature Setting ${i + 1} has a 'min_temp' without a 'max_temp'. Both must be provided together.`);
            return false;
        }
        if (!isNaN(maxRate) && isNaN(minRate)) {
            alert(`Error: Temperature Setting ${i + 1} has a 'max_temp' without a 'min_temp'. Both must be provided together.`);
            return false;
        }
        if (!isNaN(minRate) && !isNaN(maxRate) && maxRate <= minRate) {
            alert(`Error: Temperature Setting ${i + 1} has 'max_temp' (${maxRate}) less than or equal to 'min_temp' (${minRate}).`);
            return false;
        }
    }
    return true;
}

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

document.getElementById("addTemperatureSetting").addEventListener("click", createTemperatureSetting);

export { temperatureSettings, validateTemperatureSettings, validateTemperatureMinMax, collectTempSettings };
