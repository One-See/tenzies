
export default function Die(props) {

    return (
        <div onClick={(event)=>props.handleDieClick(event, props.index)} className={props.set ? "box-set" : "box"}>
            {props.number}
        </div>
    )
}