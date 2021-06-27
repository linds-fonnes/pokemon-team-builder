//keeps count of how many pokemon have been added 
let counter = 0;

//retrieves data stored from local storage, if any displays the pokemon sprites 
function loadLocalStorage() {
  let storageArray = JSON.parse(localStorage.getItem("team"));
  if (storageArray) {
    counter = storageArray.length;
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
let team = [];
function addToLocalStorage(data) {
  let new_pokemon = {};
  new_pokemon.id = data.id;
  new_pokemon.sprite = data.sprite;
  new_pokemon.types = data.types;
  team.push(new_pokemon);
  localStorage.setItem("team", JSON.stringify(team));
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
  let name = $("#search-term").val().toLowerCase();

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

//displays damage relations totals to table for pokemon that have two types
function displayDualTypeDamageRelations(type){
  for(immunity of type.immune_to){
    let curr_value = parseInt($(`.${immunity}#immune_to`).text())
    $(`.${immunity}#immune_to`).html(`${curr_value + 1}`)
  }
  for(resist of type.resists){
    let curr_value = parseInt($(`.${resist}#resists`).text())
    $(`.${resist}#resists`).html(`${curr_value + 1}`)
  }
  for(weakness of type.weak_against){
    let curr_value = parseInt($(`.${weakness}#weak_against`).text())
    $(`.${weakness}#weak_against`).html(`${curr_value + 1}`)
  }
  
}

//calculation for dual type pokemon's damage relations. when a single pokemon has two types, the resistances/weaknesses/immunities often overlap and it has to be calculated which ones will cancel each other out.
// if there is overlap between weakness-resists they cancel each other out
// if there is overlap between an immunity with a weakness/resist it only counts as an immunity
// makes sure not to double count if there are two of the same resists/immunities/weaknesses - will only count for one of them
function calculateDualTypeDamageRelations(data){
  let temp_weak_arr = []
  let temp_resist_arr = []
  let immune_arr = []
  for(type of data){
    //for each type of current pokemon, push weakness into a single arr
    for(let i = 0; i < type.weak_against.length; i++){
      temp_weak_arr.push(type.weak_against[i])
    }
    //for each type of current pokemon, push immunities into a single arr
    for(let i =0; i < type.immune_to.length; i++){
      immune_arr.push(type.immune_to[i])
    }
    //filter through the weaknesses and immunities and return only the type names that aren't in the immunity arr
    let new_weak_arr = temp_weak_arr.filter((word) => !immune_arr.includes(word))
    
    //for each type of current pokemon, push the resistances into a single arr
    for(let i = 0; i < type.resists.length; i++){
      temp_resist_arr.push(type.resists[i])
    }
    // filter through the resistances and immunities and returns only the type names that aren't in the immunity arr
    let new_resist_arr = temp_resist_arr.filter((word) => !immune_arr.includes(word))

    // filter through new resist arr and new weakness array and remove any overlaps from the new resist array
    let newest_resist_arr = new_resist_arr.filter((word) => !new_weak_arr.includes(word))
    let newest_weakness_arr = new_weak_arr.filter((word) => !new_resist_arr.includes(word))
    //making sure there are no duplicates in any of arrays
    let immune = [...new Set(immune_arr)]
    let weakness = [...new Set(newest_weakness_arr)]
    let resist = [...new Set(newest_resist_arr)]
    //resetting the value of the type's damage relations to be all of the filtered arrays
    type.weak_against = weakness
    type.resists = resist
    type.immune_to = immune
  }
  displayDualTypeDamageRelations(type)
}

//displays the damage relations for pokemon that are only single type
function displayDamageRelations(resp){
  $(".stat").html("0")
  for(data of resp.data){
    if(data.damage_relations.length > 1) {
     calculateDualTypeDamageRelations(data.damage_relations)
    }
    else{
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
  $(".modal").removeClass("is-active")
  $("#save-team-message").empty()
  if (counter < 6) {
    let new_pokemon = $("#team-list")
      .append(
        `<img class="pokemon-sprite" id="${pokemon_data.id}" src="${pokemon_data.sprite}"/>`
      )
      .append(`<button class="button is-small is-rounded is-ghost remove-pokemon"><i class="fas fa-minus-circle"></i></button>`);
    counter++;
    addToLocalStorage(pokemon_data);
    getDamageRelations();
  } else $("#team-error").show();
}

//removes pokemon from local storage, decreases counter, and removes sprite from page
function removePokemon() {
  removeFromLocalStorage.call($(this).prev());
  $("#save-team-message").empty()
  $("#team-error").hide();
  $(this).prev().remove();
  $(this).remove();
  counter--;
  if ($("#team-list").text().length < 1){
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
  if ($("#team-list").text().length > 0){
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

