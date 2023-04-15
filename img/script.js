let memoryGame = document.getElementById('memory-game');
let startGame = document.getElementById('start-game-btn');
startGame.addEventListener('click' , startNewGame);

let timeWindow = document.getElementById('time');
let timeToCloseMes;

const cards = document.querySelectorAll('.Memory-Card');
cards.forEach(card => card.addEventListener('click', flipCard));

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



//-------------------XJAX--------------------------------------------------


function loadImgByCallXjax(){
  let doLoadNewImgToCard = function(){
      if(httpRequest.readyState == XMLHttpRequest.DONE && httpRequest.status == 200){
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
        //console.log("the arr random: " + histoty_randomPos);
        putImgInCards();  
      }
    };  
    getDataByXjax(urlPageImg, doLoadNewImgToCard);   
}

//---------------------Functions----------------------------------------------

function startNewGame(){
  //getTime();

  if(firstStart || playAgain ){
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
    unFlipToAllCards();
    if(item.nextPage !== undefined || item.nextPage !== String())
        urlPageImg = item.nextPage;
    loadImgByCallXjax();
    playAgain = false;
  }
  else
      return;

}



function putImgInCards(){
  // for(let i = 0; i < 10 ; i ++)
  //    console.log(arr_url_card[i].imageUrl);
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

  let getTheTime = function(){
    console.log(readyState);
    if(httpRequest.readyState == XMLHttpRequest.DONE && httpRequest.status == 200){
      console.log("Hiiiiiiiiiiiiii");
       console.log(httpRequest.responseText);
    }
  } 
  getDataByXjax('get_current_time.php', getTheTime);   

 }


function flipCard() {
   //console.log("I was cliked");
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
          mes1.style.display = "inline-block";
          timeToCloseMes = 3000;
          put_content_to_message_1(parseInt(numberofcard));
          setTimeout(() => {
            mes1.style.display = "none";
          }, 3000);
      }

      // If the user wins
      if (num_cards_matched == num_pairs_cards) {
          mes3.style.display = "block";
          setTimeout(() => {
          mes3.style.display = "none";
          }, 1500);
          playAgain = true; // the user you can to click the start and play again 
          startGame.innerHTML = 'new Game';
      }
   }  else {
      mes2.style.display = "block";
      unflipCards();
      setTimeout(() => {
        mes2.style.display = "none";
      }, 1500);
  }
}




function disableCards() {
  // firstCard.removeEventListener('click', flipCard);
  // secondCard.removeEventListener('click', flipCard);
  resetBoard();
}



function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function unFlipToAllCards(){
  for(let i = 0 ; i < num_pairs_cards*2 ; i ++)
      cards[i].classList.remove('flip');
}



function resetBoard() {
  // hasFlippedCard = false;
  // lockBoard = false;
  // firstCard = null;
  // secondCard = null;
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
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

  // console.log(arr_url_card);
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
  console.log("%%%%%%%%5555");
  httpRequest;
  // create object
  httpRequest = new XMLHttpRequest();
  // assign callback function
  httpRequest.onreadystatechange = doSomething;
  // open a connection and send a request
  httpRequest.open('GET', url, true);
  httpRequest.send();
}


