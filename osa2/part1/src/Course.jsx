import { Header } from "./Header"
import { Content } from "./Content"
import { Total } from "./Total"
import React from 'react'

export const Course = ({ course }) => {

    return (
        <React.Fragment>
        <Header headerText={course.name} />
        <Content data={course.parts} />
        <Total parts={course.parts} />    
        </React.Fragment>
    )


}