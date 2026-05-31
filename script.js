const apiKey = "c634a4fdc313277981215e88bd0ed8f9";

function handleKey(event) {
    if (event.key === "Enter") getWeather();
}

async function getWeather() {
    let city = document.getElementById("city").value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    clearError();
    setLoading(true);

    const url         = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (data.cod === "404") {
            showError("City not found. Please try again.");
            setLoading(false);
            return;
        }

        // Temperature & city
        let temp = Math.round(data.main.temp);
        document.getElementById("temperature").innerHTML = temp + "<sup>°C</sup>";
        document.getElementById("cityName").innerHTML    = data.name + ", " + data.sys.country;
        document.getElementById("humidity").innerHTML    = data.main.humidity + "%";
        document.getElementById("feelsLike").innerHTML  = Math.round(data.main.feels_like) + "°C";

        // FIX: convert m/s → km/h
        let windKmh = (data.wind.speed * 3.6).toFixed(1);
        document.getElementById("wind").innerHTML = windKmh + " km/h";

        // Condition
        let desc = data.weather[0].description;
        document.getElementById("condition").innerHTML = desc.charAt(0).toUpperCase() + desc.slice(1);

        // Dynamic icon from API
        let iconCode = data.weather[0].icon;
        let iconEl = document.getElementById("icon");
        iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        iconEl.classList.add("visible");

        // Background based on temperature
        let body = document.body;
        body.className = "";
        if (temp <= 10)       body.classList.add("cold");
        else if (temp <= 25)  body.classList.add("mild");
        else                  body.classList.add("hot");

        // 5-day forecast
        let forecastResponse = await fetch(forecastURL);
        let forecastData     = await forecastResponse.json();
        
        let forecastBox      = document.getElementById("forecast");
        forecastBox.innerHTML = "";

        for (let i = 0; i < forecastData.list.length; i += 8) {
            let day     = forecastData.list[i];
            let dayName = new Date(day.dt * 1000).toLocaleDateString("en-IN", { weekday: "short" });
            let dayTemp = Math.round(day.main.temp);
            let dayIcon = day.weather[0].icon;
            let dayDesc = day.weather[0].main;

            forecastBox.innerHTML += `
                <div class="forecast-card">
                    <div class="forecast-day">${dayName}</div>
                    <img src="https://openweathermap.org/img/wn/${dayIcon}.png" alt="${dayDesc}">
                    <div class="forecast-temp">${dayTemp}°C</div>
                    <div class="forecast-desc">${dayDesc}</div>
                </div>
            `;
        }

    } catch (error) {
        showError("Network error. Please check your connection.");
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    let card = document.getElementById("weatherCard");
    let btn  = document.getElementById("searchBtn");
    if (isLoading) {
        card.classList.add("loading");
        btn.textContent  = "Loading...";
        btn.disabled     = true;
    } else {
        card.classList.remove("loading");
        btn.textContent  = "Search";
        btn.disabled     = false;
    }
}

function showError(msg) {
    document.getElementById("errorMsg").textContent = msg;
}

function clearError() {
    document.getElementById("errorMsg").textContent = "";
}