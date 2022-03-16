import './style.css'

const solution = [
  [3, 1, 6, 5, 7, 8, 4, 9, 2], 
  [5, 2, 9, 1, 3, 4, 7, 6, 8],
  [4, 8, 7, 6, 2, 9, 5, 3, 1],
  [2, 6, 3, 4, 1, 5, 9, 8, 7], 
  [9, 7, 4, 8, 6, 3, 1, 2, 5],
  [8, 5, 1, 7, 9, 2, 6, 4, 3],
  [1, 3, 8, 9, 4, 7, 2, 5, 6], 
  [6, 9, 2, 3, 5, 1, 8, 7, 4],
  [7, 4, 5, 2, 8, 6, 3, 1, 9], 
]

const hints = [ 
  [3, 0, 6, 5, 0, 8, 4, 0, 0], 
  [5, 2, 0, 0, 0, 0, 0, 0, 0], 
  [0, 8, 7, 0, 0, 0, 0, 3, 1], 
  [0, 0, 3, 0, 1, 0, 0, 8, 0], 
  [9, 0, 0, 8, 6, 3, 0, 0, 5], 
  [0, 5, 0, 0, 9, 0, 6, 0, 0], 
  [1, 3, 0, 0, 0, 0, 2, 5, 0], 
  [0, 0, 0, 0, 0, 0, 0, 7, 4], 
  [0, 0, 5, 2, 0, 6, 3, 0, 0]
]

const playerNumbers = [ 
  [0, 1, 0, 0, 7, 0, 0, 9, 2], 
  [0, 0, 9, 1, 3, 4, 7, 6, 8], 
  [4, 0, 0, 6, 2, 9, 5, 0, 0], 
  [2, 6, 0, 4, 0, 5, 0, 0, 0], 
  [0, 7, 4, 0, 0, 0, 0, 0, 0], 
  [8, 0, 1, 7, 0, 2, 0, 4, 3], 
  [0, 0, 8, 9, 4, 7, 0, 0, 6], 
  [6, 9, 2, 3, 5, 1, 8, 0, 0], 
  [7, 4, 0, 0, 8, 0, 0, 1, 9]
]

const currentNumbers = [ 
  [0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const buttons = document.querySelector('[data-buttons]')
const deleteButton = document.querySelector('[data-delete-button]')
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const windowSize = window.innerWidth / 2
const squareSize = windowSize / 9

canvas.height = windowSize
canvas.width = windowSize

const canvasPosition = canvas.getBoundingClientRect()

let endGame = false
let selectedTileX, selectedTileY

buttons.addEventListener('click', handleNumberClick)
canvas.addEventListener('mousemove', handleMovement)
canvas.addEventListener('mouseout', handleMouseOut)
canvas.addEventListener('click', handleClick)

function handleMouseOut() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawLines()
}

function handleClick(event) {
  const mouseX = event.clientX - canvasPosition.left
  const mouseY = event.clientY - canvasPosition.top
  selectedTileY = Math.floor(mouseY / squareSize)
  selectedTileX = Math.floor(mouseX / squareSize)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLines()
}

function handleMovement(event) {
  const mouseX = event.clientX - canvasPosition.left
  const mouseY = event.clientY - canvasPosition.top
  const currentSquareY = Math.floor(mouseY / squareSize)
  const currentSquareX = Math.floor(mouseX / squareSize)
  ctx.fillStyle = "#ddd";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(squareSize * currentSquareX, squareSize * currentSquareY, squareSize, squareSize)
  drawLines()
}

function drawHints() {
  ctx.fillStyle = "#494949"
  ctx.font = "2rem Arial"
  ctx.textAlign = "center"
  for(let row in hints) {
    for(let number in hints[row]) {
      let nextNumber = hints[row][number]
      if(nextNumber == 0) nextNumber = ''
      ctx.fillText(nextNumber, squareSize * number + squareSize / 2, squareSize * row + squareSize / 1.5)
    }
  }
}

function drawPlayerNumbers() {
  ctx.font = "2rem Arial"
  ctx.textAlign = "center"
  for(let row in playerNumbers) {
    for(let number in playerNumbers[row]) {
      let nextNumber = playerNumbers[row][number]
      if(nextNumber == 0) nextNumber = ''
      ctx.fillStyle = '#396cfa'
      if(playerNumbers[row][number] != solution[row][number]) ctx.fillStyle = 'red'
      ctx.fillText(nextNumber, squareSize * number + squareSize / 2, squareSize * row + squareSize / 1.5)
    }
  }
}

function handleNumberClick(event) {
  if(event.target.tagName != 'BUTTON') return
  const pressedNumber = event.target.value
  if(hints[selectedTileY][selectedTileX] != 0) return
  playerNumbers[selectedTileY][selectedTileX] = pressedNumber
  for(let i = 0; i < hints.length; i++) {
    for(let j = 0; j < hints.length; j++) {
      currentNumbers[i][j] = (hints[i][j] + playerNumbers[i][j])
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawLines()
  verifyWin()
}

function arrayEquals(firstArray, secondArray) {
  for(let i = 0; i < firstArray.length; i++) {
    for(let j = 0; j < firstArray[i].length; j++) {
      if(firstArray[i][j] != secondArray[i][j]) return false
    }
  }

  return true
}

function verifyWin() {
  if(arrayEquals(solution, currentNumbers)) endGame = true
  console.log(endGame)
  if(endGame) alert('Ganaste!')
}

verifyWin()

drawHints()

function drawLines() {

  drawPlayerNumbers()
  drawHints()

  ctx.strokeStyle = "#aaa"

  for(let row = 1; row < 9; row++) {
    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.moveTo(squareSize * row, 0)
    ctx.lineTo(squareSize * row, windowSize)
    ctx.stroke()
  }
  
  for(let column = 1; column < 9; column++) {
    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.moveTo(0, squareSize * column)
    ctx.lineTo(windowSize, squareSize * column)
    ctx.stroke()
  }
  
  ctx.fillStyle = "#3d6ae625"
  ctx.strokeStyle = "#3d6ae620"

  ctx.beginPath()
  ctx.rect(squareSize * selectedTileX, squareSize * selectedTileY, squareSize, squareSize)
  ctx.fillRect(squareSize * selectedTileX, squareSize * selectedTileY, squareSize, squareSize)
  ctx.stroke()

  ctx.strokeStyle = "#777"

  for(let column = 1; column <= 2; column++) {
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.moveTo(0, squareSize * 3 * column)
    ctx.lineTo(windowSize, squareSize * 3 * column)
    ctx.stroke()
  }
  
  for(let row = 1; row <= 2; row++) {
    ctx.beginPath()
    ctx.lineWidth = 3;
    ctx.moveTo(squareSize * row * 3, 0)
    ctx.lineTo(squareSize * row * 3, windowSize)
    ctx.stroke()
  }
}

drawLines()