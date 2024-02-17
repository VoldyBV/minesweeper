import React from 'react'
import './Modal.css'

interface Props {
    show: boolean,
    title: string,
    buttons: Array<{
        text: string,
        className: ('accept' | 'ok' | 'abort') | string,
        onClick: () => void,
    }>,
    children?: React.ReactNode
}

export default function Modal(props: Props) {
  return (
    <div className='modal' style={{display: props.show ? 'flex' : 'none'}}>
        <div className="header">{props.title}</div>
        <div className="body">{props.children}</div>
        <div className="footer">
            {
                props.buttons.map((item, index) => {
                    return <button
                        className={item.className}
                        onClick={item.onClick}
                        key={index}
                    >{item.text}</button>
                })
            }
        </div>
    </div>
  )
}

