import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRemoveWidget } from '../../RemoveWidgetContext';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const removeWidget = useRemoveWidget();
//   useEffect(() => {
    // Example: OpenWeatherMap API (replace with your API key and location)
//     axios.get('https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric')
//       .then(res => setWeather(res.data))
//       .catch(() => setWeather(null));
//   }, []);
  return (
    <div className="widget weather-widget">
      <button className="remove-widget" onClick={removeWidget} title="Remove">x</button>
      <h3>Weather</h3>
      {weather ? (
        <div>
          <div>{weather.name}</div>
          <div>{weather.main.temp}°C</div>
          <div>{weather.weather[0].description}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
