import { useEffect } from "react"
import { useSelector } from "react-redux"
import { setNotification } from "../reducers/notificationReducer"
import { useDispatch } from "react-redux"


export const Notification = () => {

  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
          dispatch(setNotification(null))      
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return <div style={style}>{notification}</div>
}


