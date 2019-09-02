// Game Options
const FIGHTERS = [
    {
        name: 'Fighter A',
        healthPoints: 100,
        attackPower: 5,
        counterAttackPower: 8,
        imgSrc: 'http://placehold.it/200x200',
    },
    {
        name: 'Fighter B',
        healthPoints: 145,
        attackPower: 2,
        counterAttackPower: 11,
        imgSrc: 'http://placehold.it/200x200',
    },
    {
        name: 'Fighter C',
        healthPoints: 115,
        attackPower: 4,
        counterAttackPower: 9,
        imgSrc: 'http://placehold.it/200x200',
    },
    {
        name: 'Fighter D',
        healthPoints: 130,
        attackPower: 3,
        counterAttackPower: 10,
        imgSrc: 'http://placehold.it/200x200',
    },
];

// Let's create some references to boxes we'll always need and will remain constant
const body = $('body');

const section = {
    'start-screen': $('#start-section'),
    'player-character-selection-screen': $('#player-character-selection-section'),
    'opponent-selection-screen': $('#opponent-selection-section'),
    'fighting-arena-screen': $('#fighting-arena-section'),
    'action-menu-screen': $('#action-menu-section'),
    'options-menu-screen': $('#options-menu-section'),
    'game-win-screen': $('#game-win-section'),
    'game-lose-screen': $('#game-lose-section'),
};

const startGameButton = $('#start-game-button');
const playerCharacterSelectionBox = $('#player-character-selection-box');
const opponentSelectionBox = $('#opponent-selection-box');
const attackerAreaBox = $('#attacker-area');
const defenderAreaBox = $('#defender-area');
const actionMenuItems = $('#action-menu > li > button');
const optionsMenuItems = $('#options-menu > li > button');
const gameWinDefeatedCouch = $('#game-win-section > .defeated-opponents-couch');
const gameLoseDefeatedCouch = $('#game-lose-section > .defeated-opponents-couch');
const gameWinRestartGameButton = $('#game-win-section > .restart-game-button');
const gameLoseRestartGameButton = $('#game-lose-section > .restart-game-button');

// Let's create an object to contain all of the game logic
const game = {

    // Create our variables to hold the game data
    currentState: '',
    nextState: '',
    currentPlayerCharacter: null,
    currentOpponent: null,
    defeatedOpponents: [],

    initialize: function(){
        console.log('initializing the game');

        // Hide all of the sections
        $('section').css('display', 'none');

        // Switch to the start screen
        game.switchState('start-screen');
    },

    resetGameData: function(){
        console.log('resetting game data');
        
        // Clear all of the Fighters
        game.currentPlayerCharacter = null;
        game.currentOpponent = null;
        game.defeatedOpponents = [];
        
        // Remove all of the Fighter HTML elements
        $('.fighter').remove();
    },

    setupNewGame: function(){
        console.log('setting up a new game');

        // Reset the game data so nothing from our previous game carries over
        this.resetGameData();

        // Create the Fighter HTML elements we'll be using in the game and load them on screen
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

            // Attach the fighter's stats to its element
            newFighterHTML.attr('data-name', newFighterData.name);
            newFighterHTML.attr('data-healthPoints', newFighterData.healthPoints);
            newFighterHTML.attr('data-attackPower', newFighterData.attackPower);
            newFighterHTML.attr('data-counterAttackPower', newFighterData.counterAttackPower);
            newFighterHTML.attr('data-initialHP', newFighterData.healthPoints);
            newFighterHTML.attr('data-initialAP', newFighterData.attackPower);

            // Attach a click handler for choosing them as the player character
            newFighterHTML.on('click', function(){
                game.choosePlayerCharacter($(this));
            });

            // Throw the new Fighter at the end of the player character selection box
            playerCharacterSelectionBox.append(newFighterHTML);
        }
    },

    choosePlayerCharacter: function(playerCharacterJObj){
        console.log('Choosing player ' + playerCharacterJObj.attr('data-name'));

        // Keep track of the current player character
        game.currentPlayerCharacter = playerCharacterJObj;

        // Remove the click event handler from the player character and disable them from being clicked
        playerCharacterJObj.off('click');
        playerCharacterJObj.prop('disabled', true);

        // Take the chosen player character and throw them into the fighting arena in the attacker area
        attackerAreaBox.append(game.currentPlayerCharacter);

        // Change the click handlers on the remaining fighters to choosing them as the opponent
        let remainingFighters = playerCharacterSelectionBox.children();
        remainingFighters.off('click');
        remainingFighters.on('click', function(){
            game.chooseOpponent($(this))
        });

        // Take the rest of the fighters and throw them into the opponent selection box
        opponentSelectionBox.append(remainingFighters);

        // Switch to the opponent selection screen
        game.switchState('opponent-selection-screen');
    },

    chooseOpponent: function(opponentJObj){
        console.log('Choosing opponent ' + opponentJObj.attr('data-name'));

        // Keep track of the current opponent
        game.currentOpponent = opponentJObj;

        // Remove the click event handler from the opponent and disable them from being clicked
        opponentJObj.off('click');
        opponentJObj.prop('disabled', true);

        // Take the chosen opponent and throw them into the fighting arena in the defender area
        defenderAreaBox.append(game.currentOpponent);

        // Switch to the fighting arena screen
        game.switchState('fighting-arena-screen');
    },

    chooseAction: function(actionType){
        console.log('Choosing action ' + actionType);

        if (actionType === 'Attack') {
            this.actionAttack();
        }
        else if (actionType === 'Options') {
            this.actionAttack();
        }
        else {
            throw `'${actionType}' is not a recognized action type!`;
        }
    },
    
    actionAttack: function(){
        console.log('Attacking now!');
        
        // Grab the needed data
        let attackPower = parseInt(this.currentPlayerCharacter.attr('data-attackPower'), 10);
        let initialAttackPower = parseInt(this.currentPlayerCharacter.attr('data-initialAP'), 10);
        let opponentHealthPoints = parseInt(this.currentOpponent.attr('data-healthPoints'), 10);
        let initialOpponentHP = parseInt(this.currentOpponent.attr('data-initialHP'), 10);
        
        // Apply the attack on the opponent
        opponentHealthPoints = Math.max(opponentHealthPoints - attackPower, 0);
        
        // Increase the player's attack power
        attackPower = attackPower + initialAttackPower;
        
        // Update the game data
        game.currentOpponent.attr('data-healthPoints', opponentHealthPoints);
        game.currentPlayerCharacter.attr('data-attackPower', attackPower);
        
        // Update the screen
        game.currentOpponent.find('.hp').text(`${opponentHealthPoints}/${initialOpponentHP} HP`);
        
        // If we defeated the opponent, clean everything up and return to the opponent selection screen
        if (opponentHealthPoints === 0) {
            
            // Move the opponent to the array for defeated opponents
            game.currentOpponent.detach();
            game.defeatedOpponents.push(game.currentOpponent);
            game.currentOpponent = null;

            // If we have more opponents, let's select a new one
            if (opponentSelectionBox.children().length !== 0) {
                
                // Switch back to the opponent selection screen
                game.switchState('opponent-selection-screen');
            }
            // If we don't have any more opponents, we won the game
            else {

                // Switch to the game win screen
                game.switchState('game-win-screen');
            }
        }
        // If we did not defeat the opponent yet, let the opponent counter attack
        else {
            
            // Initiate the opponent's counter attack
            game.actionCounterAttack();
        }
    },
    actionCounterAttack: function(){
        console.log('Counter-Attacking now!');
        
        // Grab the needed data
        let counterAttackPower = parseInt(game.currentOpponent.attr('data-counterAttackPower'), 10);
        let playerHealthPoints = parseInt(game.currentPlayerCharacter.attr('data-healthPoints'), 10);
        let initialPlayerHP = parseInt(game.currentPlayerCharacter.attr('data-initialHP'), 10);

        // Apply the attack on the player
        playerHealthPoints = Math.max(playerHealthPoints - counterAttackPower, 0);

        // Update the game data
        game.currentPlayerCharacter.attr('data-healthPoints', playerHealthPoints);
        
        // Update the screen
        game.currentPlayerCharacter.find('.hp').text(`${playerHealthPoints}/${initialPlayerHP} HP`);
        
        // If we were defeated by the opponent, we lost the game
        if (playerHealthPoints === 0) {
            
            // Switch to the game lose screen
            game.switchState('game-lose-screen');
        }
    },
    
    actionOptions: function(){
        console.log('Opening options!')
        
        // Show the options menu screen
        game.showSection('options-menu-screen');

        // Disable the action menu items for now
        actionMenuItems.prop('disabled', true);
        
        // Attach click event handlers to the options menu buttons
        optionsMenuItems.on('click', function(){
            console.log(`handling click on options menu item '${$(this).attr('data-optionType')}'`);

            let optionType = $(this).attr('data-optionType');
            if (optionType === 'Restart') {

                // Switch back to the start screen
                game.switchState('start-screen');
            }
            else if (optionType === 'Back') {

                // Re-enable the action menu items
                actionMenuItems.prop('disabled', false);
            }
            else {
                throw `'${optionType}' is not a recognized option type!`;
            }

            // Hide the options menu screen
            game.hideSection('options-menu-screen');

            // Remove the click event handler from the options menu items
            optionsMenuItems.off('click');
        })
    },

    hideSection(name){
        console.log(`hiding section '${name}'`);

        // Hide the section
        section[name].css('display', 'none');

        // Remove the state signifier class (used for styling) from the body
        body.removeClass(name);
    },

    showSection(name){
        console.log(`showing section '${name}'`);

        // Set the state signifier class (used for styling) to the body
        body.addClass(name);

        // Show the section
        section[name].css('display', 'block');
    },

    stateObjects: {
        'start-screen': {
            unloadState: function(){

                // Hide the start screen
                game.hideSection('start-screen');

                // Let's remove the click handler to ensure we don't add multiple click handlers
                startGameButton.off('click');
            },
            loadState: function(){

                // Set up an event handler for the start button's click
                startGameButton.on('click', function(){

                    // Set up a new game
                    game.setupNewGame();

                    // Now switch into the game
                    game.switchState('player-character-selection-screen');
                });

                // Show the start screen
                game.showSection('start-screen');
            }
        },
        'player-character-selection-screen': {
            unloadState: function(){

                // Hide the player character selection screen
                game.hideSection('player-character-selection-screen');
            },
            loadState: function(){

                // Show the player character selection screen
                game.showSection('player-character-selection-screen');
            }
        },
        'opponent-selection-screen': {
            unloadState: function(){

                // Hide the opponent selection screen
                game.hideSection('opponent-selection-screen');

                // Disable the remaining fighters for now
                let remainingFighters = opponentSelectionBox.children();
                remainingFighters.prop('disabled', true);
            },
            loadState: function(){

                // Enable the remaining fighters
                let remainingFighters = opponentSelectionBox.children();
                remainingFighters.prop('disabled', false);

                // Show the opponent selection screen
                game.showSection('opponent-selection-screen');
            }
        },
        'fighting-arena-screen': {
            unloadState: function(){

                // Hide the fighting arena screen
                game.hideSection('fighting-arena-screen');

                // Hide the action menu screen
                game.hideSection('action-menu-screen');

                // Disable the action menu items
                actionMenuItems.prop('disabled', true);

                // Remove the click event handlers from the action menu buttons
                actionMenuItems.off('click');
            },
            loadState: function(){

                // Enable the action menu items
                actionMenuItems.prop('disabled', false);

                // Attach click event handlers to the action menu buttons
                actionMenuItems.on('click', function(){
                    console.log(`'${$(this).attr('data-actionType')}' action item clicked`)

                    let actionType = $(this).attr('data-actionType');
                    if (actionType === 'Attack') {

                        // Perform the attack
                        game.actionAttack();
                    }
                    else if (actionType === 'Options') {

                        // Go to the options
                        game.actionOptions();
                    }
                    else {
                        throw `Unexpected action type '${actionType}'!`;
                    }
                });

                // Show the fighting arena screen
                game.showSection('fighting-arena-screen');

                // Show the action menu screen
                game.showSection('action-menu-screen');
            }
        },
        'game-win-screen': {
            unloadState: function(){

                // Hide the game win screen
                game.hideSection('game-win-screen');
            },
            loadState: function(){

                // If the player defeated some opponents
                if (game.defeatedOpponents.length !== 0) {

                    // Move the defeated opponents into the defeated couch
                    gameWinDefeatedCouch.text('');
                    for (let i = 0; i < game.defeatedOpponents.length; i++) {

                        let currentDefeatedOpponent = game.defeatedOpponents[i];
                        gameWinDefeatedCouch.append(currentDefeatedOpponent);
                    }
                }
                // If the player didn't defeat any opponents
                else {

                    // Show that no opponents had been defeated
                    gameWinDefeatedCouch.text('(none)');
                }

                // Attach the click event handlers to the restart button
                gameWinRestartGameButton.on('click', function(){
                    console.log('handling restart button click event');

                    // Switch back to the start screen
                    game.switchState('start-screen');
                });

                // Show the game win screen
                game.showSection('game-win-screen');
            }
        },
        'game-lose-screen': {
            unloadState: function(){

                // Hide the game lose screen
                game.hideSection('game-lose-screen');
            },
            loadState: function(){

                // If the player defeated some opponents
                if (game.defeatedOpponents.length !== 0) {

                    // Move the defeated opponents into the defeated couch
                    gameLoseDefeatedCouch.text('');
                    for (let i = 0; i < game.defeatedOpponents.length; i++) {

                        let currentDefeatedOpponent = game.defeatedOpponents[i];
                        gameLoseDefeatedCouch.append(currentDefeatedOpponent);
                    }
                }
                // If the player didn't defeat any opponents
                else {

                    // Show that no opponents had been defeated
                    gameLoseDefeatedCouch.text('(none)');
                }

                // Attach the click event handlers to the restart button
                gameLoseRestartGameButton.on('click', function(){
                    console.log('handling restart button click event');

                    // Switch back to the start screen
                    game.switchState('start-screen');
                });

                // Show the game lose screen
                game.showSection('game-lose-screen');
            }
        },
    },

    // Create a method for switching states
    switchState(newState) {

        // Set the next state so individual states can plan accordingly
        game.nextState = newState;

        // If we have a state loaded already, unload it first
        if (game.currentState !== '') {
            console.log(`unloading '${game.currentState}' state`);

            game.stateObjects[game.currentState].unloadState(); // If the currentState isn't empty, the state object must exist; so no error checking necessary
        }

        // Now load the new state as long as it exists
        if (game.stateObjects.hasOwnProperty(newState)) {
            console.log(`loading '${newState}' state`);

            // Change the game state to our new state
            game.currentState = newState;

            // Load the new state
            game.stateObjects[game.currentState].loadState();
        }
        else {
            // Raise an exception if the current state doesn't exist since that probably means a typo in the state name occurred when calling the method
            throw `The state '${newState}' does not exist!`;
        }

        // Clear the next state since there isn't one anymore
        game.nextState = '';
    }
};

// Initialize the game
game.initialize();