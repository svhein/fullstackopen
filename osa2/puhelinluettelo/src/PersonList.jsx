import { remove } from "./services/persons"

export const PersonList = ({ persons, setPersons, filter }) => {
    return (
        <div>
        {persons.map(person => {

            if (filter){
            if (!person.name.toLowerCase().includes(filter.toLowerCase())){
                return null
            }
            }

            return (
            <div key={person.name} style={{display:' flex', flexDirection: 'row'}}>
                <p>{person.name}</p>
                <p style={{marginLeft: 20}}>{}{person.number}</p>

                <button style={{marginLeft: 20}}
                onClick={() => {
                    if (window.confirm(`Delete ${person.name}?`)){
                        remove(person.id);   
                        setPersons(persons.filter(p => p.id !== person.id))
                    }
                }}
                >delete</button>

            </div>
            )
        })
        }    
        </div>
    
    )
}