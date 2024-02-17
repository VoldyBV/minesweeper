import React, { Component } from 'react'
// styles
import "./App.css"
// icons
import Icons from './icons/Icons'
// sounds
import Sounds from './sounds/Sounds'
// components
import Navbar from './components/Navbar'
import Field from './components/Field/Field'
import Modal from './components/Modal/Modal'
// other
import GlobalFunctions from './GlobalFunctions'

interface State {
  settings: {
    mute: (e: React.MouseEvent) => void,
    toggleSettings: () => void,
    help: () => void,
  },
  showHelpModal: boolean,
  showSettingsModal: boolean,
  showVictoryModal: boolean,
  showDefeatModal: boolean,
  showField: boolean,
  starredBtnId: string,
  isMute: boolean,
  rows: number,
  cols: number,
  maxRows: number,
  maxCols: number,
  mines: number,
  minesIndicator: number,
  field: Array<Array<number>>
}
export default class App extends Component <{}, State> {
  constructor(props: {}) {
    super(props)
    
    //cutom shortcuts
    this.handleKeyDown = this.handleKeyDown.bind(this);
    // settings methods
    this.mute = this.mute.bind(this);
  
    // button methods
    this.toggleFlag = this.toggleFlag.bind(this);
    this.dig = this.dig.bind(this);

    // other
    this.isVictory = this.isVictory.bind(this);
    this.begin = this.begin.bind(this);
    this.playSound = this.playSound.bind(this);
    this.victory = this.victory.bind(this);
    this.defeat = this.defeat.bind(this);
    this.placeStar = this.placeStar.bind(this);
    this.colorise = this.colorise.bind(this);
    this.restartThisGame = this.restartThisGame.bind(this);
    this.newGame = this.newGame.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.newGameNewSettings = this.newGameNewSettings.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
    this.state = {
      settings: {
        mute: this.mute,
        toggleSettings: this.toggleSettings,
        help: this.toggleHelp,
      },
      showHelpModal: true,
      showSettingsModal: false,
      showVictoryModal: false,
      showDefeatModal: false,
      showField: false,
      starredBtnId: '',
      isMute: false,
      rows: 8,
      cols: 8,
      maxRows: Math.floor((window.innerHeight - 4*16 - 4) / 40),
      maxCols: Math.floor((window.innerWidth * 0.95 - 20) / 40),
      mines: 12,
      minesIndicator: 12,
      field: GlobalFunctions.generateField(8, 8, 12)
    }
  }
  componentDidMount(): void {
    window.addEventListener("keydown", this.handleKeyDown)
  }
  handleKeyDown(event: KeyboardEvent) {
    let isCtrlAlt = event.ctrlKey && event.altKey;

    if(!isCtrlAlt) return;
    switch (event.code.toLowerCase()) {
      case "keym": document.getElementById("mute-btn")?.click(); break;
      case "keys":this.toggleSettings(); break;
      case "keyh": this.toggleHelp(); break;
      default: break;
    }
  }
  begin() {
    Object.entries(Sounds).forEach(([key, value]) => {
      var audio = (document.getElementById(key) as HTMLAudioElement);
      audio.volume = 0;
      audio.play();
      setTimeout(() => {
        audio.pause();
        audio.volume = 1;
        audio.currentTime = 0;
      }, 200);
    });
    this.setState({
      showField: true,
      starredBtnId: GlobalFunctions.getStarredButtonId(this.state.field),
    }, () => {
      this.placeStar();
      this.colorise();
    })
  }
  mute(event: React.MouseEvent) {
    var img = event.target as HTMLImageElement;
    var isMute = !this.state.isMute;
    
    if(isMute) img.src = Icons.soundOff
    else img.src = Icons.soundOn

    this.setState({
      isMute,
    })
  }
  placeStar() {
    document.getElementById(this.state.starredBtnId)?.toggleAttribute("starred");
  }
  colorise() {
    for(const x in this.state.field){
      let isPurple = Number(x) % 2 === 0
      for(const y in this.state.field[x]) {
        let bgc = isPurple ? 'purple' : 'slate-gray';
        isPurple = !isPurple;
        document.getElementById(`${x}-${y}`)?.classList.add(bgc)
      }
    }
  }
  dig(event: React.MouseEvent) {
    var btn = event.target as HTMLButtonElement;

    if(btn.hasAttribute("disabled") || btn.hasAttribute("flag")) return;

    if(btn.hasAttribute("starred")) {
      btn.toggleAttribute("starred");
    }

    var x = Number(btn.id.split('-')[0]);
    var y = Number(btn.id.split('-')[1]);
    var indicator = this.state.field[x][y];


    btn.toggleAttribute("disabled")

    // if user clicks on the mine
    if(indicator === -1) {
      this.playSound("explosion");
      btn.classList.add("bombed");
      this.defeat()
      return
    }
    if(indicator === 0) {
      let x = Number(btn.id.split('-')[0]);
      let y = Number(btn.id.split('-')[1]);
      let x1 = x - 1;
      let x2 = x + 1;
      let y1 = y - 1;
      let y2 = y + 1;
      
      let btns: Array<HTMLElement | null> = [
        document.getElementById(`${x1}-${y1}`),
        document.getElementById(`${x1}-${y}`),
        document.getElementById(`${x1}-${y2}`),
        document.getElementById(`${x}-${y1}`),
        document.getElementById(`${x}-${y2}`),
        document.getElementById(`${x2}-${y1}`),
        document.getElementById(`${x2}-${y}`),
        document.getElementById(`${x2}-${y2}`),
      ];

      btns.forEach((item) => {
        
        if(!!item) {
          let x = Number(item.id.split('-')[0]);
          let y = Number(item.id.split('-')[1]);
          if(this.state.field[x][y] !== -1) {
            item.click();
          }
        }
      })
    }
    //else
    switch (indicator) {
      case 1: this.playSound("mine1"); break;
      case 2: this.playSound("mine2"); break;
      case 3: this.playSound("mine3"); break;
      case 4: this.playSound("mine4"); break;
      case 5: this.playSound("mine5"); break;
      case 6: this.playSound("mine6"); break;
      case 7: this.playSound("mine7"); break;
      default:break;
    }
    btn.innerText = indicator.toString();
    btn.classList.toggle(`indicator-${indicator}`);
    if(this.isVictory()) {
      this.victory()
    }
  }
  toggleFlag(event: React.MouseEvent) {
    event.preventDefault();
    var btn = event.target as HTMLButtonElement;
    
    if(btn.hasAttribute("disabled")) return;

    var k = btn.hasAttribute("flag") ? 1 : -1;

    if(this.state.minesIndicator === 0 && !btn.hasAttribute("flag")) return;

    btn.toggleAttribute("flag");
    btn.classList.toggle("flagged");
    this.setState({
      minesIndicator: this.state.minesIndicator + k
    })
  }
  playSound(id: string) {
    (document.getElementById(id) as HTMLAudioElement).play();
  }
  isVictory() {
    var fields = document.querySelectorAll("button.box:not([disabled]");
    
    return fields.length === this.state.mines;
  }
  victory(){
    document.querySelectorAll("button.box").forEach(btn => btn.setAttribute("disabled", ''));
    setTimeout(() => {
      this.playSound("victory");
      this.setState({
        showVictoryModal: true,
      })
    }, 500);
  }
  defeat() {
    document.querySelectorAll("button.box").forEach(btn => btn.setAttribute("disabled", ''));
    setTimeout(() => {
      this.playSound("defeat");
      this.setState({
        showDefeatModal: true,
      })
    }, 1000);
  }
  newGame() {
    let settings = {...this.state};
    settings.showSettingsModal = false;
    settings.showVictoryModal = false;
    settings.showDefeatModal = false;
    settings.minesIndicator = settings.mines;
    settings.field = GlobalFunctions.generateField(settings.rows, settings.cols, settings.mines);
    settings.starredBtnId = GlobalFunctions.getStarredButtonId(settings.field);
    this.setState({
      settings: {
        mute: this.mute,
        toggleSettings: this.toggleSettings,
        help: this.toggleHelp,
      },
      showSettingsModal: false,
      showVictoryModal: false,
      showDefeatModal: false,
      isMute: false,
      rows: 0,
      cols: 0,
      maxRows: 0,
      maxCols: 0,
      mines: 0,
      minesIndicator: 0,
      field: []
    }, () => this.setState(settings, () => {
      this.placeStar();
      this.colorise();
    }))
  }
  restartThisGame() {
    var settings = {...this.state};
    settings.minesIndicator = settings.mines;
    settings.showDefeatModal = false;
    this.setState({
      settings: {
        mute: this.mute,
        toggleSettings: this.toggleSettings,
        help: this.toggleHelp,
      },
      showSettingsModal: false,
      showVictoryModal: false,
      showDefeatModal: false,
      isMute: false,
      rows: 0,
      cols: 0,
      maxRows: 0,
      maxCols: 0,
      mines: 0,
      minesIndicator: 0,
      field: []
    }, () => this.setState(settings, () => {
      this.placeStar();
      this.colorise();
    }))
  }
  toggleSettings() {
    this.setState({
      showSettingsModal: !this.state.showSettingsModal,
    })
  }
  newGameNewSettings() {
    var form = document.querySelector("#settings-modal-body")! as HTMLFormElement;
    var obj = Object.fromEntries((new FormData(form)).entries()) as {rows: string, cols: string, mines: string};
    
    if(obj.rows.length === 0) {
      alert(`Fill out "Rows" field`);
      return;
    }
    if(Number(obj.rows) < 1) {
      alert("Rows must be greater than 0");
      return;
    }
    if(Number(obj.rows) > this.state.maxRows) {
      alert(`Rows must be less than or equal to ${this.state.maxRows}`);
      return;
    }
    if(obj.cols.length === 0) {
      alert(`Fill out "Columns" field`);
      return;
    }
    if(Number(obj.cols) < 1) {
      alert("Columns must be greater than 0");
      return;
    }
    if(Number(obj.cols) > this.state.maxCols) {
      alert(`Columns must be less than or equal to ${this.state.maxCols}`);
      return;
    }
    if(obj.mines.length === 0) {
      alert(`Fill out "Mines" field`);
      return;
    }
    if(Number(obj.mines) < Math.floor(Number(obj.rows) * Number(obj.cols) * 2 / 16)) {
      alert(`Mines must be greater than or equal to ${Math.floor(Number(obj.rows) * Number(obj.cols) * 2 / 16)}`);
      return;
    }
    if(Number(obj.mines) > Math.floor(Number(obj.rows) * Number(obj.cols) * 4 / 16)) {
      alert(`Mines must be less than or equal to ${Math.floor(Number(obj.rows) * Number(obj.cols) * 4 / 16)}`);
      return;
    }
    form.reset()
    this.setState({
      rows: Number(obj.rows),
      cols: Number(obj.cols),
      mines: Number(obj.mines),
    }, this.newGame)
  }
  toggleHelp() {
    this.setState({
      showHelpModal: !this.state.showHelpModal
    })
  }
  render() {
    return (
      <div className='App'>
      <Modal show={this.state.showHelpModal} title='Help'
        buttons={[
          {text: "OK", className: 'accept', onClick: this.toggleHelp},
        ]}
      >
        <div id='modal-help-message'>
        <p>
          Minesweeper is a classic computer game that tests your logic and concentration skills. The goal is to clear a grid of hidden mines without detonating any of them. Here are some basic instructions on how to play minesweeper:

        </p>
        <ol>
          <li>Click on a square in a grid to <em>"dig it"</em>. You will see a number that indicates how many mines are adjacent to that square. If the square is blank, it means there are no mines nearby and you can click on the surrounding squares to reveal more numbers.</li>
          <li>At the start of a game, one square will have a star on it. That means that it is <strong>safe</strong> and you should click on it</li>
          <li>Use the numbers to deduce where the mines are. For example, if you see a 1, it means there is exactly one mine next to that square. If you see a 2, there are two mines, and so on.</li>
          <li>To mark a square as a mine, <strong>right-click</strong> on it. This will place a flag on the square. You can also use flags to keep track of your guesses.</li>
          <li>To win the game, you have to clear all the squares that do not contain mines. If you click on a mine, you lose the game.</li>
          <li>You can adjust the difficulty level by choosing the size of the grid and the number of mines. The larger the grid and the more mines, the harder the game.</li>
        </ol>
        Here are some useful shortcuts:
        <ul>
          <li><code>ctrl+alt+m</code> - Mute / Unmute</li>
          <li><code>ctrl+alt+h</code> - Toggle help modal</li>
          <li><code>ctrl+alt+s</code> - Toggle settings modal</li>
        </ul>

Minesweeper is a fun and challenging game that can improve your problem-solving skills. Try it out and see if you can beat your best time!
        </div>
      </Modal>
        <Modal show={this.state.showSettingsModal} title='Settings'
          buttons={[
            {text: "New game", className: 'accept', onClick: this.newGameNewSettings},
            {text: "Cancel", className: 'abort', onClick: this.toggleSettings},
          ]}
        >
          <form id='settings-modal-body'>
            <label htmlFor="rows">
              <span>{"Rows:"}</span>
              <input type="number" name="rows" id="rows" />
            </label>
            <label htmlFor="cols">
              <span>{"Columns:"}</span>
              <input type="number" name="cols" id="cols" />
            </label>
            <label htmlFor="mines">
              <span>{"Mines:"}</span>
              <input type="number" name="mines" id="mines" />
            </label>
          </form>
        </Modal>
        <Modal show={this.state.showVictoryModal} title='Congratulations!'
          buttons={[
            {text: "New game", className: 'accept', onClick: this.newGame},
          ]}
        >
          <div id='modal-defeat-message'>
            <span>{'Well done!'}</span>
            <span>{'Wanna play again?'}</span>
          </div>
        </Modal>
        <Modal show={this.state.showDefeatModal} title='Game over'
          buttons={[
            {text: "New game", className: 'accept', onClick: this.newGame},
            {text: "Restart", className: 'ok', onClick: this.restartThisGame},
          ]}
        >
          <div id='modal-defeat-message'>
            <span>{'Hahahahahha you lost!'}</span>
            <span>{'No worries, try again.'}</span>
          </div>
        </Modal>
        <Navbar settings={this.state.settings} minesIndicator={this.state.minesIndicator}></Navbar>
        {Object.entries(Sounds).map(([key, value]) => {
          return <audio muted={this.state.isMute} id={key} key={key} src={value}></audio>
        })}
        {
          !this.state.showField ?
          <button className='start-game' onClick={this.begin}>start the game</button> :
            <Field
            rows={this.state.rows} 
            cols={this.state.cols} 
            field={this.state.field}
            toggleFlag={this.toggleFlag}
            dig={this.dig}
          ></Field>
        }
      </div>
    )
  }
}
