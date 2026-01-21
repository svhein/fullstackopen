import { useEffect, useState} from 'react'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

export const SelectedCountry = ({ countryName, countryDataMap }) => {

    console.log('Country name prop:', countryName);

    const countryData = countryDataMap.get(countryName);

    console.log('Selected country data:', countryData);

    const capital = countryData.capital;
    const area = countryData.area;
    const population = countryData.population;

    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            console.log(`Fetching weather data for ${capital}...`);
            const api = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${capital}&aqi=no`;
            try {
                const response = await fetch(api);
               
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setWeather(data);

                console.log(data);

            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };
        fetchWeather();
    }, [capital]);


    if (!countryData) {
        return <div>No country data available.</div>;
    }


    return (

        <div>
            <h2>{countryName}</h2>
            <p>Capital: {capital}</p>
            <p>Area: {area} km²</p>
            <p>Population: {population}</p>

            <h2>Languages</h2>
            {Object.values(countryData.languages).map((language) => (
                <li key={language}>{language}</li>
            ))}

            {weather ? (
                <div>
                    <h3>Weather in {capital}</h3>
                    <p>Temperature: {weather.current.temp_c} °C</p>
                    <p>Feels like {weather.current.feelslike_c} °C</p>
                    <p>Condition: {weather.current.condition.text}</p>
                    <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>


    )
}