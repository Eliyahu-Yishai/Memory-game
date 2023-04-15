# Memory game


## Description
memory with 4*5 cards. the cards are turned upside down at the start of the game, and the images that make up the memory game are obtained by calling Ajax from https://api.disneyapi.dev/characters. When the rest of the user clicks on the card, the card turns over and the image is revealed. When left he presses the other card. There are 3 possibilities:
If he was right - and the two cards are identical, then there is a message of "well done" along with the details of the image on the card: such as which movie the image was broadcast, whether is it a series or a movie, etc.
If you made a mistake - an "error" message is displayed and a button that allows you to close the message.
If he won - there is a message "Congratulations" and it says how long it took the player to play the game.
When there is a win, the button appears with the inscription "New game" and when the player clicks, there is another Ajax call from the next URL which is in the Jason format we received as a result of reading the first URL, the images refresh and the player plays again.


## How to run
need to download the project, and run it on the browser on the computer
the project was uploaded to the c-panel of my college. Available here: http://eliyahuyi.mysoft.jce.ac.il/ex1/


## files
index.html, script.js, styles.css, get_currect_time.php


