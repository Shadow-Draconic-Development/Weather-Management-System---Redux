// Initialize an array to keep track of season and URL inputs
const seasonUrlSettings = [];

// Asynchronous function to validate a single URL
async function validateUrl(url) {
    try {
        const response = await fetch(url, { method: 'GET' });
        // Check if the response status code is in the range 200-299 or 304
        return (response.status >= 200 && response.status < 300) || response.status === 304;
    } catch (error) {
        console.error(`Error fetching URL ${url}:`, error);
        return false;
    }
}

// Function to create a new season and URL input
function addSeasonUrl() {
    const seasonUrlCount = seasonUrlSettings.length + 1;

    const container = document.getElementById("seasonUrlContainer");

    // Create a new div to hold the season name and URL inputs
    const seasonDiv = document.createElement("div");
    seasonDiv.id = `seasonUrl${seasonUrlCount}`;

    // Create input elements for the season name and URL
    const seasonNameLabel = document.createElement("label");
    seasonNameLabel.htmlFor = `seasonName${seasonUrlCount}`;
    seasonNameLabel.textContent = `Season Name:`;

    const seasonNameInput = document.createElement("input");
    seasonNameInput.type = "text";
    seasonNameInput.id = `seasonName${seasonUrlCount}`;
    seasonNameInput.name = `seasonName${seasonUrlCount}`;

    const urlLabel = document.createElement("label");
    urlLabel.htmlFor = `seasonUrl${seasonUrlCount}`;
    urlLabel.textContent = "URL:";

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.id = `seasonUrl${seasonUrlCount}`;
    urlInput.name = `seasonUrl${seasonUrlCount}`;

    // Add inputs and labels to the season div
    seasonDiv.appendChild(seasonNameLabel);
    seasonDiv.appendChild(seasonNameInput);
    seasonDiv.appendChild(urlLabel);
    seasonDiv.appendChild(urlInput);

    // Add a delete button to remove the season and URL input
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteSeasonUrl(seasonUrlCount, seasonDiv);
    });
    seasonDiv.appendChild(deleteButton);

    // Append the season div to the container
    container.appendChild(seasonDiv);

    // Add the new season and URL input to the list
    seasonUrlSettings.push(seasonDiv);
}

// Function to delete a season and URL input, shift remaining inputs, and delete the last input
function deleteSeasonUrl(seasonUrlCount, seasonDiv) {
    const container = document.getElementById("seasonUrlContainer");
    
    // Find the index of the specified seasonDiv in the seasonUrlSettings array
    const index = seasonUrlSettings.findIndex(div => div.id === seasonDiv.id);
    
    if (index !== -1) {
        // Clear values in the selected season div
        const selectedSeasonNameInput = seasonDiv.querySelector(`input[id="seasonName${index + 1}"]`);
        const selectedUrlInput = seasonDiv.querySelector(`input[id="seasonUrl${index + 1}"]`);
        
        if (selectedSeasonNameInput) {
            selectedSeasonNameInput.value = '';
        }

        if (selectedUrlInput) {
            selectedUrlInput.value = '';
        }

        // Shift remaining inputs from subsequent seasons up one position
        for (let i = index; i < seasonUrlSettings.length - 1; i++) {
            const currentSeasonDiv = seasonUrlSettings[i];
            const nextSeasonDiv = seasonUrlSettings[i + 1];

            // Shift the values from the next season div to the current season div
            const currentSeasonNameInput = currentSeasonDiv.querySelector(`input[id="seasonName${i + 1}"]`);
            const nextSeasonNameInput = nextSeasonDiv.querySelector(`input[id="seasonName${i + 2}"]`);
            const currentUrlInput = currentSeasonDiv.querySelector(`input[id="seasonUrl${i + 1}"]`);
            const nextUrlInput = nextSeasonDiv.querySelector(`input[id="seasonUrl${i + 2}"]`);

            // Check if the inputs are available and shift the values
            if (currentSeasonNameInput && nextSeasonNameInput) {
                currentSeasonNameInput.value = nextSeasonNameInput.value;
                // Clear the next season div value
                nextSeasonNameInput.value = '';
            }

            if (currentUrlInput && nextUrlInput) {
                currentUrlInput.value = nextUrlInput.value;
                // Clear the next season div value
                nextUrlInput.value = '';
            }
        }

        // Remove the last season div from the DOM and array
        const lastSeasonDiv = seasonUrlSettings.pop();
        if (lastSeasonDiv && container.contains(lastSeasonDiv)) {
            container.removeChild(lastSeasonDiv);
        }
    } else {
        console.error("The specified season div is not in the list of seasonUrlSettings.");
    }
}

// Function to collect season and URL inputs from the form
async function collectSeasonUrls() {
    const imageUrls = {};
    const validationPromises = [];
    let urlsValid = true;
    const seasonNamesSet = new Set(); // A set to track season names (case-insensitive)

    // Iterate over each season and URL input pair
    seasonUrlSettings.forEach((seasonDiv, index) => {
        const seasonNameInput = seasonDiv.querySelector(`#seasonName${index + 1}`);
        const urlInput = seasonDiv.querySelector(`#seasonUrl${index + 1}`);

        const seasonName = seasonNameInput ? seasonNameInput.value.trim() : '';
        const url = urlInput ? urlInput.value.trim() : '';

        // Check for duplicate season names (case-insensitive)
        const seasonNameLowerCase = seasonName.toLowerCase();
        if (seasonNamesSet.has(seasonNameLowerCase)) {
            alert(`Duplicate season name found: ${seasonName}`);
            urlsValid = false;
            return; // Skip further processing for this season
        }

        // Add season name to the set
        seasonNamesSet.add(seasonNameLowerCase);

        if (seasonName && url) {
            // Add the season name and URL to the object
            imageUrls[seasonName] = url;

            // Validate the URL
            validationPromises.push(validateUrl(url).then(isValid => {
                if (!isValid) {
                    alert(`Invalid URL for season ${seasonName}: ${url}`);
                    urlsValid = false;
                    // Optionally, delete invalid entries from imageUrls
                    delete imageUrls[seasonName];
                }
            }));
        }
    });

    // Wait for all validations to complete
    await Promise.all(validationPromises);

    return {
        imageUrls,
        urlsValid,
    };
}

// Event listener for adding a new season and URL input
document.getElementById("addSeasonUrl").addEventListener("click", addSeasonUrl);

// Export the season and URL settings array and the collectSeasonUrls function
export { seasonUrlSettings, collectSeasonUrls };
