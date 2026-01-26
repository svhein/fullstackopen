
export const PersonForm = ({ addNewPerson, newName, handleNewName, newNumber, setNewNumber }) => {
    return (
        <div>
            <div>
            name: <input 
            value={newName}
            onChange={handleNewName}
            />
        </div>
        <div>
          number: <input value={newNumber} 
            onChange={(event) => setNewNumber(event.target.value)}
          />
        </div>
        <div>
            <button type="submit"
            onClick={async () => await addNewPerson() }
            >add</button>
            </div>
        </div>
    )
}