// Initialize an array to keep track of season and color inputs
const colorSettings = [];

// Function to create a new season and color input
function addColor() {
    const colorCount = colorSettings.length + 1;

    const container = document.getElementById("colorContainer");

    // Create a new div to hold the season name and color inputs
    const colorDiv = document.createElement("div");
    colorDiv.id = `color${colorCount}`;

    // Create input elements for the season name and colors
    const seasonNameLabel = document.createElement("label");
    seasonNameLabel.htmlFor = `colorSeasonName${colorCount}`;
    seasonNameLabel.textContent = `Season Name ${colorCount}:`;

    const seasonNameInput = document.createElement("input");
    seasonNameInput.type = "text";
    seasonNameInput.id = `colorSeasonName${colorCount}`;
    seasonNameInput.name = `colorSeasonName${colorCount}`;

    // Create a container for color inputs
    const colorInputsContainer = document.createElement("div");
    colorInputsContainer.id = `colorInputs${colorCount}`;
    colorInputsContainer.style.marginLeft = "20px"; // Indent color hex codes

    // Create a button to add color hex code inputs
    const addColorButton = document.createElement("button");
    addColorButton.type = "button";
    addColorButton.textContent = "Add Color Hex Code";
    addColorButton.addEventListener("click", function() {
        addColorInput(colorCount);
    });

    // Add season name input, color inputs container, and button to the color div
    colorDiv.appendChild(seasonNameLabel);
    colorDiv.appendChild(seasonNameInput);
    colorDiv.appendChild(colorInputsContainer);
    colorDiv.appendChild(addColorButton);

    // Add a delete button to remove the season and color inputs
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteColor(colorCount, colorDiv);
    });
    colorDiv.appendChild(deleteButton);

    // Append the color div to the container
    container.appendChild(colorDiv);

    // Add the new season and color input to the list
    colorSettings.push(colorDiv);
}

// Function to add a color hex code input to a specific season
function addColorInput(colorCount) {
    const colorInputsContainer = document.getElementById(`colorInputs${colorCount}`);

    // Create a div to hold the color hex code input and its label
    const colorInputDiv = document.createElement("div");
    colorInputDiv.style.marginBottom = "5px"; // Add margin between color hex codes

    // Create a new input element for a color hex code
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Color Hex Code:";

    const colorInput = document.createElement("input");
    colorInput.type = "text";
    colorInput.className = `colorHex${colorCount}`;
    colorInput.name = `colorHex${colorCount}`;

    // Create a delete button for the color hex code input
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteColorInput(colorInputDiv);
    });

    // Append the color input, label, and delete button to the color input div
    colorInputDiv.appendChild(colorLabel);
    colorInputDiv.appendChild(colorInput);
    colorInputDiv.appendChild(deleteButton);

    // Append the color input div to the correct color inputs container
    colorInputsContainer.appendChild(colorInputDiv);
}

// Function to delete an individual color hex code input
function deleteColorInput(colorInputDiv) {
    colorInputDiv.remove();
}

// Function to delete a color div and its inputs
function deleteColor(colorCount, colorDiv) {
    const container = document.getElementById("colorContainer");
    const index = colorSettings.findIndex(div => div.id === colorDiv.id);
    if (index !== -1) {
        colorSettings.splice(index, 1);
        container.removeChild(colorDiv);
    } else {
        console.error("The specified color div is not in the list of colorSettings.");
    }
}

function collectColorSettings() {
    const colorSettingsData = {};
    const seasonNamesSet = new Set();

    // Iterate over each color div in the list
    for (let i = 0; i < colorSettings.length; i++) {
        const colorDiv = colorSettings[i];

        // Get the season name input element
        const seasonNameInput = colorDiv.querySelector(`#colorSeasonName${i + 1}`);
        const colorInputsContainer = colorDiv.querySelector(`#colorInputs${i + 1}`);

        if (!seasonNameInput || !colorInputsContainer) {
            console.log(`Missing elements for color div ${i + 1}`);
            continue;
        }

        // Get the season name value
        const seasonName = seasonNameInput.value.trim();
        if (!seasonName) {
            console.log(`Skipping empty or null season name at index ${i}`);
            continue; // Skip empty or null season names
        }

        // Check for duplicate season names
        const seasonNameLowerCase = seasonName.toLowerCase();
        if (seasonNamesSet.has(seasonNameLowerCase)) {
            console.warn(`Duplicate season name found: ${seasonName}`);
            continue; // Skip duplicate season names
        }

        // Add season name to the set to track duplicates
        seasonNamesSet.add(seasonNameLowerCase);

        // Collect color hex codes
        const colorHexes = [];
        const colorInputs = colorInputsContainer.querySelectorAll(`input[class^="colorHex"]`);

        colorInputs.forEach((input, index) => {
            let hex = input.value.trim();

            if (hex) {
                // Add missing '#' prefix if not present
                if (!hex.startsWith('#')) {
                    hex = `#${hex}`;
                }

                // Handle shorthand hex codes (e.g., #123)
                if (hex.length === 4 && hex.startsWith('#')) {
                    hex = `#${hex.charAt(1)}${hex.charAt(1)}${hex.charAt(2)}${hex.charAt(2)}${hex.charAt(3)}${hex.charAt(3)}`;
                }

                // Convert hex code to uppercase
                hex = hex.toUpperCase();

                // Validate full 6-character hex code
                if (/^#[0-9A-F]{6}$/.test(hex)) {
                    colorHexes.push(hex);
                } else {
                    console.warn(`Invalid hex code: ${hex}`);
                }
            }
        });

        // If there are valid color hex codes, add them to the settings data
        if (colorHexes.length > 0) {
            colorSettingsData[seasonName] = colorHexes;
        }
    }

    // Return the collected color settings data
    return Object.keys(colorSettingsData).length > 0 ? colorSettingsData : {};
}



// Event listener for adding a new season and color input
document.getElementById("addColor").addEventListener("click", addColor);

// Export the color settings array and the collectColorSettings function
export { colorSettings, collectColorSettings };