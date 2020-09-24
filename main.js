// api
const locationIqApiToken = 'a0e79d40c8a474';
const weatherApiToken = '2e44188ae7e877bf4fe23dac83d52bae';

// query Selectors
let menuToggle = selectElement('.menu-toggle');
let body = selectElement('body');
let sideMenu = selectElement('.locations');
let newLocationForm = selectElement('.new-location-form');
let newLocationInput = selectElement('.new-location-input');
let newLocationButton = selectElement('.new-location-btn');
let locationsList = selectElement('.locations');

// variables
const LOCAL_STORAGE_LOCATIONS_KEY = 'weather.locations';
const LOCAL_STORAGE_SELECTED_LOCATION_KEY = 'weather.selectedLocationId';
let locations =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_LOCATIONS_KEY)) || [];
let SelectedLocationId =
  localStorage.getItem(LOCAL_STORAGE_SELECTED_LOCATION_KEY) || 'current';
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
      console.log('yes');
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
        data[0].display_name.split(',')[2];
      var lon = data[0].lon;
      var lat = data[0].lat;
      addNewLocation(newLocation, lon, lat);
      saveAndRender();
    });
}

//save functions
function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LOCATIONS_KEY, JSON.stringify(locations));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LOCATION_KEY, SelectedLocationId);
}

//render function
function render() {
  clearElement(sideMenu);
  const currentLocationElement = document.createElement('li');
  currentLocationElement.classList.add('location-item');
  currentLocationElement.innerText = 'Current Location';
  currentLocationElement.dataset.locationId = 'current';
  sideMenu.appendChild(currentLocationElement);
  locations.forEach((location) => {
    const listElement = document.createElement('li');
    listElement.classList.add('location-item');
    listElement.innerText = location.location;
    listElement.dataset.locationId = location.id;
    sideMenu.appendChild(listElement);
  });
}

// render weather display
function renderWeatherDisplay(location) {
  let weatherData = fetchWeather(location.lat, location.lon);
  let currentWeatherIcon = selectElement('.current-icon');
  let currentWeatherDescription = selectElement('.');
}

//add new location
function addNewLocation(location, lon, lat) {
  locations.push({ id: Date.now().toString(), location, lon, lat });
}

//clear element function

function clearElement(element) {
  while (element.childNodes.length > 1) {
    element.removeChild(element.lastChild);
  }
}

// weather api call
function fetchWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${weatherApiToken}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

render();
