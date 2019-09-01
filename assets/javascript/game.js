// Game Options
const ATTACK_POWER_INCREASE_MULTIPLIER = 2;
const FIGHTERS = [
    {
        name: 'Fighter A',
        healthPoints: 100,
        attackPower: 10,
        counterAttackPower: 5,
        imgSrc: 'http://placehold.it/200x200',
    },
    {
        name: 'Fighter B',
        healthPoints: 100,
        attackPower: 10,
        counterAttackPower: 5,
        imgSrc: 'http://placehold.it/200x200',
    },
    {
        name: 'Fighter C',
        healthPoints: 100,
        attackPower: 10,
        counterAttackPower: 5,
        imgSrc: 'http://placehold.it/200x200',
    },
    {
        name: 'Fighter D',
        healthPoints: 100,
        attackPower: 10,
        counterAttackPower: 5,
        imgSrc: 'http://placehold.it/200x200',
    },
];

// Let's create an object to contain all of the game logic
const game = {

    // Create our variables to hold the game data
    currentState: '',
    nextState: '',
    currentPlayerCharacter: null,
    currentOpponent: null,
    defeatedOpponents: [],

    resetGameData: function(){
        // Clear all of the Fighters
        this.currentPlayerCharacter = null;
        this.currentOpponent = null;
        this.defeatedOpponents = [];

        // Remove all of the Fighter HTML elements
        $('.fighter').remove();
    },

    setupNewGame: function(){

        // Reset the game data so nothing from our previous game carries over
        this.resetGameData();

        // Create the Fighter HTML elements we'll be using in the game and load them on screen
        let characterChoiceBox = $('#character-choice-box');
        for (let i = 0; i < FIGHTERS.length; i++) {

            let newFighterData = FIGHTERS[i];

            let newFighterHTML = $(
                '<button class="fighter">' +
                    '<figure>' +
                        '<img src="' + newFighterData.imgSrc + '">' +
                        '<figcaption>' +
                            '<em class="name">' + newFighterData.name + '</em> ' +
                            '<span class="hp">' + newFighterData.healthPoints + '/' + newFighterData.healthPoints + ' HP</span>' +
                        '</figcaption>' +
                    '</figure>' +
                '</button>');

            newFighterHTML.on('click', function(){
                game.choosePlayerCharacter($(this));
            });
            newFighterHTML.attr('data-name', newFighterData.name);
            newFighterHTML.attr('data-healthPoints', newFighterData.healthPoints);
            newFighterHTML.attr('data-attackPower', newFighterData.attackPower);
            newFighterHTML.attr('data-counterAttackPower', newFighterData.counterAttackPower);

            characterChoiceBox.append(newFighterHTML);
        }
    },

    choosePlayerCharacter: function(playerCharacterJObj){
        console.log('Choosing player ' + playerCharacterJObj.attr('data-name'));
        playerCharacterJObj.off('click');
    },

    chooseOpponent: function(oponentJObj){

    },

    chooseAction: function(actionType){

    },

    actionAttack: function(opponentName){

    },

    actionOptions: function(){

    },

    updateScreen: function(){

    },

    stateObjects: {
        'start-screen': {
            unloadState: function(){

            },
            loadState: function(){

                console.log('Setting up new game');
                game.setupNewGame();
            }
        }
    },

    // Create a method for switching states
    switchState(newState) {

        // Set the next state so individual states can plan accordingly
        this.nextState = newState;

        // If we have a state loaded already, unload it first
        if (this.currentState !== '') {
            this.stateObjects[this.currentState].unloadState(); // If the currentState isn't empty, the state object must exist; so no error checking necessary
        }

        this.currentState = newState;

        // Now load the new state as long as it exists
        if (this.stateObjects.hasOwnProperty(this.currentState)) {
            this.stateObjects[this.currentState].loadState();
        }
        else {
            throw `The state '${this.currentState}' does not exist!`;
        }

        // Clear the next state since there isn't one anymore
        this.nextState = '';
    }
};

// Load the game
game.switchState('start-screen');
