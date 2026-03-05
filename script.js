$(document).ready(function(){

let symbols = ["🦇","🕯","🕸","⚰","🔮","🦉","🗡","👁"]

let board = $("#gameBoard")

let firstCard = null
let secondCard = null

let lockBoard = false

let moves = 0
let matchedPairs = 0

let timer = 0
let interval = null

function startTimer(){

interval = setInterval(function(){

timer++
$("#timer").text(timer)

},1000)

}

function shuffle(array){

return array.sort(function(){
return 0.5 - Math.random()
})

}

function createBoard(pairCount){

board.empty()

matchedPairs = 0
moves = 0
timer = 0

$("#moves").text(moves)
$("#timer").text(timer)

clearInterval(interval)

let selectedSymbols = symbols.slice(0, pairCount/2)

let cards = selectedSymbols.concat(selectedSymbols)

cards = shuffle(cards)

cards.forEach(function(symbol){

let card = $(`
<div class="card">
<div class="front"></div>
<div class="back">${symbol}</div>
</div>
`)

card.attr("data-symbol", symbol)

board.append(card)

})

}

$("#gameBoard").on("click",".card",function(){

if(lockBoard) return

if($(this).hasClass("flip")) return

if(moves === 0 && timer === 0) startTimer()

$(this).addClass("flip")

if(!firstCard){

firstCard = $(this)
return

}

secondCard = $(this)

moves++
$("#moves").text(moves)

checkMatch()

})

function checkMatch(){

let symbol1 = firstCard.data("symbol")
let symbol2 = secondCard.data("symbol")

if(symbol1 === symbol2){

if($("#matchSound")[0]) $("#matchSound")[0].play()

matchedPairs++

resetCards()

let totalPairs = $("#difficulty").val()/2

if(matchedPairs == totalPairs){

clearInterval(interval)

$("#winMessage").fadeIn()

}

}

else{

if($("#wrongSound")[0]) $("#wrongSound")[0].play()

lockBoard = true

setTimeout(function(){

firstCard.removeClass("flip")
secondCard.removeClass("flip")

resetCards()

},1000)

}

}

function resetCards(){

firstCard = null
secondCard = null

lockBoard = false

}

$("#restart").click(function(){

$("#winMessage").hide()

let pairs = parseInt($("#difficulty").val())

createBoard(pairs)

})

createBoard(8)

})