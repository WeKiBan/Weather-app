// api
const locationIqApiToken = 'a0e79d40c8a474';
const weatherApiToken = '2e44188ae7e877bf4fe23dac83d52bae';
const weatherIconAddress = 'http://openweathermap.org/img/wn/';

// query Selectors
let menuToggle = selectElement('.menu-toggle');
let mainSection = selectElement('.main-section');
let body = selectElement('body');
let sideMenu = selectElement('.locations');
let newLocationForm = selectElement('.new-location-form');
let newLocationInput = selectElement('.new-location-input');
let newLocationButton = selectElement('.new-location-btn');
let locationsList = selectElement('.locations');
let currentWeatherContainer = selectElement('.current-weather-container');
let dailyWeatherContainers = Array.from(
  document.querySelectorAll('.daily-weather-container')
);

// variables
const LOCAL_STORAGE_LOCATIONS_KEY = 'weather.locations';
const LOCAL_STORAGE_SELECTED_LOCATION_KEY = 'weather.selectedLocationId';
let currentLocation;
let locations =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_LOCATIONS_KEY)) || [];
let selectedLocationId = 'current';
let daysArray = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
/* //event listeners */

//open and close side menu
menuToggle.addEventListener('click', function (e) {
  body.classList.toggle('open');
});

// add new location
newLocationButton.addEventListener('click', (e) => {
  e.preventDefault();
  fetchCoordinates();
  newLocationInput.value = null;
});

// select location from list
locationsList.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    if (e.target.dataset.locationId === 'current') {
      getCurrentLocation();
    } else {
      renderWeatherDisplay(
        locations.find(
          (location) => location.id === e.target.dataset.locationId
        )
      );
    }
    selectedLocationId = e.target.dataset.locationId;
    Array.from(locationsList.children).forEach((location) => {
      if (location.dataset.locationId !== selectedLocationId) {
        location.classList.remove('active-location');
      } else {
        location.classList.add('active-location');
      }
    });
    save();
  }
});

/* select element function */
function selectElement(element) {
  return document.querySelector(element);
}

// fetch co-ordinates

function fetchCoordinates() {
  const newLocationApiString = newLocationInput.value
    .trim()
    .replace(/ /g, '%20');

  fetch(
    `https://eu1.locationiq.com/v1/search.php?key=${locationIqApiToken}&q=${newLocationApiString}&format=json`
  )
    .then((response) => response.json())
    .then((data) => {
      var newLocation =
        data[0].display_name.split(',')[0] +
        ',' +
        data[0].display_name.split(',')[1];
      var lon = data[0].lon;
      var lat = data[0].lat;
      addNewLocation(newLocation, lon, lat);
    });
}

//save functions
function saveAndRender() {
  save();
  render();
  if (selectedLocationId === 'current') {
    renderWeatherDisplay(currentLocation);
  } else {
    renderWeatherDisplay(
      locations.find((location) => location.id === selectedLocationId)
    );
  }
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LOCATIONS_KEY, JSON.stringify(locations));
}

//render function
function render() {
  clearElement(sideMenu);
  const currentLocationElement = document.createElement('li');
  currentLocationElement.classList.add('location-item');
  currentLocationElement.innerText = 'Current Location';
  currentLocationElement.dataset.locationId = 'current';
  currentLocationElement.id = 'current';
  sideMenu.appendChild(currentLocationElement);
  locations.forEach((location) => {
    const listElement = document.createElement('li');
    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add('fas');
    deleteBtn.classList.add('fa-trash-alt');
    listElement.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', (e) => {
      locations = locations.filter(
        (location) => location.id !== e.target.parentElement.dataset.locationId
      );
      selectedLocationId = 'current';

      saveAndRender();
    });
    listElement.classList.add('location-item');
    listElement.innerText = location.location;
    listElement.dataset.locationId = location.id;
    if (location.id === selectedLocationId) {
      listElement.classList.add('active-location');
    }
    listElement.appendChild(deleteBtn);
    sideMenu.appendChild(listElement);
  });
}

// render weather display
function renderWeatherDisplay(location) {
  //query Selectors for display
  let currentWeatherIcon = selectElement('.current-icon');
  let currentWeatherDescription = selectElement('.current-description');
  let placeNameDisplay = selectElement('[data-current-location]');
  let currentTemp = selectElement('[data-current-temp]');
  let currentDate = selectElement('.date');
  placeNameDisplay.innerText = location.location.split(',')[0];
  let weatherData = fetchWeather(location.lat, location.lon);
  weatherData.then((data) => {
    let date = new Date().toLocaleDateString('en-US', {
      timeZone: `${data.timezone}`,
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    currentTemp.innerText = Math.round(data.current.temp - 273.15);
    currentWeatherIcon.src = `./images/icons/${data.current.weather[0].icon}.png`;
    currentWeatherDescription.innerText = data.current.weather[0].description;
    currentDate.innerText = date;
    // set background image if night or day
    if (
      data.current.dt > data.current.sunrise &&
      data.current.dt < data.current.sunset
    ) {
      body.style.backgroundImage = "url('images/day-background.png')";
      mainSection.style.color = 'rgb(63, 63, 63)';
    } else {
      body.style.backgroundImage = "url('images/night-background.png')";
      mainSection.style.color = '#fff';
    }

    let days = orderDays(date.split(',')[0]);

    // set daily info
    for (var i = 0; i < dailyWeatherContainers.length; i++) {
      let day = dailyWeatherContainers[i];
      let dailyData = data.daily[i + 1];
      const icon = day.querySelector('.icon');
      const temp = day.querySelector('.day-temp');
      const dayTitle = day.querySelector('.day-title');
      temp.innerText = Math.round(dailyData.temp.day - 273.15);
      icon.src = `./images/icons/${dailyData.weather[0].icon}.png`;
      dayTitle.innerText = days[i];
    }
  });
}

// find day of the week
function orderDays(day) {
  let array = daysArray;
  let index = array.findIndex((item) => item === day);
  return array.slice(index + 1).concat(array.slice(0, index));
}

//add new location
function addNewLocation(location, lon, lat) {
  var newLoc = { id: Date.now().toString(), location, lon, lat };
  locations.push(newLoc);
  selectedLocationId = newLoc.id;
  saveAndRender();
}

//clear element function

function clearElement(element) {
  while (element.childNodes.length > 1) {
    element.removeChild(element.lastChild);
  }
}

// current location

function getCurrentLocation() {
  if (!navigator.geolocation) {
    console.log('no location available');
  } else {
    navigator.geolocation.getCurrentPosition(setLocation);
  }
  function setLocation(position) {
    fetch(
      `https://eu1.locationiq.com/v1/reverse.php?key=${locationIqApiToken}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        currentLocation = {
          id: 'current',
          location: `${data.address.city}, ${data.address.country}`,
          lat: data.lat,
          lon: data.lon,
        };
        renderWeatherDisplay(currentLocation);
      });
  }
}

// weather api call
function fetchWeather(lat, lon) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${weatherApiToken}`
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.log(error));
}

mainSection.style.height = window.innerHeight +'px';
getCurrentLocation();
render();
selectElement('#current').classList.add('active-location');
