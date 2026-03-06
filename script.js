$(document).ready(function(){

let symbols = [
  "1.jpeg", "2.jpg", "3.jpg", "4.jpg",
  "5.jpg", "6.jpg", "7.jpg", "8.jpg",
  "9.jpg", "10.jpg", "11.jpg", "12.jpg",
  "13.jpg", "14.jpg", "15.jpg"
];

let board = $("#gameBoard");
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer = 0;
let interval = null;

// ---------------- TIMER ----------------
function startTimer() {
    stopTimer(); // ensure no duplicate intervals
    timer = 0;
    $("#timer").text(timer);
    interval = setInterval(function(){
        timer++;
        $("#timer").text(timer);
    }, 1000);
}

function stopTimer() {
    if(interval) {
        clearInterval(interval);
        interval = null;
    }
}

// ---------------- SHUFFLE ----------------
function shuffle(array){
    return array.sort(() => 0.5 - Math.random());
}

// ---------------- CREATE BOARD ----------------
function createBoard(pairCount){
    board.empty();
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    $("#moves").text(moves);
    $("#timer").text(timer);
    stopTimer();

    let selectedSymbols = symbols.slice(0, pairCount);
    let cards = selectedSymbols.concat(selectedSymbols);
    cards = shuffle(cards);

    cards.forEach(function(symbol){
        let card = $(`
            <div class="card">
                <div class="front"></div>
                <div class="back"><img src="${symbol}" /></div>
            </div>
        `);
        card.attr("data-symbol", symbol);
        board.append(card);
    });
}

// ---------------- CLICK LOGIC ----------------
$("#gameBoard").on("click", ".card", function(){
    if(lockBoard) return;
    if($(this).hasClass("flip")) return;

    // start timer only if not running
    if(!interval) startTimer();

    $(this).addClass("flip");

    if(!firstCard){
        firstCard = $(this);
        return;
    }

    secondCard = $(this);
    moves++;
    $("#moves").text(moves);
    checkMatch();
});

// ---------------- CHECK MATCH ----------------
function checkMatch(){
    let symbol1 = firstCard.data("symbol");
    let symbol2 = secondCard.data("symbol");

    if(symbol1 === symbol2){
        if($("#matchSound")[0]) $("#matchSound")[0].play();
        matchedPairs++;
        resetCards();

        if(matchedPairs == parseInt($("#difficulty").val())){
            stopTimer();
            $("#winMessage").fadeIn();
        }
    } else {
        if($("#wrongSound")[0]) $("#wrongSound")[0].play();
        lockBoard = true;
        setTimeout(function(){
            firstCard.removeClass("flip");
            secondCard.removeClass("flip");
            resetCards();
        },1000);
    }
}

// ---------------- RESET CARDS ----------------
function resetCards(){
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// ---------------- RESTART ----------------
$("#restart").click(function(){
    $("#winMessage").hide();
    createBoard(parseInt($("#difficulty").val()));
});

// ---------------- DIFFICULTY CHANGE ----------------
$("#difficulty").change(function(){
    $("#winMessage").hide();
    createBoard(parseInt($(this).val()));
});

// ---------------- INITIALIZE ----------------
createBoard(parseInt($("#difficulty").val()));

});

$("#restart, #difficulty").click(function(){
    $("#winMessage").hide();
    stopTimer(); // stop previous timer
    timer = 0;
    $("#timer").text(timer);
    createBoard(parseInt($("#difficulty").val()));
});
