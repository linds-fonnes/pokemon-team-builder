
//retrieves data stored from local storage, if any displays the pokemon sprites 
function loadLocalStorage() {
  let storageArray = JSON.parse(localStorage.getItem("team"));
  if (storageArray) {
    for (let i = 0; i < storageArray.length; i++) {
      let new_pokemon = $("#team-list")
        .append(
          `<img class="pokemon-sprite" id="${storageArray[i].id}" src="${storageArray[i].sprite}"/>`
        )
        .append(`<button class="button is-small is-rounded is-ghost remove-pokemon"><i class="fas fa-minus-circle"></i></button>`);
    }
    getDamageRelations()
  }
}

//adds pokemon data to local storage so that data persists on page reload and if user wants to register/login after building their team
function addToLocalStorage(data) {
  let new_pokemon = {};
  new_pokemon.id = data.id;
  new_pokemon.sprite = data.sprite;
  new_pokemon.types = data.types;

  let team = []
  team = JSON.parse(localStorage.getItem("team")) || []
  team.push(new_pokemon)
  localStorage.setItem("team", JSON.stringify(team))
  $("#save-team").show()
}

//resets local storage value to be all the pokemons minus the one that was clicked to be removed, reruns damage relations calculations
function removeFromLocalStorage() {
  let storageArray = JSON.parse(localStorage.getItem("team"));
  const updatedArray = storageArray.filter(
    (pokemon) => pokemon.id != $(this).attr("id")
  );
  localStorage.setItem("team", JSON.stringify(updatedArray));
  getDamageRelations()
}

//pokeball loader displays while ajax request searches api for pokemon data
function displayLoader() {
  $("#loader").show();
  setTimeout(() => {
    $("#loader").hide();
  }, 5000);
}

//hide loader after response is received
function hideLoader() {
  $("#loader").hide();
}

//displays modal of pokemon details
function displayPokemonCard(resp) {
  $(".modal").addClass("is-active")
  $("#pokemon-stats").empty(); 
  $("#pokemon-card").show();
  $("#search-term").val("");
  $("#pokemon-name")
    .text(resp.name.toUpperCase())
    .append(`<span> ${resp.types} </span>`);
  $("#pokemon-img").attr("src", resp.image);
  for (stat of resp.stats) {
    $("#pokemon-stats").append(`<p>${stat.stat_name} | ${stat.base_stat}</p>`);
  }
  $("#add-btn").show();
}

//displays search error if pokemon name is not found in api
function displaySearchError() {
  $("#search-error").show();
  hideLoader();
}

//displays error if user tries to add more than 6 pokemon on their team
function displayTeamError() {
  $("#team-error").show();
}

//processes pokemon search and runs displayPokemonCard function with response data or displaySearchError if pokemon isn't found
let pokemon_data;
async function processPokemonSearch(evt) {
  evt.preventDefault();
  let name = $("#search-term").val().trim().toLowerCase();
  displayLoader();
  try {
    response = await axios
      .post("/team_builder/search_pokemon", { name: name })
      .then((response) => {
        pokemon_data = response.data;
        $("#search-error").hide();
        displayPokemonCard(response.data);
        hideLoader();
        return pokemon_data;
      });
  } catch (error) {
    displaySearchError();
  }
}


//displays the damage relations for pokemon 
function displayDamageRelations(resp){
  $(".stat").html("0")
  for(data of resp.data){
      for(let i = 0; i < data.damage_relations.length; i++){
        for(resist of data.damage_relations[i].resists){
          let curr_value = parseInt($(`.${resist}#resists`).text())
          $(`.${resist}#resists`).html(`${curr_value + 1}`)
          
        }
        for(immunity of data.damage_relations[i].immune_to){
          let curr_value = parseInt($(`.${immunity}#immune_to`).text())
          $(`.${immunity}#immune_to`).html(`${curr_value + 1}`)
        }
        for(weakness of data.damage_relations[i].weak_against){
          let curr_value = parseInt($(`.${weakness}#weak_against`).text())
          $(`.${weakness}#weak_against`).html(`${curr_value + 1}`)
        }
      }
    }
  }


//retrieves damage relations data for each pokemon added to the team so that it takes into account all of the pokemon on the team
async function getDamageRelations() {
  let storageArray = JSON.parse(localStorage.getItem("team"));
  if (storageArray) {
      let response = await axios.post("/team_builder/damage_relations",{data: storageArray})
      displayDamageRelations(response.data)
    }
  }


//displays pokemon sprite after user adds to team, increases count, adds to local storage and runs damage relations
//if team is full, displays error message
function displayAddedPokemon() {
  let storageArray = JSON.parse(localStorage.getItem("team"));
  $(".modal").removeClass("is-active")
  $("#save-team-message").empty()
  if (storageArray == null || storageArray.length < 6 ) {
    let new_pokemon = $("#team-list")
      .append(
        `<img class="pokemon-sprite" id="${pokemon_data.id}" src="${pokemon_data.sprite}"/>`
      )
      .append(`<button class="button is-small is-rounded is-ghost remove-pokemon"><i class="fas fa-minus-circle"></i></button>`);
    addToLocalStorage(pokemon_data);
    getDamageRelations();
  } else $("#team-error").show();
}

//removes pokemon from local storage, and removes sprite from page
function removePokemon() {
  removeFromLocalStorage.call($(this).prev());
  $("#save-team-message").empty()
  $("#team-error").hide();
  $(this).prev().remove();
  $(this).remove();
  const teamList = JSON.parse(localStorage.getItem("team"))
  if (teamList.length < 1){
    $("#save-team").hide()
  }
}

//takes pokemon data from local storage, sends it to backend for the pokemon id's to be saved in database along with team name. displays success if saved or error if user didn't input a team name
async function saveTeam(evt) {
  evt.preventDefault();
  let storageArray = JSON.parse(localStorage.getItem("team"));
  let response;
  try {
    response = await axios.post("/team_builder/save_team", {
      data: storageArray,
      team_name: $("#team-name").val(),
    });
    $("#save-team-message").text(response.data.message).prepend(' <i class="fas fa-exclamation-circle"></i> ');
    $("#team-name").val("")
  } catch (error) {
    $("#save-team-message").text(error.response.data.message).prepend(' <i class="fas fa-exclamation-circle"></i> ');
  }
  
}

//event listeners
$(document).ready(function(){
  if(window.location.pathname == "/team_builder"){
    loadLocalStorage()
    }
  });
  
$(document).ready(function(){
  const teamList = JSON.parse(localStorage.getItem("team"))
  if (teamList.length > 0){
    $("#save-team").show()
  }
})

$("#search-form").on("submit", processPokemonSearch);
$("#add-btn").on("click", displayAddedPokemon);
$("#team-list").on("click", ".remove-pokemon", removePokemon);
$("#save-team").on("submit", saveTeam);
$("#nav-burger").on("click",() =>{
  $("#nav-links").toggleClass("is-active")
})
$(".modal-background").on("click", () => {
  $(".modal").removeClass("is-active")
})

