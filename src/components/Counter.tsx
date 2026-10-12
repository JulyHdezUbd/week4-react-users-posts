import useCounter from "./useCounter"

function Counter() {

    const { increment,
        decrement,
        count } = useCounter()

    // const [count, setCount] = useState(0)

    // const increment = () => {
    //     setCount(prev => prev + 1)
    // }


    // const decrement = () => {
    //     setCount(prev => prev - 1)



    return (
        <>
            <button
                type="button"
                className="counter"
                onClick={increment}
            >
                Increment
            </button>
            Counter {count}
            <button
                type="button"
                className="counter"
                onClick={decrement}
            >
                Decrement
            </button>
        </>
    )
}

export default Counter