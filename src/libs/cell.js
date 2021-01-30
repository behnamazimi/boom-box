export default class Cell {
    constructor(position, color) {
        this.color = color
        this._readyToBoom = false

        this.createElm()

        this.updatePosition({col: position.col, row: position.row})
    }

    set readyToBoom(state) {
        this._readyToBoom = state
    }

    get readyToBoom() {
        return this._readyToBoom
    }

    updatePosition({col, row}) {
        if (col !== void 0) this.col = col;
        if (row !== void 0) this.row = row;

        this.elm.style.setProperty("--col", col)
        this.elm.style.setProperty("--row", row)
    }

    createElm() {
        this.elm = document.createElement("button")
        this.elm.className = "cell"
        this.elm.style.backgroundColor = this.color
        this.elm.setAttribute("data-pos", `${this.col}-${this.row}`)
    }

    destroy() {
        this.elm.classList.add("boom")
        setTimeout(() => {
            this.elm.remove()
        }, 200)
    }
}
