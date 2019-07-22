import React, { Component } from 'react'
import '../css/App.css'
//
import Timer from 'react-compound-timer'
//
import axios from 'axios'
//
import $ from 'jquery'
//
// This was added as a failsafe in case
// the random word API server went down.
// It is explained a little more below.
import randomWords from 'random-words'


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
      apiKey: '',
      timerPoints: 0,
      matched: false
    }
  }

  // This function runs after a user name is entered
  // it sets the state of the userName

  enterName = (e) => {
    e.preventDefault()
    this.setState({ userName: e.target.name.value })
    this.setState({ named: true })
  }

  // This function times how long it takes a user
  // to type the current given word. the value it adds
  // to this.state.timerPoints is then used to help
  // display both a dynamic message on word complete and
  // calculate a score based on how fast the word was typed

  pointsTimer = () => {
    let addPoint = () => {
      this.setState(prevState => {
        return { timerPoints: prevState.timerPoints + 1 }
      })
    }
    setInterval(addPoint, 1000)
  }

  // This function starts the game and allows unimpeded
  // typing in the typer form
  gameStarted = () => {
    this.setState({ timerStarted: true })
    this.pointsTimer()
  }

  // This function ends the game and displays the final
  // html
  gameOver = () => {
    this.setState({ gameOver: true })
  }

  // This function handles the user's typing in the
  // typerForm
  handleChange = (e) => {
    e.preventDefault()

    let wordInProg = e.target.value
    let finalWord = wordInProg.toLowerCase()

    if (finalWord === this.state.typerWord) {
      this.setState({ matched: true })

      let currentSpeed = this.state.timerPoints

      this.renderTyperMsg(currentSpeed)

      this.setState({ timerPoints: 0 })

      let randomNum = Math.floor((Math.random() * 1000) + 1)
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

  // These functions conditionally render most of my html:
  // renderName, renderScore, renderWord, renderTimer, and renderTyper, renderTyperMsg
  renderName = () => {
    let nameForm

    if (!this.state.named) {
      nameForm =
        <div className='nameForm'>
          <form onSubmit={this.enterName}>
            <label className='whiteTxt'>
              Name Thyself...Keyboard Warrior!
              <br></br>
              <input type='text' name='name' required/>
            </label>
            <br></br>
            <input type='submit' value='I am so named' />
          </form>
        </div>
    } else {
      nameForm =
      <div className='nameForm2'>
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
      <div className='whiteTxt'>
        <p> Your Score is...</p>
        <p>Nothing Yet!</p>
      </div>
    } else {
      score =
      <div className='whiteTxt'>
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
        <div className='whiteTxt randomWord2'>
          <span>Type it quick! --> </span>
          <span className='typerWord'>{this.state.typerWord}</span>
        </div>
      </div>
    } else {
      word =
      <div className='whiteTxt randomWord'>
        <p>Your First word is...(Name yourself first)</p>
      </div>
    }  
    return word
  }

  renderTimer = () => {
    let timer

    if (this.state.named) {
      timer =
      <div className='clock'>
        <Timer
          id='deliveryForm'
          initialTime={180000}
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
            </React.Fragment>
          )}
        </Timer>
      </div>
    }
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

  renderTyperMsg = (points) => {
    let msg
    let typerPoints = points

    if (typerPoints > 0) {
      this.setState({ pointsTimer: typerPoints })
    }

    // This series of if statements sets the user's
    // score based on how fast the word is typed
    if (typerPoints === 1) {
      this.setState(prevState => {
        return { score: prevState.score + 10 }
      })
    } else if (typerPoints === 2) {
      this.setState(prevState => {
        return { score: prevState.score + 8 }
      })
    } else if (typerPoints === 3) {
      this.setState(prevState => {
        return { score: prevState.score + 6 }
      })
    } else if (typerPoints === 4) {
      this.setState(prevState => {
        return { score: prevState.score + 4 }
      })
    } else if (typerPoints === 5) {
      this.setState(prevState => {
        return { score: prevState.score + 2 }
      })
    } else if (typerPoints >= 6) {
      this.setState(prevState => {
        return { score: prevState.score + 1 }
      })
    }

    // This series of if statements sets the completion
    // mesage based on how fast the word is typed
    if (this.state.pointsTimer === 1) {
      msg =
        <div className='whiteTxt randomWord3'>
          <p>Amazing!</p>
        </div>
    } else if (this.state.pointsTimer === 2) {
      msg =
        <div className='whiteTxt randomWord3'>
          <p>Saaweeet</p>
        </div>
    } else if (this.state.pointsTimer === 3) {
      msg =
        <div className='whiteTxt randomWord3'>
          <p>Noice</p>
        </div>
    } else if (this.state.pointsTimer === 4) {
      msg =
        <div className='whiteTxt randomWord3'>
          <p>Not bad, Not bad</p>
        </div>
    } else if (this.state.pointsTimer === 5) {
      msg =
        <div className='whiteTxt randomWord3'>
          <p>Keep going!</p>
        </div>
    } else if (this.state.pointsTimer >= 6) {
      msg =
        <div className='whiteTxt randomWord3'>
          <p>the timer IS ticking you know....</p>
        </div>
    } else if (this.state.named) {
      msg =
        <div className='whiteTxt randomWord3'>
          <p>go go Go!!</p>
        </div>
    }
    return msg
  }

  // Here I scrape random-word-api for a new api key,
  // then I call getWordsList to make the api call
  componentDidMount() {
    let that = this

    $.getJSON('https://whatever-origin.herokuapp.com/get?url=' + encodeURIComponent('https://random-word-api.herokuapp.com/key?') + '&callback=?', function (data) {
      that.setState({ apiKey: data.contents })

      // this if statement was created in case random word
      // api server goes down. If the server is down, the app
      // uses its own internal random word npm package.
      // If the api site is live, it will use it!

      if (that.state.apiKey.length === 291) {
        let randomNum = Math.floor((Math.random() * 1000) + 1)
        let myRandomWords = randomWords(1000)
        that.setState({ randomWord: myRandomWords })
        that.setState({ typerWord: that.state.randomWord[randomNum] })
      } else {
        that.getWordsList()
      }
    })
  }

  render() {
    // console.log('This is the state', this.state)
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
          {this.renderTyperMsg()}
          {this.renderWord()}
          {this.renderTimer()}
          {this.renderTyper()}
        </div>
      )
    }
  }
}

export default Home
