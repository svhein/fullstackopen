import { useDispatch } from "react-redux"
import { setAnecdoteFilter } from "../reducers/filterReducer"

export const Filter = () => {

 const dispatch = useDispatch();

  const handleChange = (event) => {
    const value = event.target.value
    dispatch(setAnecdoteFilter(value))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}
