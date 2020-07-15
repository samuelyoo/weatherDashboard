let cities = {
    cityList: ['Toronto', 'Kingston, CA', 'Ottawa','Seoul','Tokyo','New York','London']
};

async function getCurrentWeather(city) {

    let apiKey = '6966ec0965b3ebcdc173bbb576adb215';
    let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    const result = await fetch(queryUrl);
    const data = await result.json();
    let date = new Date();

    document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('date').innerText = moment(date.toISOString(data.dt)).format('(YYYY-MM-DD)');
    let iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('icon').setAttribute("src", iconUrl);
    document.getElementById('currentTemp').innerText = ` Temperature: ${Math.round(data.main.temp-273.15)} C`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('windSpeed').innerText = `Wind speed: ${data.wind.speed} m/s`;


    getUVIndex(data.coord.lon, data.coord.lat);

    getForecastWeather(city);

};

async function getForecastWeather(city) {
    let apiKey = '6966ec0965b3ebcdc173bbb576adb215';
    let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const result = await fetch(queryUrl);
    const data = await result.json();
    let days = [];
    days.push(data.list[7]);
    days.push(data.list[15]);
    days.push(data.list[23]);
    days.push(data.list[31]);
    days.push(data.list[39]);
    let innerHTML = '';
    days.forEach(el => {
        innerHTML += `<div class="col-1"><div class="card border-light" style="color:white;width: 12rem;">
        <div class="card-body" style="padding:5px;background-color:#3385ff;">
            <h5 class="card-title1" id="card-title1">${moment(el.dt_txt).format('YYYY-MM-DD')}</h5>
            <img src="https://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png" class="card-img-top" style="width:30px;heigth:30px;">
            <p>Temp: ${Math.round(el.main.temp - 273.15)} &#x2103;<br>Humidity: ${el.main.humidity}%</p>
        </div>
        </div></div>`;

    });
    document.querySelector('.resultRow').innerHTML = innerHTML;

};

async function getUVIndex(lon, lat) {
    let apiKey = '6966ec0965b3ebcdc173bbb576adb215';
    let queryUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    const result = await fetch(queryUrl);
    const data = await result.json();


    document.getElementById('UV').innerHTML = `UV Index: <span id="UVcolor" class="UVcolor-red">&nbsp;${data.value}&nbsp;</span>`;
    if (data.value <= 3) {
        document.getElementById('UVcolor').className = "UVcolor-green";
    } else if (data.value > 3 && data.value <= 6) {
        document.getElementById('UVcolor').className = "UVcolor-orange";
    } else {
        document.getElementById('UVcolor').className = "UVcolor-red";
    }

};

function renderList(items) {

    document.getElementById('list-group').innerHTML = '';
    let innerHTML = '';
    items.cityList.forEach(el => {
        innerHTML += `<button class="list-group-item rounded text-left" style="margin:3px;background-color: #f5f5f5;" onclick="getCurrentWeather('${el}')">${el}</button>`
    })
    document.getElementById('list-group').innerHTML = innerHTML;


};

function search() {

    let city = document.getElementById('searchBox').value;
    if (city == ''){
        return;
    } else {
    document.getElementById('searchBox').value = '';   
    cities.cityList.unshift(city);
    if (cities.cityList.length > 7) {
        cities.cityList.pop();
    }
    renderList(cities);
    saveToStorage(cities);
    getCurrentWeather(city);
}

};

function saveToStorage(items) {

    localStorage.setItem('cities', JSON.stringify(items.cityList));
};


function loadFromStorage(items) {

    if (localStorage.getItem('cities')) {
        items.cityList = JSON.parse(localStorage.getItem('cities'));
        //return items;
    };
};

function init() {
    loadFromStorage(cities);
    renderList(cities);
    document.addEventListener('keydown', (event) => {
        if (event.keyCode == 13) {
            search();
        }
    });
};

init();