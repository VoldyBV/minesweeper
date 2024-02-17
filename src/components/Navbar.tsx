import React, { Component } from 'react'
// styles
import './Navbar.css'
// icons
import Icons from '../icons/Icons'

interface Props {
    settings: {
        mute: (e: React.MouseEvent) => void,
        toggleSettings: () => void,
        help: () => void,
    },
    minesIndicator: number
}

export default class Navbar extends Component <Props, {}> {
  constructor(props: Props) {
    super(props)
  }
  render() {
    return (
      <div className='navbar'>
        <span className="tool">{this.props.minesIndicator}</span>
        <img id='mute-btn' onClick={this.props.settings.mute} src={Icons.soundOn} alt="" className="tool" />
        <img onClick={this.props.settings.help} src={Icons.help} alt="" className="tool" />
        <img onClick={this.props.settings.toggleSettings} src={Icons.settings} alt="" className="tool" />
      </div>
    )
  }
}
