import './App.css';

import React, {useState, useEffect} from 'react';

import Die from './Die'

function App() {

  const [selectedNumber, setSelectedNumber] = useState(null)

  const handleDieClick = (event, index) => {
    console.log('handling Die click..', index)

    
    setNewDice(prevDice => {
      const newDiceArray = []
      for (const dice of prevDice) {
        if (dice.index === index) {
          if (selectedNumber === null) {
            setSelectedNumber(dice.number)
            dice.set = true
          } else if (selectedNumber === dice.number) {
            dice.set = true
          }
        }
        newDiceArray.push(dice)
      }
      return newDiceArray
    })

  }

  const checkGame = () => {
    for (const diceData of dice) {
      if (diceData.set === false) {
        return false
      }
    }

    return true

  }

  const handleRoll = (event) => {
    console.log('handling roll..')
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
    setSelectedNumber(null)
    setNewDice(getRandomDice())
  }

  const gameOver = checkGame()

  return (
    <div className="background">
      <div className="board">
        <div className="playarea">
          <h1>Tenzies</h1>
          <p>Roll until all dice are the same. Click each die to freeze it as its current value between rolls.</p>
          <div className="numbers">
            <div className="number-box">
              {intializeNumArray()}
            </div>
          </div>
          <div className="roll">
            {(gameOver ? <button onClick={handleGameReset}>Reset Game</button> : <button onClick={handleRoll}>Roll</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
