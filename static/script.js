let counter = 0;

function loadLocalStorage(){
  let storageArray = JSON.parse(localStorage.getItem("team"))
  if(storageArray){
    counter = storageArray.length;
    for(let i = 0; i < storageArray.length; i++){
      let new_pokemon = $("#team-list").append(`<img class="pokemon-sprite" id="${storageArray[i].id}" src="${storageArray[i].sprite}"/>`).append(`<button class="remove-pokemon">X</button>`)
    }
  }
}
 
let team = []
function addToLocalStorage(data){
  let new_pokemon = {}
  new_pokemon.id = data.id
  new_pokemon.sprite = data.sprite 
  team.push(new_pokemon)
  localStorage.setItem("team",JSON.stringify(team))
}

function removeFromLocalStorage(){
  let storageArray = JSON.parse(localStorage.getItem("team"))
  const updatedArray = storageArray.filter((pokemon) => pokemon.id != $(this).attr("id"))
  localStorage.setItem("team",JSON.stringify(updatedArray))
}


function displayLoader() {
  $("#loader").show()
  setTimeout(() => {
    $("#loader").hide()
  }, 5000);
}

function hideLoader() {
  $("#loader").hide()
}


function displayPokemonCard(resp){
  $("#pokemon-stats").empty()
  $("#pokemon-card").show()
  $("#search-term").val("")
  $("#pokemon-name").text(resp.name.toUpperCase()).append(`<span> ${resp.types} </span>`)
  $("#pokemon-img").attr("src",resp.image)
  for(stat of resp.stats){
    $("#pokemon-stats").append(`<p>${stat.stat_name} | ${stat.base_stat}</p>`)
  }
  $("#add-btn").show()
}

function displaySearchError(){
  $("#search-error").show()
  hideLoader()
  $("#pokemon-card").hide()
}

function displayTeamError(){
  $("#team-error").show()
}

let pokemon_data;
async function processPokemonSearch(evt){
  evt.preventDefault()
  let name = $("#search-term").val()
  
  displayLoader()
  try {
    response = await axios.post("/team_builder/search_pokemon",{name: name}).then((response)=>{
      pokemon_data = response.data
      console.log(pokemon_data)
      $("#search-error").hide()
      displayPokemonCard(response.data)
      hideLoader()
      return pokemon_data
    })
    
  }
  catch(error){
    displaySearchError()
  }
}


function displayAddedPokemon(){
  if(counter < 6){
    let new_pokemon = $("#team-list").append(`<img class="pokemon-sprite" id="${pokemon_data.id}" src="${pokemon_data.sprite}"/>`).append(`<button class="remove-pokemon">X</button>`)
    counter++;
    addToLocalStorage(pokemon_data)
  }
  else $("#team-error").show()
}

function removePokemon(){
  removeFromLocalStorage.call($(this).prev())
  $("#team-error").hide()
  $(this).prev().remove()
  $(this).remove()
  counter--
}

async function saveTeam(){
  let storageArray = JSON.parse(localStorage.getItem("team"))
  response = await axios.post("/team_builder/save_team",{data: storageArray, team_name: $("#team-name").val()})
}

$(document).ready(loadLocalStorage)
$("#search-form").on("submit",processPokemonSearch)
$("#add-btn").on("click",displayAddedPokemon)
$("#team-list").on("click", ".remove-pokemon", removePokemon)
$("#save-team").on("submit", saveTeam)