import { sendGet } from "./axios";
import { sendGetAir } from "./axiosAir";
import { OPEN_WEATHER_BASE_URL, OPEN_WEATHER_API_KEY } from './const'

const getWeatherByName = async (name = "Hanoi") => {
  try {
    // const res = await sendGet(`/weather?q=${name}&units=metric&appid=1194cb71b2922d22d0acc81dccb15346`);
    const res = await sendGet(`/forecast.json?key=1e648b8ae2c444068a182111221202&q=${name}&days=5`);
    return res;
  } catch (error) {
    return error;
  }
};

const searchCity = async (name = "") => {
  try {
    const res = await sendGet(`/search.json?key=1e648b8ae2c444068a182111221202&q=${name}`);
    return res;
  } catch (error) {
    return error;
  }
};

const getAirQuality = async (lat = "21.03", lon = "105.85") => {
  try {
    const res = await sendGetAir(`/nearest_city?key=dfbd5d7a-11eb-42ab-beb2-9ede6e8e50e2&lat=${lat}&lon=${lon}`);
    return res;
  } catch (error) {
    return error;
  }
};

const getDataOpenWeather = async (latitude = "21.116671", longitude = "105.883331") => {
  try {
    const weatherUrl = OPEN_WEATHER_BASE_URL + `lat=${latitude}&lon=${longitude}&units=metric&lang=vi&appid=${OPEN_WEATHER_API_KEY}`;
    const response = await fetch(weatherUrl);
    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      console.log(result.message);
      return null;
    }
  } catch (error) {
    return error;
  }
}

const getOpenWeatherOneCallData = async (latitude = "21.116671", longitude = "105.883331") => {
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,alerts&appid=${OPEN_WEATHER_API_KEY}&lang=vi&units=metric`;
    const response = await fetch(weatherUrl);
    const result = await response.json();


    if (response.ok) {
      return result;
    } else {
      console.log(result.message);
      return null;
    }
  } catch (error) {
    return error
  }
}

const weatherService = {
  getWeatherByName,
  searchCity,
  getAirQuality,
  getDataOpenWeather,
  getOpenWeatherOneCallData
};

export default weatherService;