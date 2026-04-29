// persistence.js - Handles localStorage auto-save functionality

const STORAGE_PREFIX = "wms_";
const SAVE_DEBOUNCE_DELAY = 1000; // 1 second debounce to avoid excessive writes
const debounceTimers = {};

/**
 * Saves form state to localStorage
 * @param {string} formId - Unique identifier for the form (e.g., 'general', 'location')
 * @param {object} formData - Object containing form state
 */
function saveFormState(formId, formData) {
    try {
        const key = `${STORAGE_PREFIX}${formId}`;
        localStorage.setItem(key, JSON.stringify(formData));
        console.log(`Saved form state for ${formId}`);
    } catch (error) {
        console.error(`Error saving form state for ${formId}:`, error);
    }
}

/**
 * Loads form state from localStorage
 * @param {string} formId - Unique identifier for the form
 * @returns {object|null} Parsed form data or null if not found
 */
function loadFormState(formId) {
    try {
        const key = `${STORAGE_PREFIX}${formId}`;
        const data = localStorage.getItem(key);
        if (data) {
            console.log(`Loaded form state for ${formId}`);
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(`Error loading form state for ${formId}:`, error);
    }
    return null;
}

/**
 * Clears form state from localStorage
 * @param {string} formId - Unique identifier for the form
 */
function clearFormState(formId) {
    try {
        const key = `${STORAGE_PREFIX}${formId}`;
        localStorage.removeItem(key);
        console.log(`Cleared form state for ${formId}`);
    } catch (error) {
        console.error(`Error clearing form state for ${formId}:`, error);
    }
}

/**
 * Clears all WMS form states from localStorage
 */
function clearAllFormStates() {
    try {
        for (let key in localStorage) {
            if (key.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
        console.log("Cleared all form states");
    } catch (error) {
        console.error("Error clearing all form states:", error);
    }
}

/**
 * Debounced save function to avoid excessive localStorage writes
 * @param {string} formId - Unique identifier for the form
 * @param {object} formData - Object containing form state
 */
function debouncedSave(formId, formData) {
    // Clear existing timer if any
    if (debounceTimers[formId]) {
        clearTimeout(debounceTimers[formId]);
    }

    // Set new timer
    debounceTimers[formId] = setTimeout(() => {
        saveFormState(formId, formData);
        delete debounceTimers[formId];
    }, SAVE_DEBOUNCE_DELAY);
}

/**
 * Sets up auto-save on input changes for a container
 * @param {string} formId - Unique identifier for the form
 * @param {string} containerId - ID of the container element
 * @param {function} collectFunc - Function that collects current form state
 */
function setupAutoSave(formId, containerId, collectFunc) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found for auto-save setup`);
        return;
    }

    // Create mutation observer to detect dynamic element changes
    const observer = new MutationObserver(() => {
        const formData = collectFunc();
        debouncedSave(formId, formData);
    });

    observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["value"]
    });

    // Also set up event listeners on existing inputs
    setupInputListeners(container, formId, collectFunc);

    return observer;
}

/**
 * Sets up input event listeners for a container
 * @param {element} container - Container element
 * @param {string} formId - Unique identifier for the form
 * @param {function} collectFunc - Function that collects current form state
 */
function setupInputListeners(container, formId, collectFunc) {
    const inputs = container.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
        input.addEventListener("change", () => {
            const formData = collectFunc();
            debouncedSave(formId, formData);
        });
        input.addEventListener("input", () => {
            const formData = collectFunc();
            debouncedSave(formId, formData);
        });
    });
}

export { saveFormState, loadFormState, clearFormState, clearAllFormStates, debouncedSave, setupAutoSave, setupInputListeners };
