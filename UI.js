class UI {
  constructor() {
    // API KEYS AND ADDRESSES
    this.weatherIconAddress = 'http://openweathermap.org/img/wn/';
    //VARIABLES FOR SIDE MENU
    this.sideMenu = document.querySelector('.locations');
    this.newLocationForm = document.querySelector('.new-location-form');
    this.newLocationInput = document.querySelector('.new-location-input');
    this.newLocationButton = document.querySelector('.new-location-btn');
    this.locationsList = document.querySelector('.locations');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.currentListItem = document.querySelector('.current-item');

    // VARIABLES FOR WEATHER DISPLAY
    this.mainSection = document.querySelector('.main-section');
    this.body = document.querySelector('body');
    this.currentWeatherContainer = document.querySelector(
      '.current-weather-container'
    );
    this.currentIcon = document.querySelector('.current-icon');
    this.currentDescription = document.querySelector('.current-description');
    this.currentLocation = document.querySelector('[data-current-location]');
    this.currentTemp = document.querySelector('[data-current-temp]');
    this.dailyWeatherContainers = Array.from(
      document.querySelectorAll('.daily-weather-container')
    );
  }
  // FUNCTION TO OPEN AND CLOSE SIDE MENU
  openCloseSideMenu() {
    document.body.classList.toggle('open');
  }
  // POPULATE DISPLAY WITH WEATHER DATA;
  populateDisplay(weatherObject, location) {
    //SET BACKGROUND IMAGE
    this.setBackgroundImage(
      weatherObject.current.sunrise,
      weatherObject.current.sunset,
      weatherObject.current.dt
    );
    //SET CURRENT WEATHER ICON.
    this.currentIcon.src = `${this.weatherIconAddress}${weatherObject.current.weather[0].icon}@2x.png`;
    //SET CURRENT  WEATHER DESCRIPTION
    this.currentDescription.textContent =
      weatherObject.current.weather[0].description;
    // SET CURRENT LOCATION
    this.currentLocation.textContent = location.split(',')[0];
    // SET CURRENT TEMPERATURE
    this.currentTemp.textContent = Math.round(
      weatherObject.current.temp - 273.15
    );

    // SET THE DAILY VALUES BY LOOPING THROUGH.
    for (let i = 0; i < this.dailyWeatherContainers.length; i++) {
      const day = this.dailyWeatherContainers[i];
      const dailyWeather = weatherObject.daily[i + 1];
      //SET DAILY TEMP
      day.querySelector('.day-temp').textContent = Math.round(
        dailyWeather.temp.day - 273.15
      );
      //SET DAILY ICON
      day.querySelector(
        '.icon'
      ).src = `${this.weatherIconAddress}${dailyWeather.weather[0].icon}.png`;
    }
  }
  // FUNCTION TO SET BACKGROUND IMAGE DEPENDING ON IF ITS NIGHT OR DAY IN LOCATION
  setBackgroundImage(sunriseTime, sunsetTime, currentTime) {
    // CHECK TO SEE IF CURRENT TIME IS BETWEEN SUNRISE AND SUNSET, SET PICTURE ACCORDINGLY AND CHANGE FONT COLOUR
    if (currentTime < sunriseTime || currentTime > sunsetTime) {
      this.body.style.background =
        'url("images/night-background.png") no-repeat center';
      this.mainSection.style.color = 'var(--body-font-color)';
    } else {
      this.body.style.background =
        'url("images/day-background.png") no-repeat center';
      this.mainSection.style.color = 'var(--main-font-color-dark)';
    }
  }
  // FUNCTION TO RENDER LOCATIONS TO SIDE MENU
  renderSideMenu(locations, selectedLocationID) {
    // CLEAR THE SIDE MENU ELEMENT
    this.clearSideMenu();
    // IF SELECTED LOCATION ID IS CURRENT MAKE CURRENT ITEM ACTIVE
    if (selectedLocationID === 'current') {
      this.currentListItem.className = 'current-item location-item active';
    } else {
      this.currentListItem.className = 'current-item location-item';
    }
    // LOOP THROUGH LOCATIONS AND RENDER THEM TO SIDE MENU
    locations.forEach((location) => {
      const li = document.createElement('li');
      li.innerHTML = `${location.location} <i class="fas fa-trash-alt"></i>`;
      li.id = location.id;
      li.classList.add('location-item');
      // IF SELECTED LOCATION ID IS EQUAL TO LOCATION ID ADD ACTIVE CLASS
      if (location.id === selectedLocationID) {
        li.classList.add('active');
      }

      this.locationsList.appendChild(li);
    });
  }
  //FUNCTION TO CLEAR SIDE MENU
  clearSideMenu() {
    // LOOP THROUGH EACH OF THE MENU ITEMS AND DELETE LEAVING CURRENT LOCATION
    while (this.locationsList.children.length > 1) {
      this.locationsList.removeChild(this.locationsList.lastChild);
    }
  }

  // SELECT LOCATION FROM SIDE MENU AND POPULATE DISPLAY WITH WEATHER OF LOCATION
  selectLocation(e) {
    //REMOVE ACTIVE CLASS FROM ALL LIST ELEMENTS
    Array.from(this.locationsList.children).forEach((element) => {
      element.classList.remove('active');
    });
    // ADD ACTIVE TO SELECTED LIST ELEMENT
    e.target.classList.add('active');
    //CHECK IF IS CURRENT LOCATION
    if (e.target.classList.contains('current-item')) {
      //POPULATE DISPLAY WITH CURRENT LOCATION DATA
      weather.fetchWeather(
        loc.currentLocation.lat,
        loc.currentLocation.lon,
        loc.currentLocation.location
      );
    } else {
      // FILTER LOCATIONS LIST USING ID TO FIND SELECTED LOCATION THEN POPULATE WEATHER DISPLAY
      const selectedID = e.target.id;
      const selectedLocation = locations.filter(
        (location) => location.id === selectedID
      )[0];
      weather.fetchWeather(
        selectedLocation.lat,
        selectedLocation.lon,
        selectedLocation.location
      );
    }
  }
  deleteLocation(e) {
    const selectedTargetId = e.target.parentElement.id;
    locations = locations.filter(
      (location) => location.id !== selectedTargetId
    );
    storage.saveToLocalStorage(locations);
    this.renderSideMenu(locations, 'current');
    weather.fetchWeather(
      loc.currentLocation.lat,
      loc.currentLocation.lon,
      loc.currentLocation.location
    );
  }
}
