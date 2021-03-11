const city = document.querySelector("#city");
const form = document.querySelector('form');
const gps = document.querySelector('button');
const weatherInfo = document.querySelector(".weather-info")
const weatherDetails = document.querySelector(".details")

gps.addEventListener('click', (e) => {
    window.navigator.geolocation
  .getCurrentPosition(getLocation, throwError);
    handleSubmit(e);
})

form.addEventListener('submit', (e) => {
    const location = city.value;
    getWeather(location);
    handleSubmit(e);
})

function handleSubmit(e) {
    e.preventDefault();
    form.reset();
}

async function getLocation(position) {
    
    const { latitude, longitude } = position.coords;
    const promise = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=2a08b2dd91ba4b86963fd5bb2da8e3e6`);
    const locationData = await promise.json();
    console.log(locationData)
    
    let location = locationData.results[0].components.state_district;
    if(!location)
        location = locationData.results[0].components.city_district;
    getWeather(location);
}

async function getWeather(location) {

    if(location){
        let promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=fd4a942bdf160a25b18be0ce6cdb0662`)
        const weatherData = await promise.json();
        console.log(weatherData);
        if(weatherData.cod == '404')
            throwError();
        else
            displayWeather(weatherData);
    }
    location = null;
}

function displayWeather(data) {
    if(data)
    {
        const divArray = document.querySelectorAll('.info');
        weatherInfo.classList.remove('fade-in')
        
        document.querySelector(".error").style.display = "none"
        document.querySelector("#view").textContent = data.weather[0].main
        document.querySelector("h1").textContent = `${data.name}, ${data.sys.country}`
        document.querySelector(".temp").innerHTML = `${Math.round(`${data.main.temp}` - 273.15)} <span>&#8451</span>`
        document.querySelector("#feels_like").innerHTML = `Feels like: ${Math.round(data.main.feels_like - 273)} <span>&#8451</span>`
        document.querySelector("#wind").textContent = `Wind: ${(data.wind.speed * 1.6).toFixed(1)} kph`
        document.querySelector("#humidity").textContent = `Humidity: ${data.main.humidity}%`

        }
}

function throwError() {
    document.querySelector(".error").style.display = "block"
}


