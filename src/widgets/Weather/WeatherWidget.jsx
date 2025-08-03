
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
  }, [weatherProp, weather]);

  return (
    <div className="widget weather-widget" style={{ position: 'relative', overflow: 'hidden'}}>
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      >
        <source src="/assets/sky_cloud.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Top left: date, time, position */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2, textAlign: 'left', fontSize: '1rem', color: '#fff', padding: '0.5rem 1rem', fontFamily: 'Montserrat, sans-serif'}}>
        <div>{dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}</div>
      </div>
      <button className="remove-widget circular-remove" onClick={removeWidget} title="Remove" style={{ zIndex: 2 }}>
        <CloseIcon fontSize="small" style={{ color: '#fff' }} />
      </button>
      {/* <h3 className="weather-heading-centered">        
        Calgary Weather Forecast
      </h3> */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {weather ? (
          <div className="weather-details-centered">
            <div style={{ fontWeight: 'bold', fontSize: '2rem' , marginTop: '4rem'}}>Calgary</div>
            <div className="weather-animated-row" style={{ fontSize: '4.5rem', margin: '2rem 0 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {(() => {
                if (weather.temperature >= 25) {
                  return <i className="fa-solid fa-sun" style={{ fontSize: '7rem', color: '#ffd700' }}></i>;
                } else if (weather.temperature >= 15) {
                  return <i className="fa-solid fa-cloud-sun" style={{ fontSize: '7rem', color: '#f7c04a' }}></i>;
                } else if (weather.temperature >= 5) {
                  return <i className="fa-solid fa-cloud" style={{ fontSize: '7rem', color: '#b0c4de' }}></i>;
                } else {
                  return <i className="fa-solid fa-snowflake" style={{ fontSize: '7rem', color: '#bae6fd' }}></i>;
                }
              })()}
              <span style={{ fontWeight: 'bold' }}>{weather.temperature}</span>°C
            </div>
            <div><i className="fa-solid fa-wind" style={{ fontSize: '1.5rem', marginTop: '0px',marginRight: '6px' }}>
              </i><span style={{ fontSize: '1.5rem' }}>Wind: {weather.windspeed} km/h</span></div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
