

let categories = ['catBug.png', 'catDark.png', 'catDragon.png', 'catElectric.png', 'catFairy.png', 'catFight.png', 'catFire.png', 'catFly.png', 'catGhost.png',
    'catGrass.png', 'catGround.png', 'catIce.png', 'catNormal.png', 'catPoison.png', 'catPsychic.png', 'catRock.png', 'catSteel.png', 'catWater.png']
let min = 1;
let max = 20;
let chosenLanguage = 'eng';
let chosenPokemonAsJson;
let SOUNDS = [new Audio('./sounds/swish.wav'), new Audio('./sounds/openPD.mp3'), new Audio('./sounds/tick.wav'), new Audio('./sounds/tack.wav'), 
              new Audio('./sounds/bibb.wav'), new Audio('./sounds/flip.wav'), new Audio('./sounds/woosh.wav'), new Audio('./sounds/eng.mp3'),
              new Audio('./sounds/ger.mp3'), new Audio('./sounds/fra.mp3')];
let showStats = false;
let foundPokemon = [];

async function init() {
    document.getElementById('body').classList.add('noScrolling');
    for (let i = 1; i < 20; i++) {
        await getAPIdata(i);
        language[0].eng.push(changeToUpperCase(chosenPokemonAsJson.name));
    }
    document.getElementById('loadingCircle').classList.add('d-none');
    document.getElementById('loadingText').classList.add('d-none');
    document.getElementById('start').classList.remove('d-none');
    loadPokemon();
    for (let i = 1; i < 151; i++) {await getAPIdata(i)}
}

// Starts the Pokedex and closes the loading screen
function getStarted() {
    document.getElementById('loadScreen').style.display = "none";
    document.getElementById('body').classList.remove('noScrolling');
}

// Picks the chosen soundfile and plays it
function playSound(n) {
    SOUNDS[n].play();
}

// Changes the written language after clicking the flags
function changeLanguage(lang) {
    chosenLanguage = lang;
    for (let j = 1; j < max + 1; j++) {
        document.getElementById(`name${j}`).innerHTML = languageChecker(0, (j - 1));
    }
    document.getElementById('btnMorePokemon').innerHTML = languageChecker(3, 4);
    saveLocStor();
}

// Checks the current language and picks the asked word in the right language
function languageChecker(option, order) {
    let name;
    if (chosenLanguage == 'ger') { name = language[option].ger[order] }
    if (chosenLanguage == 'fra') { name = language[option].fra[order] }
    if (chosenLanguage == 'eng') { name = language[option].eng[order] }
    changeToUpperCase(name);
    highlightedFlags(chosenLanguage);
    return name;
}

// Saves the chosen language in local storage
function saveLocStor() {
    localStorage.setItem('language', chosenLanguage);
}

// changes the first letter of all words written in lower cases in upper case.
function changeToUpperCase(word) {
    word = word[0].toUpperCase() + word.slice(1);
    return word;
}

// Shows the chosen Language via highlighted flag
function highlightedFlags(lang) {
    document.getElementById('flagGer').classList.remove('highlighted');
    document.getElementById('flagEng').classList.remove('highlighted');
    document.getElementById('flagFra').classList.remove('highlighted');
    if (lang == 'eng') { document.getElementById('flagEng').classList.add('highlighted'); }
    if (lang == 'ger') { document.getElementById('flagGer').classList.add('highlighted'); }
    if (lang == 'fra') { document.getElementById('flagFra').classList.add('highlighted'); }
}

// Builds the album of pokemon in the chosen language
async function loadPokemon() {
    if (localStorage.getItem('language')) { chosenLanguage = localStorage.getItem('language') }
    for (let i = min; i < max + 1; i++) {
        await getAPIdata(i);
        languageChecker(0, (i - 1));
        showPokemon(chosenPokemonAsJson, i, 'album', i);
        showPokemonDetails(chosenPokemonAsJson, i, i)
    }
}

// Gets the informations from API
async function getAPIdata(i) {
    let chosenPokemon = await fetch('https://pokeapi.co/api/v2/pokemon/' + i + '/');
    chosenPokemonAsJson = await chosenPokemon.json();
}

// Build a html-template showing a pokeball with short informations
function showPokemon(pokemon, i, direction, j) {
    let output = document.getElementById(direction);
    output.innerHTML += tempPokeballInAlbum(i, j);
}

// Fills the pokeball with informations
function showPokemonDetails(pokemon, i, j) {
    let showName = document.getElementById(`name${i}`);
    let showNumber = document.getElementById(`number${i}`);
    let showType = document.getElementById(`type${i}`);
    let showPreview = document.getElementById(`preview${i}`);
    let name = languageChecker(0, (j - 1));
    let number = pokemon.id;
    let type = pokemon.types;
    let preview = pokemon.sprites.other.showdown.front_shiny;
    renderPokeball(name, number, type, preview, showName, showNumber, showType, showPreview);    
}

function renderPokeball(name, number, type, preview, showName, showNumber, showType, showPreview) {
    showName.innerHTML = name;
    showNumber.innerHTML = number;
    showPreview.src = preview;
    showType.innerHTML = checkType(type);
}

// Checks the type of the pokemon and sets the correct icon
function checkType(type) {
    let pokemonType = '';
    let result = 0;
    if (type.length == 1) {
        result = [type[0].type.name];
    } else {
        result = [type[0].type.name, type[1].type.name];
    }
    for (let i = 0; i < result.length; i++) {
        pokemonType += `<img class="imgCategory" src="./img/CAT${result[i]}.png">`;
    }
    return pokemonType;
}

// Loads 20 more pokemon in album
function showMorePokemon() {
    min = min + 20;
    max = max + 20;
    if (max > 151) { max = 151 }
    loadPokemon();
}

// Shows pokemon-details in opened pokedex
async function showPokedexDetails(i) {
    await getAPIdata(i);
    fillPokedexDetails(i);
    document.getElementById('popUp').style.display = 'flex';
    document.getElementById('foundPokemon').style.display = "none";
    eraseSearchBar();
    document.body.classList.add('noScrolling');
}

// Fills pokemon-details in opened pokedex
function fillPokedexDetails(i) {
    document.getElementById('pokedexClosedPreview').src = chosenPokemonAsJson.sprites.other.dream_world.front_default;
    document.getElementById('typeIcons').innerHTML = checkType(chosenPokemonAsJson.types);
    checkTypeForIncludes();
    renderChart(chosenPokemonAsJson, i);
    document.getElementById('bigPokeName').innerHTML = languageChecker(0, (i - 1));
    document.getElementById('flipCardText').innerHTML = languageChecker(3, 1);
    loadPokemonAttacks();
}

// Fills the move-section with all attacking moves from JSON
function loadPokemonAttacks() {
    document.getElementById('attacks').innerHTML = '';
    pokeMove = chosenPokemonAsJson.moves;
    for (let i = 0; i < pokeMove.length; i++) {
        document.getElementById('attacks').innerHTML += `<div class="attackBox">${changeToUpperCase(pokeMove[i].move.name)}</div>`;
    }
}

// Checks the database for types, that are included
function checkTypeForIncludes() {
    let typeName;
    let typeLabel;
    let showLabel = document.getElementById('typeLabel');
    showLabel.innerHTML = '';
    for (let j = 0; j < chosenPokemonAsJson.types.length; j++) {
        typeLabel = language[2].eng.indexOf(chosenPokemonAsJson.types[j].type.name);
        typeName = languageChecker(2, typeLabel);
        showLabel.innerHTML += tempTypeName(typeName);
    }
}

// Loads next or previous Pokemon in Pokedex
function changePokemon(direction) {
    playSound(4);
    let change = chosenPokemonAsJson.id;
    if (direction == 'next') {
        change++;
        if (change > max) { change = 1 }
    }
    if (direction == 'previous') {
        change--;
        if (change < 1) { change = max }
    }
    showPokedexDetails(change);

}

// Switches the twi sides of the card showing the stats or the moves
function flipCard() {
    playSound(6);
    showStats = !showStats;
    if (showStats) { flipToAttacks() }
    else { flipToStats() }
}

// Insert the moves/attacks after flipping
function flipToAttacks() {
    document.getElementById('myChart').style.visibility = 'hidden';
    document.getElementById('attacks').style.visibility = 'visible';
    document.getElementById('flipCardText').innerHTML = languageChecker(3, 0);
    document.getElementById('typeIcons').innerHTML = `${languageChecker(3, 2)}: <b>  ${(chosenPokemonAsJson.height / 10)}m</b>`
    document.getElementById('typeLabel').innerHTML = `${languageChecker(3, 3)}: <b>  ${(chosenPokemonAsJson.weight / 10)}kg</b>`
}

// Inserts the stats after flipping
function flipToStats() {
    document.getElementById('myChart').style.visibility = 'visible';
    document.getElementById('attacks').style.visibility = 'hidden';
    document.getElementById('flipCardText').innerHTML = languageChecker(3, 1);
    checkTypeForIncludes();
    document.getElementById('typeIcons').innerHTML = checkType(chosenPokemonAsJson.types);
}

// Makes the pokemon shout after clicking his picture
function pokemonShout() {
    let shout = chosenPokemonAsJson.id;
    let pokemonShout = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${shout}.ogg`);
    pokemonShout.play();
}

// Checks the search bar and asks for the chosen language
function searchBar() {
    search = document.getElementById('searchBar').value;
    if (search.length < 3) {
        document.getElementById('foundPokemon').style.display = 'none';
        document.body.classList.remove('noScrolling');
    }
    if (search.length >= 3) { searchBegins() }
}

// Starts the search function after typing a minimum of 3 letters
function searchBegins() {
    document.getElementById('listFoundPokemon').innerHTML = '';
    let input = search.toLowerCase();
    if (chosenLanguage == "ger") { searchResults(language[0].ger, input) }
    if (chosenLanguage == "eng") { searchResults(language[0].eng, input) }
    if (chosenLanguage == "fra") { searchResults(language[0].fra, input) }
    document.getElementById('foundPokemon').style.display = 'flex';
    document.body.classList.add('noScrolling');
    renderFoundPokemon();
}

// Checking pokemon names for same letters and pushing the id into an array
function searchResults(lang, input) {
    foundPokemon = [];
    for (let i = 0; i < 151; i++) {
        if (lang[i].toLowerCase().includes(input)) {
            foundPokemon.push(i + 1);
        }
    }
    if (foundPokemon.length == 0) { 
        if (chosenLanguage == 'eng') { document.getElementById('listFoundPokemon').innerHTML = "Nothing found!" }
        else if (chosenLanguage == 'ger') { document.getElementById('listFoundPokemon').innerHTML = "Nichts gefunden!" }
        else if (chosenLanguage == 'fra') { document.getElementById('listFoundPokemon').innerHTML = "Rien trouvé!" }
    }
}

// Erases the Value of the search bar and closes the 'found pokemon'-Popup
function eraseSearchBar() {
    document.getElementById('searchBar').value = '';
    document.getElementById('foundPokemon').style.display = 'none'
    document.body.classList.remove('noScrolling');
    foundPokemon = [];
}

// Shows the pokeballs of the found pokemon via searchbar
async function renderFoundPokemon() {
    for (let i = 0; i < foundPokemon.length; i++) {
        await getAPIdata(foundPokemon[i]);
        let name = languageChecker(0, (foundPokemon[i] - 1));
        showPokemon(chosenPokemonAsJson, `F${i}`, 'listFoundPokemon', foundPokemon[i]);
        showPokemonDetails(chosenPokemonAsJson, `F${i}`, foundPokemon[i])
    }
}

// Closes the Pokedex and the popup
function closePokedex() {
    document.getElementById('popUp').style.display = 'none';
    document.body.classList.remove('noScrolling');
}