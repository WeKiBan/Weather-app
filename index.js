// INIT UI CLASS
const ui = new UI();
const storage = new Storage();
const loc = new Location();
const weather = new Weather();

// LOCATIONS VARIABLE
let locations = storage.getFromLocalStorage();

// INITIATE APP WHEN LOCATION LOADS
navigator.geolocation.getCurrentPosition(
  function (pos) {
    loc.setCurrentLocation(pos);
  },
  (err) => console.log(err)
);

// EVENT LISTENERS
// ON PAGE LOAD RENDER LOCATIONS IN SIDE MENU
document.addEventListener('DOMContentLoaded', function (e) {
  ui.renderSideMenu(locations, 'current');
});

// OPEN AND CLOSE SIDE MENU
ui.menuToggle.addEventListener('click', ui.openCloseSideMenu);

// ADD NEW LOCATION
ui.newLocationForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  if (e.target.classList.contains('fas')) return;
  //GET CITY NAME FROM INPUT
  const city = ui.newLocationInput.value;
  // FETCH LOCATION DATA
  const cityData = await loc.fetchLocationData(city);
  //ADD NEW LOCATION TO ARRAY
  locations.push(cityData);
  // SAVE UPDATED ARRAY
  storage.saveToLocalStorage(locations);
  //RENDER LOCATIONS TO SIDE MENU
  ui.renderSideMenu(locations, cityData.id);
  // RENDER WEATHER DISPLAY WITH NEW LOCATION
  weather.fetchWeather(cityData.lat, cityData.lon, cityData.location);
  //RESET INPUT
  ui.newLocationInput.value = '';
});

ui.locationsList.addEventListener('click', (e) => {
  // CHECK TO SEE IF DELETE BUTTON OR LOCATION WAS CLICKED
  if (e.target.classList.contains('fas')) {
    // IF DELETE BUTTON THEN CALL DELETE LOCATION
    ui.deleteLocation(e);
  } else {
    // ELSE SELECT LOCATION
    ui.selectLocation(e);
  }
});
