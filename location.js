class Location {
  constructor() {
    this.locationIqApiToken = 'a0e79d40c8a474';
    this.currentLocation;
    this.locations;
  }

  // FUNCTION TO FETCH COORDINATES FROM GIVEN CITY NAME
  async fetchLocationData(city) {
    // FORMAT API STRING
    const newLocationApiString = city.trim().replace(/ /g, '%20');

    //SEND REQUEST
    const response = await fetch(
      `https://eu1.locationiq.com/v1/search.php?key=${this.locationIqApiToken}&q=${newLocationApiString}&format=json`
    );

    const responseData = await response.json();

    // CREATE NEW OBJECT WITH DATA FROM RESPONSE
    const newLoc = {
      id: Date.now().toString(),
      location:
        responseData[0].display_name.split(',')[0] +
        ',' +
        responseData[0].display_name.split(',')[1],
      lon: responseData[0].lon,
      lat: responseData[0].lat,
    };

    return newLoc;
  }

  // FUNCTION TO FETCH CURRENT LOCATION INFORMATION
  async setCurrentLocation(position) {
    const response = await fetch(
      `https://eu1.locationiq.com/v1/reverse.php?key=${this.locationIqApiToken}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
    );

    const responseData = await response.json();
    this.currentLocation = {
      id: 'current',
      location: `${responseData.address.city}, ${responseData.address.country}`,
      lat: responseData.lat,
      lon: responseData.lon,
    };

    // FETCH WEATHER WITH DATA
    weather.fetchWeather(
      this.currentLocation.lat,
      this.currentLocation.lon,
      this.currentLocation.location
    );
  }
}
