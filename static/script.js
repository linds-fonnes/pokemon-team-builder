let counter = 0;
if(localStorage.length > 0){
  counter = localStorage.length;
  for(let i = 0; i < localStorage.length; i++){
    $("#team-list").append(`<img class="pokemon-sprite" src="${localStorage.getItem(localStorage.key(i))}"/>`).data("id",localStorage.getItem(localStorage.key(i))).append(`<button class="remove-pokemon">X</button>`)
  }
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
    response = await axios.post("/search_pokemon",{name: name}).then((response)=>{
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

/// change this to display sprite when adding pokemon and save id as data attr and then send a post request after each add to team that retrieves team stats and displays them



function displayAddedPokemon(){
  console.log(pokemon_data.id)
  if(counter < 6){
    $("#team-list").append(`<img class="pokemon-sprite" src="${pokemon_data.sprite}"/>`).data("id",pokemon_data.id).append(`<button class="remove-pokemon">X</button>`)
    counter++;
    localStorage.setItem(pokemon_data.id,pokemon_data.sprite)
  }
  else $("#team-error").show()
}

function removePokemon(){
  console.log($(this).prev().data())
  $("#team-error").hide()
  $(this).prev().remove()
  $(this).remove()
  counter--
}

$("#search-form").on("submit",processPokemonSearch)
$("#add-btn").on("click",displayAddedPokemon)
$("#team-list").on("click", ".remove-pokemon", removePokemon)