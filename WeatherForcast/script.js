async function getWeather() {
    const apiKey = "your key";
    let city = document.getElementById("city").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    let response = await fetch(url);
    let data = await response.json();

    if (data.cod === "404") {
        alert("City not found!");
        return;
    }

    // update text
    document.getElementById("temperature").innerHTML = data.main.temp + "°C";
    document.getElementById("cityName").innerHTML = data.name;
    document.getElementById("humidity").innerHTML = "Humidity: " + data.main.humidity + "%";
    document.getElementById("wind").innerHTML = "Wind: " + data.wind.speed + " km/h";

    let desc = data.weather[0].description;
    document.getElementById("condition").innerHTML = desc.charAt(0).toUpperCase() + desc.slice(1);

    // 🌈 temperature background effect
    let temp = data.main.temp;
    let body = document.body;

    if (temp <= 10) {
        body.style.background = "linear-gradient(135deg, #74ebd5, #ACB6E5)";   // blue cool
    } else if (temp > 10 && temp <= 25) {
        body.style.background = "linear-gradient(135deg, #a8ff78, #78ffd6)";   // pleasant green
    } else {
        body.style.background = "linear-gradient(135deg, #f857a6, #ff5858)";   // hot red/orange
    }
    // 5-day forecast
const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
let forecastResponse = await fetch(forecastURL);
let forecastData = await forecastResponse.json();

let forecastBox = document.getElementById("forecast");
forecastBox.innerHTML = ""; // clear previous results

// Every 8th record = next day (API returns every 3 hours)
for (let i = 0; i < forecastData.list.length; i += 8) {
    let day = forecastData.list[i];
    let date = new Date(day.dt * 1000).toLocaleDateString("en-IN", { weekday: "short" });

    let card = `
        <div class="forecast-card">
            <h4>${date}</h4>
            <p>${Math.round(day.main.temp)}°C</p>
            <p>${day.weather[0].main}</p>
        </div>
    `;
    forecastBox.innerHTML += card;
}

}


