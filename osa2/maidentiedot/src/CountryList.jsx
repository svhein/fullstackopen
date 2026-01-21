
export const CountryList = ({ countries, onSelectCountry }) => {


    if (countries.length === 0) {
        return <div>No countries to found</div>;
    }

    if (countries.length > 10) {
        return <div>Too many matches</div>;
    }


    return (
        <div>
            <h2>Country List</h2>
        
                {countries.map((country) => (
                    <li key={country}> 
                        {country}
                        <button onClick={() => onSelectCountry(country)}>Show</button>
                    </li>
                ))}
   
        </div>
    );
}