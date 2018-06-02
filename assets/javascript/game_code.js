// The Object of Hangman
const HangmanGame = function() {

    // Variables for game
    let numWins = 0, numLosses = 0;
    let keyEnabled = true;

    // Variables for user
    let answer, answer_string, answer_array;
    let guesses_string, guesses_array, numTriesLeft;


// Start New Game

    this.startNewGame = function() {

        // Word from Dictionary
        answer              = getWord().toLowerCase();
        const answer_length = answer.length;

        // Initiate what user sees
        answer_string = "_".repeat(answer_length);
        answer_array  = answer_string.split("");

        updateAnswerString();

        // Reset the guesses
        guesses_string = "";
        guesses_array  = [];

        // Allow more attempts for shorter words
        numTriesLeft = Math.max(6, Math.min(13 - Math.ceil(answer_length / 2), 10));

        // Display messages
        displayNumWins();
        displayNumLosses();
        displayNumTriesLeft();
        displayGuesses();
    }

    
// The Display Messages

    this.displayLightBox = function(lightBoxOn) {
        this.updateKeyEnabled(!lightBoxOn);

        $("#lightBox_background, #lightBox").css({"display": (lightBoxOn) ? "block" : "none"});
    }

    function displayProgress() {
        $("#answerProgress").text(answer_string);
    }

    function displayNumWins() {
        $("#numWins").text(numWins);
    }

    function displayNumLosses() {
        $("#numLosses").text(numLosses);        
    }

    function displayNumTriesLeft() {
        $("#numTriesLeft").text(numTriesLeft);
    }

    function displayGuesses() {
        $("#guesses").text(guesses_string);
    }
    

// Updating Methods

    this.updateKeyEnabled = function(changeTo) {
        keyEnabled = changeTo;
    }

    function updateAnswerString() {
        answer_string = answer_array.join("");

        displayProgress();
    }

    function updateGuesses(changeBy) {
        guesses_string += changeBy;
        guesses_array.push(changeBy);
        
        displayGuesses();
    }

    function updateNumTriesLeft(changeBy) {
        numTriesLeft += changeBy;

        displayNumTriesLeft();
    }


// jQuery Methods

    this.isKeyEnabled = function() {
        return keyEnabled;
    }

    function isGuessNew(x) {
        return !guesses_array.includes(x);
    }

    this.checkProgress = function(letter) {
        if (isGuessNew(letter)) {

            // Check to see if the letter is part of the word
            let index = answer.indexOf(letter);

            if (index === -1) {
                updateNumTriesLeft(-1);

            } else {

                // Display all letters matching the letter
                while (index >= 0) {
                    answer_array[index] = letter;

                    index = answer.indexOf(letter, index + 1);
                }

                updateAnswerString();
                
            }

            // Record letter
            updateGuesses(letter);

            // Check if user has guessed the word correctly
            if (answer_string === answer) {
                numWins++;

                $("#outputMessage").html(`Yay! It was <strong>${answer}</strong>!<br>Press any key to continue.`);
                $("#lightBox").css({
                    "animation-name"  : "slide_down",
                    "background-color": "var(--color-mint-green)"
                });
                $("#lightBox strong").css({"color": "#fff896"});

                this.displayLightBox(true);
                
                this.startNewGame();

            // Check if the user has run out of guesses
            } else if (numTriesLeft === 0) {
                numLosses++;

                $("#outputMessage").html(`Sorry, it was <strong>${answer}</strong>!<br>Press any key to continue.`);
                $("#lightBox").css({
                    "animation-name"  : "shake",
                    "background-color": "var(--color-danger-red)"
                });
                $("#lightBox strong").css({"color": "#beffad"});

                this.displayLightBox(true);
                
                this.startNewGame();

            }
        }
    }
}


// New game when page loads
let game;

$(document).ready(function() {
    game = new HangmanGame();

    game.startNewGame();


// Respond to what the user does
    $(document).on("keypress", event => {

        // Allow user to hide the lightbox
        if (!game.isKeyEnabled()) {
            game.updateKeyEnabled(true);
            game.displayLightBox(false);

            return;
        }

        // Show key pressed
        const letter = String.fromCharCode(event.which).toLowerCase();

        if ("a" <= letter && letter <= "z") {
            game.checkProgress(letter);
        }
    });

    // Lightbox
    $("#lightBox_background, #lightBox").on("click", function() {
        game.displayLightBox(false);
    });
});