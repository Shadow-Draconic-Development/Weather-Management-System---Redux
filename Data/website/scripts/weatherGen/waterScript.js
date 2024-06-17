// waterScript.js
const waterSettings = [];

function createWaterSetting() {
    const waterSettingCount = waterSettings.length + 1;
    const container = document.getElementById("waterSettingsContainer");

    const fieldset = document.createElement("fieldset");
    fieldset.id = `waterSetting${waterSettingCount}`;
    fieldset.waterSettingIndex = waterSettingCount;

    const legend = document.createElement("legend");
    legend.textContent = `Water Setting`;
    fieldset.appendChild(legend);

    const nameInput = createInputElement(`waterSettingName${waterSettingCount}`, "text", "Setting Name:");
    const minRateInput = createInputElement(`waterSettingMinRate${waterSettingCount}`, "number", "Min Rate:", 0.01);
    const maxRateInput = createInputElement(`waterSettingMaxRate${waterSettingCount}`, "number", "Max Rate:", 0.01);
    const conditionInput = createInputElement(`waterSettingCondition${waterSettingCount}`, "text", "Condition:");

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
        deleteWaterSetting(waterSettingCount, fieldset);
    };
    fieldset.appendChild(deleteButton);

    container.appendChild(fieldset);
    waterSettings.push(fieldset);
}

function deleteWaterSetting(waterSettingCount, fieldset) {
    const container = document.getElementById("waterSettingsContainer");
    container.removeChild(fieldset);
    waterSettings.splice(waterSettingCount - 1, 1);
    for (let i = 0; i < waterSettings.length; i++) {
        const fieldset = waterSettings[i];
        const newWaterSettingCount = i + 1;
        fieldset.id = `waterSetting${newWaterSettingCount}`;
        fieldset.waterSettingIndex = newWaterSettingCount;
        const legend = fieldset.querySelector("legend");
        legend.textContent = `Water Setting ${newWaterSettingCount}`;
        const inputs = fieldset.querySelectorAll("input");
        inputs.forEach(input => {
            input.name = input.name.replace(/waterSetting\d+/, `waterSetting${newWaterSettingCount}`);
            input.id = input.id.replace(/waterSetting\d+/, `waterSetting${newWaterSettingCount}`);
        });
        const deleteButton = fieldset.querySelector("button[type='button']");
        deleteButton.onclick = function() {
            deleteWaterSetting(newWaterSettingCount, fieldset);
        };
    }
}

function collectWaterSettings() {
    const waterData = {};
    const container = document.getElementById("waterSettingsContainer");
    const fieldsets = container.querySelectorAll("fieldset");
    fieldsets.forEach((fieldset) => {
        const name = fieldset.querySelector(`#waterSettingName${fieldset.waterSettingIndex}`).value;
        const minRate = parseFloat(fieldset.querySelector(`#waterSettingMinRate${fieldset.waterSettingIndex}`).value);
        const maxRate = parseFloat(fieldset.querySelector(`#waterSettingMaxRate${fieldset.waterSettingIndex}`).value);
        const condition = fieldset.querySelector(`#waterSettingCondition${fieldset.waterSettingIndex}`).value;
        if (name && !isNaN(minRate) && !isNaN(maxRate) && condition) {
            waterData[name] = {
                minRate,
                maxRate,
                condition
            };
        }
    });
    return waterData;
}

function validateWaterSettings() {
    const settingNames = new Set();
    for (let i = 0; i < waterSettings.length; i++) {
        const settingName = document.getElementById(`waterSettingName${i + 1}`).value.trim().toLowerCase();
        if (!settingName) {
            alert(`Error: Water Setting ${i + 1} has a blank name. Please provide a setting name.`);
            return false;
        }
        if (settingNames.has(settingName)) {
            alert(`Error: Water Setting ${i + 1} has a duplicate name. Please provide a unique name.`);
            return false;
        }
        settingNames.add(settingName);
    }
    return true;
}

function validateMinMaxRates() {
    for (let i = 0; i < waterSettings.length; i++) {
        const minRateInput = document.getElementById(`waterSettingMinRate${i + 1}`);
        const maxRateInput = document.getElementById(`waterSettingMaxRate${i + 1}`);
        const minRate = parseFloat(minRateInput.value);
        const maxRate = parseFloat(maxRateInput.value);
        if (!isNaN(minRate) && isNaN(maxRate)) {
            alert(`Error: Water Setting ${i + 1} has a 'min_rate' without a 'max_rate'. Both must be provided together.`);
            return false;
        }
        if (!isNaN(maxRate) && isNaN(minRate)) {
            alert(`Error: Water Setting ${i + 1} has a 'max_rate' without a 'min_rate'. Both must be provided together.`);
            return false;
        }
        if (!isNaN(minRate) && !isNaN(maxRate) && maxRate <= minRate) {
            alert(`Error: Water Setting ${i + 1} has 'max_rate' (${maxRate}) less than or equal to 'min_rate' (${minRate}).`);
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

document.getElementById("addWaterSetting").addEventListener("click", createWaterSetting);

export { waterSettings, validateWaterSettings, validateMinMaxRates, collectWaterSettings };
