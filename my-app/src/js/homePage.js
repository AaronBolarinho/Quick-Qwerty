import React, { Component } from 'react'
import '../css/App.css'
//
import Timer from 'react-compound-timer'
//
import axios from 'axios'


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      named: false,
      score: 0,
      typerWord: '',
      randomWord: ['(Name yourself first)'],
      gameOver: false,
      timerStarted: false
    }
  }

  // This handler runs after a user name is entered
  // it sets the state of the userName, and also makes
  // a fresh api call for a fresh set of words.

  enterName = (e) => {
    e.preventDefault()
    this.setState({ userName: e.target.name.value })
    this.setState({ named: true })

    axios.get('https://random-word-api.herokuapp.com/word?key=LQMAIY5W&number=500')
      .then(response => {
        const myVariable = response.data

        this.setState({ randomWord: myVariable })
        this.setState({ typerWord: this.state.randomWord[0] })
      })
      .catch(error => {
        console.log(error)
      })
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


  // this function handles the user's typing in the
  //typerForm
  handleChange = (e) => {
    e.preventDefault()

    let wordInProg = e.target.value
    let finalWord = wordInProg.toLowerCase()
    console.log('this word in prog', wordInProg)

    if (!this.state.timerStarted) {
      alert('Please start the timer :)')
    } else if (finalWord === this.state.typerWord) {
      console.log('matched!')
      this.state.score++
      this.setState({ typerWord: this.state.randomWord[this.state.score] })
      document.getElementById('typer-form').reset()
    }
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
        <p>Your First word is...{this.state.randomWord[0]}</p>
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
            <p className='whiteTxt'>Only hit enter to reset :P</p>
          </div>
        </div>
      }
    return typer
  }

  render() {
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
