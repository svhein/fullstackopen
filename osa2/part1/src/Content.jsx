export const Content = ({ data }) => {
    
    console.log('test', data)

    return (
        <div>
            {data.map(item => {
             
                return (
                    <Part part={item} />
                )
            
            })}
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