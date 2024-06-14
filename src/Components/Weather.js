import React, { useState } from 'react';
import './Weather.css';
import { FaSearch, FaWind } from "react-icons/fa";
import { MdLocationOn } from 'react-icons/md';
import { WiHumidity } from 'react-icons/wi';

const Weather = () => {
    const [city, setCity] = useState('');
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState('');

    const API_KEY = "5acc1683650652bab831ecf7d57fd397";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

    function handleOnChange(event) {
        setCity(event.target.value);
    }

    async function fetchData() {
        try {
            let response = await fetch(url);
            let output = await response.json();
            if (response.ok) {
                setForecast(output);
                console.log(output);
                setError('');
            } else {
                setError('No data found. Please enter a valid city name.');
            }
        } catch (error) {
            setError('An error occurred while fetching the data.');
        }
    }

    const getDailyForecasts = (data) => {
        const dailyForecasts = [];
        const seenDates = new Set();
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!seenDates.has(date) && dailyForecasts.length < 5) {
                dailyForecasts.push(item);
                seenDates.add(date);
            }
        });
        return dailyForecasts;
    }

    return (
        <div className='container'>
            <div className='city'>
                <input type='text' value={city} onChange={handleOnChange} placeholder='Enter any city name'></input>
                <button onClick={() => fetchData()}>
                    <FaSearch></FaSearch>
                </button>
            </div>

            {error && <p className='error-message'>{error}</p>}

            {forecast && forecast.list && 
                <div className='content'>
                    <div className='weather-city'>
                        <div className='location'>
                            <MdLocationOn></MdLocationOn>
                        </div>
                        <p>{forecast.city.name}, <span>{forecast.city.country}</span></p>
                    </div>
                    {getDailyForecasts(forecast).map((day, index) => (
                        <div key={index} className='day-forecast'>
                            <div className='weather-image'>
                                <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt='Weather icon'></img>
                                <h3 className='desc'>{day.weather[0].description}</h3>
                            </div>
                            <div className='weather-temp'>
                                <h2>{day.main.temp}<span>&deg;C</span></h2>
                            </div>
                            <div className='weather-stats'>
                                <div className='wind'>
                                    <div className='wind-icon'><FaWind /></div>
                                    <p>{day.wind.speed} m/s</p>
                                </div>
                                <div className='humidity'>
                                    <div className='humidity-icon'><WiHumidity /></div>
                                    <p>{day.main.humidity}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default Weather;
