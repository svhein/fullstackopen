import { useDispatch } from "react-redux"
import { createSlice } from "@reduxjs/toolkit"


const filterSlice = createSlice({
    name: 'filter',
    initialState: null,
    reducers: {
        setAnecdoteFilter(state, action) {
            return action.payload
        }
    }
})
export const { setAnecdoteFilter } = filterSlice.actions
export const filterReducer = filterSlice.reducer