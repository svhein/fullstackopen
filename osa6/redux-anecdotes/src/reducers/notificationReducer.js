import { createSlice } from "@reduxjs/toolkit"


export const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification(state, action) {
            return action.payload
        }
    }

})

const notificationReducer = notificationSlice.reducer
export const { setNotification } = notificationSlice.actions
export { notificationReducer }
