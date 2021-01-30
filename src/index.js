import Board from "./libs/board"

const boardElm = document.getElementById("board")
const scoreElm = document.getElementById("score")
const msgElm = document.getElementById("msg")

const board = new Board(boardElm, scoreElm, msgElm);

board.start()
