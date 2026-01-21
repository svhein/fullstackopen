import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'
import { getAllCountryData } from './services/country'
import { SelectedCountry } from './SelectedCountry'
import { CountryList } from './CountryList'

function App() {
  
  const [countryData, setCountryData] = useState(new Map())
  const [countryNames, setCountryNames] = useState([])

  const [loaded, setLoaded] = useState(false)

  const [filter, setFilter] = useState('')

  const [currentCountries, setCurrentCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)


  useEffect(() => {

    const loadData = async () => {
      await getAllCountryData().then(data => {
        const newMap = new Map()
        data.forEach(country => {
          newMap.set(country.name.common, country)
        })
        setCountryData(newMap)
        console.log(data[0])
        console.log(data)
      }
      )
    }
    
    loadData()
  }, [])

  useEffect(() => {
    if (countryData.size > 0) {
      const names = Array.from(countryData.keys())
      setCountryNames(names)
      setLoaded(true)
    }
  }, [countryData])

  useEffect(() => {
    if (filter === '') {
      setCurrentCountries([])
      return
    }
    
    const filtered = countryNames.filter(name => name.toLowerCase().includes(filter.toLowerCase()))
    setCurrentCountries(filtered)
  }, [filter])

  if (!loaded) {
    return <div><h1>Loading...</h1></div>
  }


  return (
    <>
  
      <div>
        <h2>Find countries</h2>
        <input value={filter} onChange={(e) => {
          setFilter(e.target.value)
          setSelectedCountry(null)
        }} />
      </div>


      {selectedCountry !== null ? (
        <SelectedCountry
          countryName={selectedCountry}
          countryDataMap={countryData}
        />
      ) : (
        <CountryList
          countries={currentCountries}
          onSelectCountry={(name) => setSelectedCountry(name)}
        />
      )}
    </>
      
  )
}

export default App
