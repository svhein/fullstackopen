export const Content = ({ data }) => {
    
    console.log('test', data)

    return (
        <div>
        <Part part={data[0]} />
        <Part part={data[1]} />
        <Part part={data[2]} />
        </div>
    )
}

const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}