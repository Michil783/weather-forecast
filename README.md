# weather-forecast

weather-forecast is a simple weather dashboard that retrieves data own sensors and the forecast from OpenWeatherMap.
The project is based on https://github.com/infinitel8p/weather-forecast.git

#### Contents:
- [weather-forecast](#weather-forecast)
      - [Contents:](#contents)
  - [How to setup:](#how-to-setup)

## How to setup:

### Build by yourself

1.  Clone the repository

2.  Setup environment in .env file

    OPENWEATHERMAP_API_KEY=<your openweathermap API key>
    CITY=<your zip code>
    COUNTRY=<your country code like "DE">

3.  start project by using "npm run dev"

### Use Docker

1.  pull docker image by using "docker pull michil783/weather-forecast:16"

2.  2.  Setup environment in .env file

    OPENWEATHERMAP_API_KEY=<your openweathermap API key>
    CITY=<your zip code>
    COUNTRY=<your country code like "DE">

3.  Mount .env file into docker image at "/App/.env"

4.  start docker image