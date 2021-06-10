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
  $("#search-error").hide()
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

async function processPokemonSearch(evt){
  evt.preventDefault()
  let name = $("#search-term").val()
  let response;
  displayLoader()
  try {
    response = await axios.post("/search_pokemon",{name: name}).then((response)=>{
      console.log(response.data)
      displayPokemonCard(response.data)
      hideLoader()
    })
    
  }
  catch(error){
    displaySearchError()
  }
}

async function addPokemon(){
  console.log("HI")
}


$("#search-form").on("submit",processPokemonSearch)
$("#add-btn").on("click",addPokemon)