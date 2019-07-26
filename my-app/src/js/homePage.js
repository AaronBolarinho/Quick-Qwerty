import React, { Component } from 'react'
//
import '../css/AppNew.css'
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
//
import { Form } from 'react-bootstrap'
//
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
//
import 'react-tabs/style/react-tabs.css'


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      named: false,
      timeChosen: 0,
      score: 0,
      typerWord: '',
      randomWord: '',
      gameOver: false,
      pointsTimer: 0,
      apiKey: '',
      timerPoints: 0,
      matched: false,
      leaderBoard: '',
      key: 1
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

  // This function starts the game
  gameStarted = () => {
    this.pointsTimer()
  }

  // This function ends the game and displays the final
  // html
  gameOver = () => {
    // This updates my json store with the user's
    // game result
    this.sendFinalScore()

    // This updates the state with the new leaderBoard
    axios.get(`https://api.myjson.com/bins/9285t`)
      .then(response => {
        const myVariable = response.data
        this.setState({ leaderBoard: myVariable })
        this.setState({ gameOver: true })
      })
      .catch(error => {
        console.log(error)
      })
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
      document.getElementById('inputBox').value = ''
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

  // This function sends the final score to the json
  // storage api
  sendFinalScore = () => {
    let userName = this.state.userName
    let score = this.state.score
    let finalScore =
      { name: userName,
        score: score
      }
    let OneMinuteSliced = this.state.leaderBoard.OneMinute.slice(0, 7)
    let ThreeMinutesSliced = this.state.leaderBoard.ThreeMinutes.slice(0, 7)
    let FiveMinutesSliced = this.state.leaderBoard.FiveMinutes.slice(0, 7)

    console.log('is the time really chosen?', this.state.timeChosen)

    if (this.state.timeChosen === '60000') {
      OneMinuteSliced.push(finalScore)
    } else if (this.state.timeChosen === '180000') {
      ThreeMinutesSliced.push(finalScore)
    } else if (this.state.timeChosen === '300000') {
      FiveMinutesSliced.push(finalScore)
    } else {
      console.log('this basic test ran')
    }

    let finalLeaderboard = { OneMinute: OneMinuteSliced,
      ThreeMinutes: ThreeMinutesSliced,
      FiveMinutes: FiveMinutesSliced
    }

    console.log(finalLeaderboard)

    $.ajax({
      url: 'https://api.myjson.com/bins/9285t',
      type: 'PUT',
      data: JSON.stringify(finalLeaderboard),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
      }
    })
  }

  // This function changes the active tabs on click
  handleSelect = (key) => {
    console.log('selected' + key)
    this.setState({ key: key })
  }

  // This function records the user's choice of time
  setUserTime = (event) => {
    let userTime = event.target.value
    this.setState({ timeChosen: userTime })
  }

  // These functions conditionally render most of my html:
  // renderName, renderScore, renderWord, renderTimer, and renderTyper, renderTyperMsg
  renderName = () => {
    let nameForm

    if (!this.state.named && !this.state.timeChosen) {
      nameForm =
      <div className='col-12 centerText startingForm animated jackInTheBox'>
        <form onSubmit={this.enterName}>
          <label>
            Name Thyself...Keyboard Warrior!
            <br></br>
            <input type='text' name='name' required/>
          </label>
          <br></br>
          <input type='submit' value='I am so named' />
        </form>
        {this.renderLeaderboard()}
      </div>
    } else if (this.state.named && !this.state.timeChosen) {
      nameForm =
      <div className='col-12 centerText startingForm'>
        {this.renderChooseTime()}
        {this.renderLeaderboard()}
      </div>
    } else {
      nameForm =
        <div className='userName centerText'>
          <p>{this.state.userName}!!</p>
          {this.renderScore()}
        </div>
    }
    return nameForm
  }

  renderScore = () => {
    let score

    if (this.state.score === 0) {
      score =
      <div>
        <p> Your Score is...</p>
        <p>Nothing Yet!</p>
      </div>
    } else {
      score =
      <div>
        <p> Your Score is...</p>
        <p>{this.state.score}</p>
      </div>
    }   
    return score
  }

  renderWord = () => {
    let word
    let rightArrow = `<==`
    let LeftArrow = `==>`

    if (this.state.timeChosen) {
      word =
      <div>
        <div className='centerText'>
          <span>Type it quick!{LeftArrow} </span>
          <span className='challengeWord titleFont'>{this.state.typerWord}</span>
          <span> {rightArrow} Type it quick! </span>
        </div>
      </div>
    } else {
      word =
      <div className='visBackground'>
        <div className='col-12 centerText titleFont startingLabel'>
          <p>Quick Qwerty is a speed typing game...</p>
          <p>Enter your name, and take the challenge!</p>
        </div>
      </div>
    }  
    return word
  }

  renderTimer = () => {
    let timer

    if (this.state.timeChosen) {
      let gameStart = this.state.timeChosen -1

      timer =
      <div className='visBackground'>
        <div className='clock centerText titleFont'>
          <Timer
            id='deliveryForm'
            initialTime={this.state.timeChosen}
            direction='backward'
            checkpoints={[
              {
                time: 5,
                callback: () => this.gameOver()
              },
              {
                time: gameStart,
                callback: () => this.gameStarted()
              }
            ]}
          >
            {({ start }) => (
              <React.Fragment>
                <div>
                  <Timer.Minutes formatValue={value => `${value} minutes `} />
                  <Timer.Seconds /> seconds
                </div>
              </React.Fragment>
            )}
          </Timer>
        </div>
      </div>
    }
    return timer
  }

  renderTyper = () => {
    let typer

    if (this.state.timeChosen) {
      typer =
        <div className='centerText challengeForm'>
          <input
            id='inputBox'
            onChange={this.handleChange}
            type='textarea'
            placeholder='Type Qwerty Quick!'
            name='typedAnswer'
            required/>
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

    // This series of if statements sets the success
    // message based on how fast the word is typed
    if (this.state.pointsTimer === 1) {
      msg =
        <div className='successWord centerText animated bounceIn'>
          <p>Amazing!</p>
        </div>
    } else if (this.state.pointsTimer === 2) {
      msg =
        <div className='successWord centerText animated jello'>
          <p>Saaweeet</p>
        </div>
    } else if (this.state.pointsTimer === 3) {
      msg =
        <div className='successWord centerText animated tada'>
          <p>Noice</p>
        </div>
    } else if (this.state.pointsTimer === 4) {
      msg =
        <div className='successWord centerText animated rubberBand'>
          <p>Not bad, Not bad</p>
        </div>
    } else if (this.state.pointsTimer === 5) {
      msg =
        <div className='successWord centerText animated flash'>
          <p>Keep going!</p>
        </div>
    } else if (this.state.pointsTimer >= 6) {
      msg =
        <div className='successWord centerText animated shake'>
          <p>the timer IS ticking you know....</p>
        </div>
    } else if (this.state.timeChosen) {
      msg =
        <div className='successWord centerText animated slideInLeft'>
          <p className=''>go go Go!!</p>
        </div>
    }
    return msg
  }

  renderGameOver = () => {
    let gameOver =
      <div className='centerText endingForm'>
        <div className='centerText endingMsg1'>
          <p> Well done {this.state.userName}! Your Score is {this.state.score}</p>
        </div>
        <div>
          {this.renderLeaderboard()}
        </div>
        <div className='centerText endingMsg2'>
          <p> Reload the page to play again!</p>
        </div>
      </div>

    return gameOver
  }

  renderLeaderboard = () => {
    if (this.state.leaderBoard) {
      let OneMinute = this.state.leaderBoard.OneMinute
      let ThreeMinutes = this.state.leaderBoard.ThreeMinutes
      let FiveMinutes = this.state.leaderBoard.FiveMinutes

      // function for dynamic sorting
      let compareValues = (key, order = 'asc') => {
        return function (a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0
          }

          const varA = (typeof a[key] === 'string') ?
            a[key].toUpperCase() : a[key]
          const varB = (typeof b[key] === 'string') ?
            b[key].toUpperCase() : b[key]

          let comparison = 0
          if (varA > varB) {
            comparison = 1
          } else if (varA < varB) {
            comparison = -1
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          )
        }
      }

      let OneMinuteSorted = OneMinute.sort(compareValues('score', 'desc'))
      let ThreeMinutesSorted = ThreeMinutes.sort(compareValues('score', 'desc'))
      let FiveMinutesSorted = FiveMinutes.sort(compareValues('score', 'desc'))

      let OneMinuteSliced = OneMinuteSorted.slice(0, 6)
      let ThreeMinutesSliced = ThreeMinutesSorted.slice(0, 6)
      let FiveMinutesSliced = FiveMinutesSorted.slice(0, 6)

      let leaderBoard =
      <Tabs>
        <TabList>
          <Tab>1 Min</Tab>
          <Tab>3 Min</Tab>
          <Tab>5 Min</Tab>
        </TabList>

        <TabPanel>
          <div>
            <table align='center'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {OneMinuteSliced.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{item.name}</td>
                      <td>{item.score}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <table align='center'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {ThreeMinutesSliced.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{item.name}</td>
                      <td>{item.score}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <table align='center'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {FiveMinutesSliced.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{item.name}</td>
                      <td>{item.score}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabPanel>
      </Tabs>

      return leaderBoard
    }
    return <p></p>
  }

  renderChooseTime = () => {
    let chooseTime =
      <div className='chooseTimeForm'>
        <Form onChange={this.setUserTime}>
          <Form.Group controlId='exampleForm.ControlSelect1'>
            <Form.Control as='select'>
              <option>Choose your time</option>
              <option value='60000'>1 Minute</option>
              <option value='180000'>3 Minutes</option>
              <option value='300000'>5 Minutes</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </div>

    return chooseTime
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

    axios.get(`https://api.myjson.com/bins/9285t`)
      .then(response => {
        const myVariable = response.data
        this.setState({ leaderBoard: myVariable })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    // console.log('This is the state', this.state)
    if (this.state.gameOver) {
      return (
        <div className='pageBackground'>
          <div className='d-flex container bodyFont'>
            {this.renderGameOver()}
          </div>
        </div>
      )
    } else {
      return (
        <div className='pageBackground'>
          <div className='d-flex container bodyFont'>
            <div className='col-12 centerText titleFont title animated zoomIn'>
              <p> Quick Qwerty</p>
            </div>
            {this.renderName()}
            {this.renderTyperMsg()}
            {this.renderWord()}
            {this.renderTyper()}
            {this.renderTimer()}
          </div>
        </div>
      )
    }
  }
}

export default Home
