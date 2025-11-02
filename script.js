const API_KEY = "67f2851c3c43a71b6e95ae1378c32ef6";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Event listeners
document.getElementById("getWeatherBtn").addEventListener("click", getWeather);
document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});
document.getElementById("getLocationBtn").addEventListener("click", getLocation);
document.getElementById("toggleTheme").addEventListener("click", toggleTheme);

function getWeather(cityName) {
  const city = cityName || document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");
  const forecastDiv = document.getElementById("forecastContainer");

  if (city === "") {
    alert("⚠️ Silakan masukkan nama kota terlebih dahulu!");
    return;
  }

  fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=id`)
    .then((response) => {
      if (!response.ok) throw new Error("Kota tidak ditemukan!");
      return response.json();
    })
    .then((data) => {
      const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
      document.getElementById("temperature").textContent = `🌡️ Suhu: ${data.main.temp}°C`;
      document.getElementById("humidity").textContent = `💧 Kelembapan: ${data.main.humidity}%`;
      document.getElementById("description").textContent = `☁️ ${data.weather[0].description}`;
      document.getElementById("icon").src = icon;

      resultDiv.style.display = "block";
      getForecast(city);
    })
    .catch(() => {
      alert("❌ Gagal memuat data cuaca. Periksa nama kota atau koneksi internet.");
      resultDiv.style.display = "none";
      forecastDiv.innerHTML = "";
    });
}

function getForecast(city) {
  fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=id`)
    .then((response) => response.json())
    .then((data) => {
      const forecastContainer = document.getElementById("forecastContainer");
      forecastContainer.innerHTML = "";

      const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

      dailyData.forEach(day => {
        const date = new Date(day.dt_txt);
        const options = { weekday: "short", day: "numeric", month: "short" };
        const formattedDate = date.toLocaleDateString("id-ID", options);

        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

        forecastContainer.innerHTML += `
          <div class="forecast-day fade-in">
            <p>${formattedDate}</p>
            <img src="${icon}" alt="icon" />
            <p>${Math.round(day.main.temp)}°C</p>
          </div>`;
      });
    });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch(`${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=id`)
          .then((res) => res.json())
          .then((data) => getWeather(data.name));
      },
      () => alert("❌ Tidak dapat mendeteksi lokasi kamu.")
    );
  } else {
    alert("Perangkat kamu tidak mendukung geolokasi.");
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("toggleTheme");
  btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}
