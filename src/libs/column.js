export default class Column {
    constructor() {
        this.cells = []

        this.createElm()
    }

    createElm() {
        this.elm = document.createElement("div")
        this.elm.className = "column"
    }

    addCell(cell) {
        this.cells.unshift(cell)
    }

    boomCells() {
        this.cells = this.cells.filter(cell => {
            if (cell.readyToBoom)
                cell.destroy()
            return !cell.readyToBoom
        })
    }

    getCell(cellIndex) {
        return this.cells[cellIndex]
    }

    destroy() {
        this.elm.remove()
    }
}
