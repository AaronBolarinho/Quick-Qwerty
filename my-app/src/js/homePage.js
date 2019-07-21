import React, { Component } from 'react'
import '../css/App.css'
//
import Timer from 'react-compound-timer'
//
import axios from 'axios'
//
import $ from 'jquery'


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      named: false,
      score: 0,
      typerWord: '',
      randomWord: '',
      gameOver: false,
      timerStarted: false,
      pointsTimer: 0,
      apiKey: ''
    }
  }

  // This handler runs after a user name is entered
  // it sets the state of the userName

  enterName = (e) => {
    e.preventDefault()
    this.setState({ userName: e.target.name.value })
    this.setState({ named: true })
  }

  // this function starts the game and allows unimpeded
  // typing in the typer form
  gameStarted = () => {
    this.setState({ timerStarted: true })
  }

  // this function ends the game and displays the final
  // html
  gameOver = () => {
    this.setState({ gameOver: true })
  }

  trackSpeed = () => {
    console.log('trackSpeedRan!')

    // setTimeout(myFunction, 3000)
  }

  // this function handles the user's typing in the
  // typerForm
  handleChange = (e) => {
    e.preventDefault()

    let wordInProg = e.target.value
    let finalWord = wordInProg.toLowerCase()

    // setTimeout(this.trackSpeed, 1000)

    if (wordInProg.length === 1) {
      this.trackSpeed()
    }

    if (!this.state.timerStarted) {
      alert('Please start the timer :)')
    } else if (finalWord === this.state.typerWord) {
      // this.state.score++
      this.setState({ score: this.state.score++ })
      let randomNum = Math.floor((Math.random() * 3091) + 1)
      this.setState({ typerWord: this.state.randomWord[randomNum] })
      document.getElementById('typer-form').reset()
    }
  }

  // This makes the api call to get the words list from
  // random-word-api
  getWordsList = () => {
    let randomNum = Math.floor((Math.random() * 3091) + 1)

    axios.get(`https://random-word-api.herokuapp.com/all?key=${this.state.apiKey}`)
      .then(response => {
        const myVariable = response.data

        this.setState({ randomWord: myVariable })
        this.setState({ typerWord: this.state.randomWord[randomNum] })
      })
      .catch(error => {
        console.log(error)
      })
  }

  // these functions conditionally render all my html:
  // renderName, renderScore, renderWord, renderTimer, and renderTyper
  renderName = () => {
    let nameForm

    if (!this.state.named) {
      nameForm =
        <div className='nameForm'>
          <form onSubmit={this.enterName}>
            <label className="whiteTxt">
              Name Thyself...Keyboard Warrior!
              <br></br>
              <input type='text' name='name' />
            </label>
            <br></br>
            <input type='submit' value='I am so named' />
          </form>
        </div>
    } else {
      nameForm = <div className='nameForm2'>
        <p className='whiteTxt'>{this.state.userName}!!</p>
        <br></br>
        {this.renderScore()}
      </div>
    }   
    return nameForm
  }

  renderScore = () => {
    let score

    if (this.state.score === 0) {
      score =
      <div className="whiteTxt">
        <p> Your Score is...</p>
        <p>Nothing Yet!</p>
      </div>
    } else {
      score =
      <div className="whiteTxt">
        <p> Your Score is...</p>
        <p>{this.state.score}</p>
      </div>
    }    
    return score
  }

  renderWord = () => {
    let word

    if (this.state.named) {
      word =
      <div>
        <div className='whiteTxt randomWord3'>
          <p>Press start and Go!</p>
        </div>
        <div className='whiteTxt randomWord2'>
          <span>Type it quick! --> </span>
          <span className='typerWord'>{this.state.typerWord}</span>
        </div>
      </div>
    } else { word =
      <div className='whiteTxt randomWord'>
        <p>Your First word is...(Name yourself first)</p>
      </div>
    }     
    return word
  }

  renderTimer = () => {
    let timer =
      <div className='clock'>
        <Timer
          initialTime={180000}
          startImmediately={false}
          direction='backward'
          checkpoints={[
            {
              time: 5,
              callback: () => this.gameOver()
            },
            {
              time: 179999,
              callback: () => this.gameStarted()
            }
          ]}
        >
          {({ start }) => (
            <React.Fragment>
              <div className='whiteTxt'>
                <Timer.Minutes formatValue={value => `${value} minutes `} />
                <Timer.Seconds /> seconds
              </div>
              <div>
                <button onClick={start}>Start</button>
              </div>
            </React.Fragment>
          )}
        </Timer>
      </div>   
    return timer
  }

  renderTyper = () => {
    let typer

    if (this.state.named) {
      typer =
        <div className='typerForm'>
          <form id='typer-form'>
            <input className='typerFormInput'
              onChange={this.handleChange}
              type='textarea'
              placeholder='Type Qwerty Quick!'
              name='typedAnswer'
              required/>
          </form>
          <div>
            <p className='whiteTxt tinyTxt'>While typing, pressing enter will reload the page (no need to press it)</p>
          </div>
        </div>
      }
    return typer
  }

  // Here I scrape random-word-api for a new api key,
  // then I call getWordsList to make the api call
  componentDidMount() {
    let that = this

    $.getJSON('https://whatever-origin.herokuapp.com/get?url=' + encodeURIComponent('https://random-word-api.herokuapp.com/key?') + '&callback=?', function (data) {
      that.setState({ apiKey: data.contents })
      that.getWordsList()
    })
  }

  render() {
    console.log('This is the state', this.state)
    if (this.state.gameOver) {
      return <div className='homePg whiteTxt'>
        <div className='gameOver1'>
          <p> Well done {this.state.userName}! Your Score is {this.state.score}</p>
        </div>
        <div className='gameOver2'>
          <p> Reload the page to play again!</p>
        </div>
      </div>
    } else {
      return (
        <div className='homePg'>
          <div className='whiteTxt title'>
            <p> Quick Qwerty</p>
          </div>
          {this.renderName()}
          {this.renderWord()}
          {this.renderTimer()}
          {this.renderTyper()}
        </div>
      )
    }
  }
}

export default Home
