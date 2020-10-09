class Weather {
  constructor() {
    this.weatherApiToken = '2e44188ae7e877bf4fe23dac83d52bae';
  }
  async fetchWeather(lat, lon, location) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${this.weatherApiToken}`
    );
    const responseData = await response.json();
    
    ui.populateDisplay(responseData, location);
  }
}
