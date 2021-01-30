import Cell from "./cell"
import Column from "./column"
import boomSound1 from "../sounds/fx-1.mp3"
import boomSound2 from "../sounds/fx-2.mp3"

const colors = {R: "#e74c3c", G: "#27ae60", B: "#3498db", O: "#f39c12"}

export default class Board {
    constructor(boardElm, scoreElm, msgElm) {
        this.boardElm = boardElm
        this.scoreElm = scoreElm
        this.msgElm = msgElm
        this.initColumnsCount = 8
        this.initRowsCount = 4
        this.gameOverRow = 13
        this.rowsCount = 0
        this.columns = []
        this.currentColor = null
        this.score = 0
        this.readyToBoomCounter = 0;

    }

    start() {
        this.msgElm.innerText = ''
        this.initializeCells()
        this.renderBoard()
        this.updateCellsPositions()
    }

    initializeCells() {
        for (let colIndex = 0; colIndex < this.initColumnsCount; colIndex++) {
            const newRow = this.generateNewRowColors();
            const col = new Column();
            for (let rowIndex = this.initRowsCount - 1; rowIndex >= 0; rowIndex--) {
                const cell = new Cell({col: colIndex, row: rowIndex}, newRow[rowIndex])
                col.addCell(cell)
            }
            this.columns.push(col)
        }
    }

    renderBoard() {
        this.boardElm.innerHTML = ""

        const boardHeight = Math.floor(window.innerHeight * .7)
        const dimension = Math.floor(boardHeight / this.gameOverRow)

        this.boardElm.style.setProperty("--dimension", dimension + "px")
        this.boardElm.style.width = (this.initColumnsCount * (dimension * 1.1)) + "px"
        this.boardElm.style.height = boardHeight + "px"


        for (let colIndex = 0; colIndex < this.columns.length; colIndex++) {
            const column = this.columns[colIndex]
            for (let rowIndex = column.cells.length - 1; rowIndex >= 0; rowIndex--) {
                const cell = column.getCell(rowIndex)
                cell.elm.addEventListener("click", this.cellClick.bind(this, cell))
                column.elm.append(cell.elm)
            }
            this.boardElm.appendChild(column.elm)
        }

        this.showScore()
    }

    updateCellsPositions() {
        this.rowsCount = 0

        this.columns.forEach((column, colIndex) => {
            column.cells.map((cell, rowIndex) => {
                cell.updatePosition({col: colIndex, row: rowIndex})
                return cell
            })

            if (column.cells.length > this.rowsCount) {
                this.rowsCount = column.cells.length

                if (this.rowsCount >= this.gameOverRow) {
                    this.gameover = true;
                    this.clearBoard()
                }
            }
        })
    }

    generateNewRowColors() {
        let newRow = new Array(this.initColumnsCount).fill("")
        return newRow.map(_ => {
            const rnd = Math.random()
            let c = colors.B
            if (rnd > 0.9)
                c = colors.G
            else if (rnd > .6)
                c = colors.G
            else if (rnd > .4)
                c = colors.R
            return c
        })
    }

    cellClick(target) {
        if (this.gameover || !target || target.readyToBoom) return;

        if (this.isSingleCell(target)) return;

        this.currentColor = target.color

        this.markRoundCell(target)

        this.removeMarkedRoundCells()

        this.calcScore()

        this.showScore()

        this.addNewCellsToColumns()

        this.updateCellsPositions()

        this.renderNewCells()
    }

    findCell(colIndex, rowIndex) {
        return this.columns[colIndex] && this.columns[colIndex].getCell(rowIndex)
    }

    markRoundCell(cell) {
        if (cell.readyToBoom) return

        cell.readyToBoom = true
        this.readyToBoomCounter++

        const {top, bottom, left, right} = this.findSibling(cell.col, cell.row)

        if (top && top.color === this.currentColor) {
            this.markRoundCell(top)
        }
        if (bottom && bottom.color === this.currentColor) {
            this.markRoundCell(bottom)
        }
        if (left && left.color === this.currentColor) {
            this.markRoundCell(left)
        }
        if (right && right.color === this.currentColor) {
            this.markRoundCell(right)
        }

    }

    isSingleCell(cell) {
        const {top, bottom, left, right} = this.findSibling(cell.col, cell.row)

        return (
            (!top || top.color !== cell.color) &&
            (!bottom || bottom.color !== cell.color) &&
            (!left || left.color !== cell.color) &&
            (!right || right.color !== cell.color)
        )
    }

    findSibling(col, row) {
        const top = this.findCell(col, row + 1)
        const bottom = this.findCell(col, row - 1)
        const left = this.findCell(col - 1, row)
        const right = this.findCell(col + 1, row)

        return {top, bottom, left, right}
    }

    removeMarkedRoundCells() {
        this.columns.forEach(column => column.boomCells())

        this.columns = this.columns.filter(column => {
            if (!column.cells.length)
                column.destroy()

            return column.cells.length
        })

        this.currentColor = null

        this.playFxSounds()
    }

    playFxSounds() {
        const chance = Math.random() > .5
        const fx = new Audio(chance ? boomSound1 : boomSound2)
        fx.play()
    }

    calcScore() {
        let scoreRate = 1
        if (this.readyToBoomCounter > 5) {
            scoreRate = 2
        } else if (this.readyToBoomCounter > 10) {
            scoreRate = 3
        } else if (this.readyToBoomCounter > 20) {
            scoreRate = 4
        } else if (this.readyToBoomCounter > 30) {
            scoreRate = 5
        }

        let score = this.readyToBoomCounter * scoreRate;

        this.score += score
        this.readyToBoomCounter = 0
    }

    showScore() {
        this.scoreElm.innerText = `SCORE: ${this.score}`
    }

    addNewCellsToColumns() {
        const newRow = this.generateNewRowColors();
        for (let colIndex = 0; colIndex < this.initColumnsCount; colIndex++) {
            if (!this.columns[colIndex]) {
                this.columns[colIndex] = new Column()
                this.boardElm.appendChild(this.columns[colIndex].elm)
            }

            const cell = new Cell({col: colIndex, row: 0}, newRow[colIndex])
            this.columns[colIndex].addCell(cell)
        }
    }

    renderNewCells() {
        for (let column of this.columns) {
            const newCell = column.getCell(0)
            newCell.elm.addEventListener("click", this.cellClick.bind(this, newCell))
            column.elm.append(newCell.elm)
        }
    }

    clearBoard() {
        this.columns.forEach(column => {
            column.cells.forEach(cell => cell.destroy())
            this.playFxSounds()
        })

        this.msgElm.innerText = `Game Over :( \nScore: ${this.score}`
        this.scoreElm.innerText = 'Next round starting...'
        this.columns = []
        this.gameover = false
        this.score = 0

        setTimeout(() => {
            this.start()
        }, 5000)
    }
}
