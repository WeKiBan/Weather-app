class Storage {

  getFromLocalStorage() {
    let savedLocations;
    if (localStorage.getItem('locations') === null) {
      savedLocations = [];
    } else {
      savedLocations = JSON.parse(localStorage.getItem('locations'));
    }
    return savedLocations;
  }

  saveToLocalStorage(locations) {
    localStorage.setItem('locations', JSON.stringify(locations));
  }
}
