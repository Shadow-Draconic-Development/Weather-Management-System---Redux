// windScript.js
const windSettings = [];

function createWindSetting() {
    const windSettingCount = windSettings.length + 1;
    const container = document.getElementById("windSettingsContainer");

    const fieldset = document.createElement("fieldset");
    fieldset.id = `windSetting${windSettingCount}`;
    fieldset.windSettingIndex = windSettingCount;

    const legend = document.createElement("legend");
    legend.textContent = `Wind Setting ${windSettingCount}`;
    fieldset.appendChild(legend);

    const nameInput = createInputElement(`windSettingName${windSettingCount}`, "text", "Setting Name:");
    const minRateInput = createInputElement(`windSettingMinRate${windSettingCount}`, "number", "Min Rate:", 0.01);
    const maxRateInput = createInputElement(`windSettingMaxRate${windSettingCount}`, "number", "Max Rate:", 0.01);
    const conditionInput = createInputElement(`windSettingCondition${windSettingCount}`, "text", "Condition:");

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
        deleteWindSetting(windSettingCount, fieldset);
    };
    fieldset.appendChild(deleteButton);

    container.appendChild(fieldset);
    windSettings.push(fieldset);
}

function deleteWindSetting(windSettingCount, fieldset) {
    const container = document.getElementById("windSettingsContainer");
    container.removeChild(fieldset);
    windSettings.splice(windSettingCount - 1, 1);
    for (let i = 0; i < windSettings.length; i++) {
        const fieldset = windSettings[i];
        const newWindSettingCount = i + 1;
        fieldset.id = `windSetting${newWindSettingCount}`;
        fieldset.windSettingIndex = newWindSettingCount;
        const legend = fieldset.querySelector("legend");
        legend.textContent = `Wind Setting ${newWindSettingCount}`;
        const inputs = fieldset.querySelectorAll("input");
        inputs.forEach(input => {
            input.name = input.name.replace(/windSetting\d+/, `windSetting${newWindSettingCount}`);
            input.id = input.id.replace(/windSetting\d+/, `windSetting${newWindSettingCount}`);
        });
        const deleteButton = fieldset.querySelector("button[type='button']");
        deleteButton.onclick = function() {
            deleteWindSetting(newWindSettingCount, fieldset);
        };
    }
}

function collectWindSettings() {
    const windData = {};
    const container = document.getElementById("windSettingsContainer");
    const fieldsets = container.querySelectorAll("fieldset");
    fieldsets.forEach((fieldset) => {
        const name = fieldset.querySelector(`#windSettingName${fieldset.windSettingIndex}`).value;
        if (name) {
            const minRate = parseFloat(fieldset.querySelector(`#windSettingMinRate${fieldset.windSettingIndex}`).value);
            const maxRate = parseFloat(fieldset.querySelector(`#windSettingMaxRate${fieldset.windSettingIndex}`).value);
            const condition = fieldset.querySelector(`#windSettingCondition${fieldset.windSettingIndex}`).value.trim();
            const entry = {};
            if (!isNaN(minRate)) entry.minRate = minRate;
            if (!isNaN(maxRate)) entry.maxRate = maxRate;
            if (condition) entry.condition = condition;

            windData[name] = entry;
        }
    });
    return windData;
}

function validateWindSettings() {
    const settingNames = new Set();
    for (let i = 0; i < windSettings.length; i++) {
        const settingName = document.getElementById(`windSettingName${i + 1}`).value.trim().toLowerCase();
        if (!settingName) {
            alert(`Error: Wind Setting ${i + 1} has a blank name. Please provide a setting name.`);
            return false;
        }
        if (settingNames.has(settingName)) {
            alert(`Error: Wind Setting ${i + 1} has a duplicate name. Please provide a unique name.`);
            return false;
        }
        settingNames.add(settingName);
    }
    return true;
}

function validateWindMinMaxRates() {
    for (let i = 0; i < windSettings.length; i++) {
        const minRateInput = document.getElementById(`windSettingMinRate${i + 1}`);
        const maxRateInput = document.getElementById(`windSettingMaxRate${i + 1}`);
        const minRate = parseFloat(minRateInput.value);
        const maxRate = parseFloat(maxRateInput.value);
        if ((!isNaN(minRate) && isNaN(maxRate)) || (isNaN(minRate) && !isNaN(maxRate))) {
            alert(`Error: Wind Setting ${i + 1} must have both 'min_rate' and 'max_rate' or neither.`);
            return false;
        }
        if (!isNaN(minRate) && !isNaN(maxRate) && maxRate <= minRate) {
            alert(`Error: Wind Setting ${i + 1} has 'max_rate' (${maxRate}) less than or equal to 'min_rate' (${minRate}).`);
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

document.getElementById("addWindSetting").addEventListener("click", createWindSetting);

export { windSettings, validateWindSettings, validateWindMinMaxRates, collectWindSettings };
