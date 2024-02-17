import React, { Component } from 'react'
// styles 
import './Field.css'

interface Props {
    rows: number,
    cols: number,
    field: Array<Array<number>>,
    toggleFlag: (e: React.MouseEvent) => void,
    dig: (e: React.MouseEvent) => void
}
interface State {

}

export default class Field extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
    }
    generateButtons() {
        var btns: Array<React.ReactNode> = [];
        var isPurpleNow = true;
        var isOdd = (this.props.rows * this.props.cols) % 2 !== 0;
        for(let i = 0; i < this.props.rows; i++){
            for(let j = 0; j < this.props.cols; j++) {
                btns.push(<button 
                    className={`box`}
                    id={`${i}-${j}`}
                    key={`${i}-${j}`}
                    onClick={this.props.dig}
                    onContextMenu={this.props.toggleFlag}
                ></button>);
                isPurpleNow = !isPurpleNow;
            }
            isPurpleNow = !isPurpleNow;
        }

        return btns;
    }
    render() {
        return (
            <div className='field-wrapper'>
                <div className="field"
                    style={{
                        gridTemplateRows: `repeat(${this.props.rows}, 1fr)`,
                        gridTemplateColumns: `repeat(${this.props.cols}, 1fr)`
                    }}
                >{
                    this.generateButtons()
                }</div>
            </div>
        )
    }
}
