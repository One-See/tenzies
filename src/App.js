import './App.css';

import React, {useState, useEffect} from 'react';

import {
  useWindowSize
} from '@react-hook/window-size'

import Confetti from 'react-confetti';

import Die from './Die'

function App() {

  const timer_handle = React.useRef(null)

  const [timer, setTimer] = useState(0);

  useEffect(() => {

    console.log('timer effect')

    if (timer > 0) {
      starTimer()
    }

    return () => clearTimeout(timer_handle)

  }, [timer])

  const starTimer = () => {
      timer_handle.current = setTimeout(() => {
        setTimer(prevTimer => prevTimer + 1)
      }, 1000)
  }


  const { width, height } = useWindowSize()

  const [roll, setRoll] = useState(0)
  const [viewStats, setStats] = useState(false)

  const handleDieClick = (event, index) => {
    console.log('handling Die click..', index)

    if (timer === 0) {
      starTimer()
    }

    
    setNewDice(prevDice => {
      const newDiceArray = []
      for (const dice of prevDice) {
        if (dice.index === index) {
          newDiceArray.push({...dice, set: !dice.set})
        } else {
          newDiceArray.push({...dice})
        }
      }
      return newDiceArray
    })

  }

  const checkGame = () => {

    let setValue

    for (const diceData of dice) {
      if (diceData.set === false) {
        return false
      } else {
        setValue = diceData.number
      }
    }

    for (const diceData of dice) {
      if (diceData.number !== setValue) {
        return false
      }
    }

    clearTimeout(timer_handle.current)

    setPersonalBest()

    return true

  }

  const setPersonalBest = () => {
    const personalBestScore = localStorage.getItem('personalBestScore')

    if (!personalBestScore) {
      localStorage.setItem('personalBestScore', ''+roll)
    } else if (personalBestScore > roll) {
      localStorage.setItem('personalBestScore', ''+roll)
    }

  }

  const getPersonalBestScore = () => localStorage.getItem('personalBestScore')

  const handleRoll = (event) => {
    console.log('handling roll..')

    setRoll(prevRoll => prevRoll + 1)

    setNewDice(prevDice => {
        const newDice = getRandomDice()

        for (let i = 0; i < 10; i++) {
          if (prevDice[i].set === true) {
            newDice[i] = {...prevDice[i]}
          }
        }

        return newDice

      }
    )
  }

  const getRandomDice = () => {
    const temp_dice_holder = []

    for (let i = 0; i < 10; i++) {
      temp_dice_holder.push(
        {
          index: i,
          number: Math.ceil(Math.random() * 6),
          set: false
        }
      )
    }

    return temp_dice_holder

  }

  const intializeNumArray = () => {

    const num_array = []


    for (let i = 0; i < dice.length; i++) {
      const temp_dice = dice[i]
      num_array.push(
        <Die key={i} number={temp_dice.number} index={i} set={temp_dice.set} handleDieClick={handleDieClick} />
      )
    }

    return num_array
  }


  const [dice, setNewDice] = useState(getRandomDice())

  useEffect(() => {
    console.log('running effect..')


  }, [dice])

  const handleGameReset = () => {
    setRoll(0)
    setStats(false)
    setTimer(0)
    setNewDice(getRandomDice())
  }

  const handleStats = () => {
    setStats(preStat => !preStat)
  }

  const getTime = () => {
    const minutes = Math.floor(timer / 60)
    const seconds = timer % 60

    let time_str = ''

    if (minutes > 9) {
      time_str += `${minutes}:`
    } else if (minutes <= 9) {
      time_str += `0${minutes}:`
    }

    if (seconds > 9) {
      time_str += `${seconds}`
    } else if (seconds <= 9) {
      time_str += `0${seconds}`
    }

    return time_str

  }

  const gameOver = checkGame()

  return (
    <div className="background">
      {gameOver && !viewStats && <Confetti width={width} height={height} />}
      <div className="board">
        {
          !viewStats ? 
              <div className="playarea">
                <h1>Tenzies</h1>
                <p>Roll until all dice are the same. Click each die to freeze it as its current value between rolls.</p>
                <div className="numbers">
                  <div className="number-box">
                    {intializeNumArray()}
                  </div>
                </div>
                <div className="roll">
                  {(gameOver ? (<>
                  <button onClick={handleGameReset}>New Game</button>
                  <button onClick={handleStats}>View Stats</button>
                  </>) : 
                  <button onClick={handleRoll}>Roll</button>)}
                </div>
              </div>
          :
            <div className="playarea">
              <h1>Stats</h1>
              <p>Number of Rolls: {roll}</p>
              <p>Time taken to finish: {getTime()}</p>
              <p>Personal best Rolls: {getPersonalBestScore()}</p>
              <div className="roll">
                <button onClick={handleGameReset}>New Game</button>
              </div>
            </div>

        }
      </div>
    </div>
  );
}

export default App;
