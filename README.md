<h1>Weather Management System - Redux<img align="right" src="/Data/images/main.png" width="100px"></h1>

Content library that allows servers to generate weather reports for multiple locations at a time without having to manually determine and relay results from the weather. While this may not cover every detail under the sun, it does provide staff members methods of creating a world that feels more dynamic and open.

[Table of Contents](https://github.com/Shadow-Draconic-Development/Weather-Management-System---Redux/blob/main/ToC.md)
[Shadow's Main Website](https://shadow-draconic-development.github.io/.github/)
[Shadow's Discord Server](https://discord.gg/JqaH7Nbgmr)

## Help
While setup may seem complicated, I have streamlined the setting up process.

### Initial Settings
I recommend setting up the [general settings](https://shadow-draconic-development.github.io/Weather-Management-System---Redux/) and the [location settings](https://shadow-draconic-development.github.io/Weather-Management-System---Redux/city.html) at the same time just so that you get the settings right the first time. See [import.md](https://github.com/Shadow-Draconic-Development/Weather-Management-System---Redux/blob/main/Code/import/import.md) for more details.

#### Step 1: Generate General Settings

##### Setup Water Settings
For each water setting, you come up with a name, minimum and maximum rates (at which the weather is raining/snowing in either Imperial or Metric units), and condition. You do not have to set these rates if you do not want to. E.g. Clear can simply be done by setting "Setting Name" to "Clear". You can even do something like Fog, where you add the Setting Name and then in the Condition you can specify "Disadvantage on Wisdom (Perception) checks."

Setup as many water settings as you want. Typically, I would just recommend "Clear", "Foggy", "Light Rain", and "Heavy Rain".

##### Setup Wind Settings
For each wind setting, you come up with a name, minimum and maximum rates (at which the wind is blowing in either imperial or metric units), and condition. You do not have to set these rates if you do not want to. E.g. Clear can simply be done by setting "Setting Name" to "Clear". You can even update the condition field which allows you can specify "Disadvantage on ranged weapon attacks."

Setup as many wind settings as you want. Typically, I would just recommend "Clear", "Light Wind", and "Heavy wind".

##### Setup Temperature Settings
Temperature settings is different than wind and water settings. You are setting the minimum, maximum, and conditions. However, if the temperature dice rolls within a threshold, it would give a note. E.g. Extreme Cold could be the setting name, Minimum Temperature could be -999, Maximum Temperature could be -20 (thinking in Fahrenheit) and the Condition could say "Characters without cold resistance or heavy clothes, must make a DC 10 Constitution save every hour."

##### Setup Image URLS
This setting allows you to be able to setup the thumbnail picture for a season, allowing for some customization. The URL must be a valid URL that links to a valid picture type (see [valid extensions](https://www.reddit.com/r/discordapp/comments/f2kt5r/guide_file_formats_discord_can_embed/)).

##### Setup Card Colors
This setting allows you to setup the card colors for a season, allowing for some customization. The colors specified must be a 3 or 6 digit Hex Code. E.g. #FFFFFF.

##### Unit
You can choose between imperial and metrix measurements as the primary unit system when a weather report is generated. The unit system that is not selected will be the secondary unit system.

#### Step 2: Import General Settings
After you generate the JSON string, simply put `!weather import settings` and then paste the resulting string and hit enter. It will import all the settings you had just created.

#### Step 3: Generate Location Settings

##### Initial Setup
Select "Add Location Setting", insert location name and priority (lowest number to highest to be displayed). It is recommended that you only have a total of 4 seasons when you do an import. E.g. 1 location with 4 seasons or 2 locations with 2 seasons, etc.

##### Adding Season
After selecting "Add Season", you simply fill out the season name, temperature, water, and wind information.

###### Water/Wind Conditions
Water and Wind conditions are conditions within the general settings that you setup on Step 1. Note: condition names must line up with conditions specified in the general settings (not case sensitive):

For example, if I setup "Clear", "Foggy", "Light Rain", and "Heavy Rain" for water conditions. Then I must use those for the thresholds. How you determine how hard/easy it is to get a condition, you simply make smaller/larger gaps in thresholds.

E.g. 1d20 Water dice
1: Clear (Has to roll 1-8)
9: Foggy (Has to roll 9)
10: Light Rain (Has to roll 10-18)
19: Heavy Rain (Has to roll 19-20)

#### Step 4: Import Location Settings
After you generate the JSON string, simply put `!weather import location` and then paste the resulting string and hit enter. It will import all the settings you had just created.

Simply repeat Step 3 and 4 for additional locations and seasons.


### Updating Settings

Simply follow the steps for Initial Settings.

The following settings are updated/overwritten when you import such settings.

settings -> water -> condition
- Overwrites the minRate, maxRate, and condition
- Condition name not case sensitive

settings -> wind -> condition
- Overwrites the minRate, maxRate, and condition
- Condition name not case sensitive

settings -> temp -> condition
- Overwrites the minRate, maxRate, and condition 
- Condition name not case sensitive

settings -> unit
- Overwrites the unit
- Unit name not case sensitive

settings -> url
- Overwrites the url for the season specified

settings -> color
- Overwrites the entire color list for the season specified

location -> season
- Overwrites the entire season

### Removing Settings

Simply view [remove](https://github.com/Shadow-Draconic-Development/Weather-Management-System---Redux/blob/main/Code/remove/remove.md) and its subalias markdown files.

## License Notice

This work includes material taken from the System Reference Document 5.1 (“SRD 5.1”) by Wizards of the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at https://creativecommons.org/licenses/by/4.0/legalcode.

This work includes material written by Seth Hartman (aka ShadowsStride) and is licensed under the Creative Commons Attribution 4.0 International License available at https://creativecommons.org/licenses/by/4.0/legalcode.

## Requests
Requests can be made at this [link.](https://forms.gle/YYkyPcBb1WHXWMYE6)

All requests can be viewed at this [link.](https://docs.google.com/spreadsheets/d/1OyW78hh1ARDHeDu4hF4X2TxcpYSrrArprs8pkQB3zo4/edit?usp=sharing) All requests are viewable by all, if I have any problems I will restrict access to these links.

## Donations
You can click the button below to view my ko-fi and patreon page. Donations like this help me write more aliases and donators do get priority on feature requests.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F2F6MG4NH) [Patreon](https://www.patreon.com/bePatron?u=47388431)
