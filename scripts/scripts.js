// Реализация прогноза погоды
const apiKey = "0b088991fa7193f84a7de3c4c7d2ce30";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox = document.querySelector('.location_input');
const searchBtn = document.querySelector('.location_btn');
const weatherIcon = document.querySelector('.weather_icon');
const autocomplItems = document.querySelectorAll('.list-items');

// фетчим Api, принимаем город из инпут поля, отправляем запрос, проверяем на ошибку 404, 
// принимаем response в json формате, отображаем нужные данные пользователю.
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
            weatherIcon.src = 'imgs/weather-icons-rain.svg';
        } else if (data.weather[0].main == "Clear"){
            weatherIcon.src = 'imgs/weather-icons-sunny.svg';
        } else if (data.weather[0].main == "Snow"){
            weatherIcon.src = 'imgs/weather-icons-snow.svg';
        } else {
            weatherIcon.src = 'imgs/weather-icons-socloudy.svg';
        }
        document.querySelector('.weather_view').style.display = 'flex';
        document.querySelector('.error').style.display = 'none';

        // Модальное окно с дополнительной инфой
        document.querySelector('.weather_info').addEventListener('click', () => {
            Swal.fire({
                icon: 'info',
                text: `Now is ${data.weather[0].description},
                wind speed is ${data.wind.speed} km/h and humidity is ${data.main.humidity}%.`,
                confirmButtonText: 'Thanks!',
                customClass: {
                    confirmButton: 'modal-btn',
                },
            });
        });
    }
}

// Вызов функции по клику на поиск
searchBtn.addEventListener('click', () => {
    checkWeather(searchBox.value);
});

// Вызов функции по клавише enter
searchBox.addEventListener('keyup', event => {
    if( event.code === 'Enter' ) {
        checkWeather(searchBox.value);
    }
});


// Реализация Autocomplete
const apiAutoKey = 'DVG7Ld7hEVgFcL4RaoteC0LSYo0VwlQN';
const apiAutoUrl = 'https://dataservice.accuweather.com/locations/v1/cities/autocomplete?';

async function autocompl(userInput) {
    const response = await fetch(apiAutoUrl + `apikey=${apiAutoKey}&q=${userInput}&language=en-us`);
    let cityData = await response.json();
    let citys = [];
    if (cityData !== null && cityData !== undefined) {
        for (let i = 0; i < cityData.length; i++) {
            citys.push(cityData[i].LocalizedName);
        }
        const filteredCitys = citys.filter((item, index) => {
            return citys.indexOf(item) === index;
        });
        return filteredCitys;
    }
}

searchBox.addEventListener('keyup', () => {
    autocompl(searchBox.value).then((resolvedValue) => {
        let newCitysArray = resolvedValue;
        //Убираем все элементы, если пользователь ужё ввёл слово
        removeElements();
        for (let i of newCitysArray) {
            if (
                i.toLowerCase().startsWith(searchBox.value.toLowerCase()) && 
                searchBox.value != ''
                ) {
                    //создаём li елемент
                    let listItem = document.createElement("li");
                    listItem.classList.add("list-items");
                    listItem.style.cursor = 'pointer';
                    listItem.setAttribute("onclick", "displayNames('" + i + "')");
                    let searchCity = "<b>" + i.substring(0, searchBox.value.length) + "</b>";
                    searchCity+= i.substring(searchBox.value.length);
                    // Показываем пользователю список
                    listItem.innerHTML = searchCity;
                    document.querySelector('.list').appendChild(listItem);
                    listItem.addEventListener('click', () => {
                        checkWeather(searchBox.value);
                    });
                    }
            }
        });
});

function displayNames(value) {
    searchBox.value = value;
    removeElements();
}

function removeElements() {
    let items = document.querySelectorAll('.list-items');
    items.forEach((item) => {
        item.remove();
    });
}