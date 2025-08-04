import { useEffect, useState } from 'react';
import { useRemoveWidget } from '../../RemoveWidgetContext';
import '../../RemoveWidgetContext.css';
import './WeatherWidget.css';
import CloseIcon from '@mui/icons-material/Close';

export default function WeatherWidget({ weather: weatherProp, setWeather: setWeatherProp }) {
  const [weather, setWeather] = useState(weatherProp || null);
  const removeWidget = useRemoveWidget();

  // Calgary, Alberta, Canada coordinates
  const latitude = 51.0447;
  const longitude = -114.0719;

  // Date/time state
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (weatherProp) {
      setWeather(weatherProp);
    } else if (!weather) {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
          setWeather(data.current_weather);
          if (setWeatherProp) setWeatherProp(data.current_weather);
        })
        .catch(() => {
          // Show mock data if API fails
          const mockWeather = {
            temperature: 18,
            windspeed: 12,
          };
          setWeather(mockWeather);
          if (setWeatherProp) setWeatherProp(mockWeather);
        });
    }
  }, [weatherProp, weather, setWeatherProp]);

  const getWeatherIcon = (temperature) => {
    if (temperature >= 25) {
      return <i className="fa-solid fa-sun weather-icon-sun"></i>;
    } else if (temperature >= 15) {
      return <i className="fa-solid fa-cloud-sun weather-icon-cloud-sun"></i>;
    } else if (temperature >= 5) {
      return <i className="fa-solid fa-cloud weather-icon-cloud"></i>;
    } else {
      return <i className="fa-solid fa-snowflake weather-icon-snowflake"></i>;
    }
  };

  return (
    <div className="widget weather-widget">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="weather-video-bg"
      >
        <source src="/widget_dashboard/assets/sky_cloud.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Top left: date, time, position */}
      <div className="weather-datetime">
        <div>{dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}</div>
      </div>
      
      <button 
        className="remove-widget circular-remove" 
        onClick={removeWidget} 
        title="Remove"
      >
        <CloseIcon fontSize="small" />
      </button>
      
      <div className="weather-content">
        {weather && (
          <div className="weather-details-centered">
            <div className="weather-city">Calgary</div>
            <div className="weather-animated-row">
              {getWeatherIcon(weather.temperature)}
              <span className="weather-temperature">{weather.temperature}</span>°C
            </div>
            <div className="weather-wind-info">
              <i className="fa-solid fa-wind weather-wind"></i>
              <span className="weather-wind-text">Wind: {weather.windspeed} km/h</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
