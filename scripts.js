const apiKey = "0b088991fa7193f84a7de3c4c7d2ce30";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox = document.querySelector('.location_input');
const searchBtn = document.querySelector('.location_btn');
const weatherIcon = document.querySelector('.weather_icon');

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if(response.status == 404) {
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.weather_view').style.display = 'none';
    } else {
        let data = await response.json();

        console.log(data);

        document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.temp').innerHTML = `${Math.round(data.main.temp)}°c`;
        document.querySelector('.current_weather_type').innerHTML = data.weather[0].main;

        if (data.weather[0].main == "Clouds"){
            weatherIcon.src = 'imgs/weather-icons-cloudy.svg';
        } else if (data.weather[0].main == "Rain"){
            weatherIcon.scr = 'imgs/weather-icons-rain.svg';
        } else if (data.weather[0].main == "Clear"){
            weatherIcon.scr = 'imgs/weather-icons-sunny.svg';
        } else if (data.weather[0].main == "Snow"){
            weatherIcon.scr = 'imgs/weather-icons-snow.svg';
        }
        document.querySelector('.weather_view').style.display = 'flex';
        document.querySelector('.error').style.display = 'none';
    }
}

searchBtn.addEventListener('click', () => {
    checkWeather(searchBox.value);
});