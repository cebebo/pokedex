function tempPokeballInAlbum(i, j) {
    let insert = `
<div class="pokeball" onmouseover="playSound(2)" onclick="showPokedexDetails(${j}), playSound(1)">
    <img class="imgPokemonList" id="preview${i}">             
    <span class="number" id="number${i}"></span>
    <span class="pokeName" id="name${i}"></span>
    <div class="pokeType" id="type${i}"></div>          
</div>
`;
    return insert;
}

function tempTypeName(typeName) {
    let insert = `<div class="typeWritten">${typeName}</div>`;
    return insert;
}