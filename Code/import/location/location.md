<h1>Location Subalias<img align="right" src="../../../Data/images/main.png" width="100px"></h1>

This subalias imports location settings to be used by the Weather Management System.

## Location Import
[Location Generator](https://shadow-draconic-development.github.io/Weather-Management-System---Redux/city.html) is where you go in order to generate settings for individual locations.

## Usage
You simply setup the settings on the website, click "Generate JSON" and then copy and paste the output. Make sure that water and wind conditions are spelled exactly the same as those outlined within the general settings import. E.g. I setup settings for the wind conditions "Clear, windy, and gale" in general settings, then I have to use those exact ones that are setup.

`!weather import location [JSON string]`