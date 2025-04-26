// DOM elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');
const errorMessage = document.getElementById('error-message');
const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const conditions = document.getElementById('conditions');
const weatherIcon = document.getElementById('weather-icon');
const outfitSuggestion = document.getElementById('outfit-suggestion');
const accessories = document.getElementById('accessories');

// Weather icons mapping
const weatherIcons = {
    "Clear": "☀️",
    "Clouds": "☁️",
    "Rain": "🌧️",
    "Drizzle": "🌦️",
    "Thunderstorm": "⛈️",
    "Snow": "❄️",
    "Mist": "🌫️",
    "Smoke": "💨",
    "Haze": "🌫️",
    "Fog": "🌫️"
};

// Event listeners
searchBtn.addEventListener('click', getRecommendation);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getRecommendation();
});

async function getRecommendation() {
    const location = locationInput.value.trim();
    
    // Clear previous results
    errorMessage.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
    
    if (!location) {
        showError("Please enter a location");
        return;
    }
    
    try {
        // Show loading state
        searchBtn.disabled = true;
        searchBtn.textContent = "Loading...";
        
        // Replace with your actual API key
        const apiKey = 'f932b7df21925ea7a3fe5dec2b1944f3'; 
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
        );
        
        if (!response.ok) {
            throw new Error('Location not found');
        }
        
        const data = await response.json();
        
        const weatherData = {
            temp: data.main.temp,
            conditions: data.weather[0].main,
            humidity: data.main.humidity,
            wind: data.wind.speed
        };
        
        displayWeather(data.name, weatherData);
        generateRecommendation(weatherData);
    } catch (error) {
        showError(`Error: ${error.message}. Try another location.`);
    } finally {
        // Reset button state
        searchBtn.disabled = false;
        searchBtn.textContent = "Get Recommendation";
    }
}

function displayWeather(location, data) {
    locationName.textContent = location;
    temperature.textContent = `${Math.round(data.temp)}°C`;
    conditions.textContent = data.conditions;
    weatherIcon.textContent = weatherIcons[data.conditions] || "🌍";
    weatherDisplay.classList.remove('hidden');
}

function generateRecommendation(data) {
    const temp = data.temp;
    const conditions = data.conditions.toLowerCase();
    const wind = data.wind;
    const humidity = data.humidity;
    
    let outfit = "";
    const accessoryList = [];
    
    // Base outfit based on temperature
    if (temp < 0) {
        outfit = "❄️ Heavy winter coat, thermal layers, gloves, scarf, and warm hat";
    } else if (temp < 10) {
        outfit = "🧥 Warm coat, sweater, jeans, and boots";
    } else if (temp < 18) {
        outfit = "🧣 Light jacket or cardigan with pants or a skirt";
    } else if (temp < 24) {
        outfit = "👕 T-shirt with jeans or a light dress";
    } else {
        outfit = "🩳 Shorts and a t-shirt or summer dress";
    }
    
    // Accessories based on conditions
    if (conditions.includes("rain") || conditions.includes("drizzle")) {
        accessoryList.push("☔ Umbrella");
        accessoryList.push("🧥 Rain jacket");
    }
    if (conditions.includes("snow")) {
        accessoryList.push("⛄ Waterproof boots");
    }
    if (wind > 15) {
        accessoryList.push("💨 Windproof layer");
    }
    if (temp > 25 && (conditions.includes("clear") || conditions.includes("sun"))) {
        accessoryList.push("🧴 Sunscreen");
        accessoryList.push("🕶️ Sunglasses");
    }
    if (temp < 15 && humidity > 70) {
        accessoryList.push("🧦 Warm socks");
    }
    if (conditions.includes("thunderstorm")) {
        accessoryList.push("⚠️ Stay indoors if possible");
    }
    
    outfitSuggestion.textContent = outfit;
    
    // Display accessories
    accessories.innerHTML = "";
    accessoryList.forEach(accessory => {
        const span = document.createElement('span');
        span.className = 'accessory';
        span.textContent = accessory;
        accessories.appendChild(span);
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}