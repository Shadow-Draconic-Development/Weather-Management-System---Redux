<h1>Import Subalias<img align="right" src="../../Data/images/main.png" width="100px"></h1>

Helps users to where they need to go to generate JSONs for setting up imports.

## Location Import
[Location Generator](https://shadow-draconic-development.github.io/Weather-Management-System---Redux/city.html) is where you go in order to generate settings for individual locations.

## General Settings Import
[Settings Generator](https://shadow-draconic-development.github.io/Weather-Management-System---Redux/index.html) is where you go in order to generate general settings for all locations.

## Usage
For both locations and general settings, you simply setup the settings on the website, click "Generate JSON" and then copy and paste the output to be used by the `location` and `settings` subaliases.

### Overwriting
When importing, you can use the imports to overwrite settings that are within the existing settings SVAR. An issue that may arise is that you overwrite settings you do not intend on overwriting (e.g. you intended on adding settings, rather than completely overwriting settings). Below are a set of behaviors when importing that would be considered 'different.'

### Location Settings
- `season` -> `water_conditions`
    - Overwrites all the water conditions, meaning you have to set all the conditions you want within the water conditions.
- `season` -> `wind_conditions`
    - Overwrites all the wind conditions, meaning you have to set all the conditions you want within the wind conditions.

### General Settings
- `water` -> `condition`
    - Overwrites the minRate, maxRate, and condition.
- `wind` -> `condition`
    - Overwrites the minRate, maxRate, and condition.
- `temp` -> `condition`
    - Overwrites the minRate, maxRate, and condition.
- `color` -> `season`
    - Overwrites all the colors in the color list for the season

## Subalias Markdown
- `location`: [Location](https://github.com/Shadow-Draconic-Development/Weather-Management-System---Redux/blob/main/Code/import/location/location.md)
- `settings`: [Settings](https://github.com/Shadow-Draconic-Development/Weather-Management-System---Redux/blob/main/Code/import/settings/settings.md)