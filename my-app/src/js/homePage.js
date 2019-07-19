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
      randomWord: ['(Name yourself first)'],
      gameOver: false
    }
  }

  enterName = (e) => {
    e.preventDefault()
    this.setState({ userName: e.target.name.value })
    this.setState({ named: true })

    axios.get('https://random-word-api.herokuapp.com/word?key=LQMAIY5W&number=1000')
      .then(response => {
        const myVariable = response.data

        this.setState({ randomWord: myVariable })
        this.setState({ typerWord: this.state.randomWord[0] })
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderName = () => {
    let nameForm

    if (!this.state.named) {
      nameForm =
        <div>
          <form onSubmit={this.enterName}>
            <label>
              Name yourself Keyboard Warrior!
              <br></br>
              <input type='text' name='name' />
            </label>
            <br></br>
            <input type='submit' value='I am so named' />
          </form>
        </div>
    } else {
      nameForm = <div>
      <p>{this.state.userName}!!</p>
      {this.renderScore()}
    </div>
    }
      
      return nameForm
  }

  renderScore = () => {
    let score

    if(this.state.score === 0){ score = 
      <div>
      <p> Your Score is...</p>
      <p>Nothing Yet!</p>
    </div>

    } else { score =
      <div>
      <p> Your Score is...</p>
      <p>{this.state.score}</p>
    </div>
    }
      
      return score
  }

  renderWord = () => {
    let word

    if (this.state.named) {word =
      <div>
        <p>Press start and Go!</p>
        <p>Type it quick! --> {this.state.typerWord}</p>
      </div>
    } else { word =
      <div>
        <p>Your First word is...{this.state.randomWord[0]}</p>
      </div>
    }
      
      return word
  }

  renderTimer = () => {
    let timer =
      <div className='ClockTest'>
        <Timer
          initialTime={300000}
          startImmediately={false}
          direction='backward'
        >
          {({ start, resume, pause, stop, reset, timerState }) => (
            <React.Fragment>
              <div>
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

  handleChange = (e) => {
    e.preventDefault()
    console.log('this event is firing')
    let wordInProg = e.target.value
    let finalWord = wordInProg.toLowerCase()
    console.log('this word in prog', wordInProg)
    if (finalWord === this.state.typerWord) {
      console.log('matched!')
      this.state.score++
      this.setState({ typerWord: this.state.randomWord[this.state.score] })
      document.getElementById('typer-form').reset()
    }
    // if event.target.typedAnswer.
  }

  renderTyper = () => {
    let typer =
        <div>
          <form id="typer-form">
              <input onChange={this.handleChange}
              type='textarea'
              placeholder='Type Qwerty Quick!'
              name='typedAnswer'
              required/>
          </form>
          <div>
                <p>Only hit enter to reset :P</p>
              </div>
        </div>
      
      return typer
  }

  componentDidMount() {
  }

  render() {
    console.log('this is the state', this.state)
    return (
      <div>
        <div> 
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

export default Home
