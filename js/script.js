let memoryGame = document.getElementById('memory-game');
let startGame = document.getElementById('start-game-btn');
startGame.addEventListener('click' , startNewGame);

let timeWindow = document.getElementById('time');
let timeToCloseMes;
const cards = document.querySelectorAll('.Memory-Card');
cards.forEach(card => card.addEventListener('click', flipCard));
let disableCard = false;
const num_pairs_cards = 10; //number of pairs of cards in the game
let button_to_mes = document.getElementById('Continued'); //button of message 2
button_to_mes.addEventListener('click' , closeMessage);
let mes1 =  document.getElementById("message_1_cards_same");
let mes2 =  document.getElementById("message_2_cards_not_same");
let mes3 = document.getElementById("message_3_win_the_game");
let num_cards_matched; //number of 2 cards that matched
let arr_url_card = []; //Array of img from url
let firstCard, secondCard, item , urlPageImg, hasFlippedCard, lockBoard;
let firstPage = 'https://api.disneyapi.dev/characters';
urlPageImg = firstPage;
let firstStart = true, playAgain = false; 
let httpRequest;
let data;
var timeOfStart = "";
var timeOfWin = "";
var start = true;


//---------------------Functions----------------------------------------------


function loadImgByCallXjax(){
  let doLoadNewImgToCard = function(){
      if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200){
        item = JSON.parse(httpRequest.responseText);
        let randomPos;
        let histoty_randomPos = [];
        let i;
        for( i = 0 ; i < num_pairs_cards ; i ++){
            randomPos = Math.floor(Math.random() * 50);
            if(histoty_randomPos.includes(randomPos) || item.data[randomPos].imageUrl === undefined ){ //if the random_pos already exsits
                  i -= 1;
                  continue;
            } 
            histoty_randomPos[i] = randomPos;
            arr_url_card[i] = item.data[randomPos];
        }
        putImgInCards();  
      }
    };  
    getDataByXjax(urlPageImg, doLoadNewImgToCard);   
}



function startNewGame(){
  if(firstStart || playAgain ){
    getTime();
    hasFlippedCard = false;
    lockBoard = false;
    num_cards_matched = 0;
  }

  if(firstStart) {
    loadImgByCallXjax();
    memoryGame.style.display = 'flex';
    firstStart = false;
    playAgain = false;
  }

  else if(playAgain){
    startGame.innerHTML = 'Start Game';
    start = true;
    unFlipToAllCards();
    if(item.nextPage !== undefined || item.nextPage !== String())
        urlPageImg = item.nextPage;
    loadImgByCallXjax();
    playAgain = false;
    cards.forEach(card => card.addEventListener('click', flipCard));
  }
  else
      return;

}



function putImgInCards(){
  let frontCard;
  let j = 0 , n = 0;
  const arr2 = new Array(20);
  for(let i = 0 ; i < num_pairs_cards ; i ++ ){
     while(n < 2){
      frontCard = cards[j].querySelector('.front-card');
      frontCard.src = arr_url_card[i].imageUrl;
      n += 1;
      j++;
     }
     n = 0;
    }
}
 


function getTime(){
  var timeNow;
  var timeLink = document.createElement('a');
   $.ajax({
       url: 'php/get_current_time.php?t=' +new Date().getTime(),
       success: function(data)
       {
         if(start){
             console.log(start);
             timeNow = parseInt(data)*1000;
             timeOfStart = new Date(timeNow);
             start = false;
         }
         else{
             timeNow = parseInt(data)*1000;
             timeOfWin = new Date(timeNow);
         }
        }
       });
 }



function formatTime(){
        var timeDiff = Math.abs(timeOfWin - timeOfStart);
        var hours = Math.floor(timeDiff / 3600000);
        var minutes = Math.floor((timeDiff % 3600000) / 60000);
        var seconds = Math.floor((timeDiff % 60000) / 1000);
        console.log("Time difference: " + hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0'));
        return hours.toString().padStart(2, '0')+ ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
}
 

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}



function checkForMatch() {
  getTime();
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  let mes;
  let numberofcard;

  if (isMatch) {
      if (parseInt(firstCard.dataset.framework) % 2 === 0) {
        numberofcard = parseInt(firstCard.dataset.framework) / 2;
      } else {
        numberofcard = parseInt(secondCard.dataset.framework) / 2;
      }
      disableCards();
      num_cards_matched += 1;
      // Matched 2 cards
      if (mes !== null || mes !== undefined || num_cards_matched !== num_pairs_cards) {
          setTimeout(() => {
            mes1.style.display = "inline-block";
          }, 500);
          put_content_to_message_1(parseInt(numberofcard));
          setTimeout(() => {
            mes1.style.display = "none";
          },4000);
      }

      // If the user wins
      if (num_cards_matched == num_pairs_cards) {
          getTime();
          mes3.innerHTML = "Well done! You succeeded.<br> time that has passed:<br>" + formatTime(timeOfStart, timeOfWin);
          setTimeout(() => {
            mes3.style.display = "block";
          }, 2000);
          setTimeout(() => {
          mes3.style.display = "none";
          }, 6000);
          playAgain = true; // the user you can to click the start and play again 
          startGame.innerHTML = 'new Game';
      }
    } else {
      unflipCards();
      setTimeout(() => {
        mes1.style.display = "none";
        mes2.style.display = "block";
      }, 1500);
      setTimeout(() => {
        mes2.style.display = "none";
      },4500);
  }
}




function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}



function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 3000);
}

function unFlipToAllCards(){
  for(let i = 0 ; i < num_pairs_cards*2 ; i ++)
      cards[i].classList.remove('flip');
}



function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}



(function shuffle() {
   cards.forEach(card => {
     let randomPos = Math.floor(Math.random() * 12);
     card.style.order = randomPos;
   });
})();

function closeMessage(){
  mes2.style.display = "none";
}


function put_content_to_message_1( ind ){
  let FilmsThatAppeared = arr_url_card[ind].films;
  let Series = arr_url_card[ind].tvShows;
  let videoGames = arr_url_card[ind].videoGames;
  let attractions = arr_url_card[ind].parkAttractions;
  let text = "You did very well!<br>";
  text +="<br>Films that appeared: " + FilmsThatAppeared ;
  text += "<br>Series/series: " + Series ;
  text += "<br>Video Games: " + videoGames;
  text += "<br>attractions: " + attractions;
  
  mes1.innerHTML = text; 
  return;
}      



function getDataByXjax(url , doSomething){
  // create object
  httpRequest = new XMLHttpRequest();
  // assign callback function
  httpRequest.onreadystatechange = doSomething;
  // open a connection and send a request
  httpRequest.open('GET', url, true);
  httpRequest.send();
}

