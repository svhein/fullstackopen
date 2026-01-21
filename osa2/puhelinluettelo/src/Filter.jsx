

export const Filter = ({ filter, onChange }) => {
    return (
        <div>
          filter name <input
          value={filter}
          onChange={onChange}
          />
        </div>
    )
}