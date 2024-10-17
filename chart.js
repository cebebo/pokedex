let pokeLabel = [];
let pokeData = [];
let configuration = [];
let chart;

async function renderChart(chosenPokemon, i) {
    const ctx = document.getElementById('myChart');
    const pokemon = chosenPokemon.stats;
    Chart.defaults.color = '#000000';
    await getInformations(pokemon);
    configuration = {  
      type: 'bar',
      data: {
        labels: pokeLabel,
        datasets: [{
          label: languageChecker(0, (i - 1)),
          data: pokeData,
          borderWidth: 2,
          backgroundColor: ['#FF00FF','#FFFF00','#00FF00','#FF0000','#0000FF','#00FFFF'],
          borderColor: '#000000',
          color: '#000000',
        }]
      },
      options: {
        
        indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    }
if (chart) {
      chart.destroy();
      chart = new Chart(ctx, configuration);
    } else {
      chart = new Chart(ctx, configuration);
    }
    
  }

function getInformations(pokemon) {
    pokeData = [];
    pokeLabel = [];
    for (let j = 0; j < pokemon.length; j++) {
        pokeData.push(pokemon[j].base_stat);
        if (chosenLanguage == "eng"){
            let pokeName = pokemon[j].stat.name;
            pokeLabel.push(changeToUpperCase(pokeName));
        }
        else if (chosenLanguage == "ger"){pokeLabel = language[1].ger}
        else if (chosenLanguage == "fra"){pokeLabel = language[1].fra}
    }
}

