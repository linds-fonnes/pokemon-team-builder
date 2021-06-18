let counter = 0;

function loadLocalStorage() {
  let storageArray = JSON.parse(localStorage.getItem("team"));
  if (storageArray) {
    counter = storageArray.length;
    for (let i = 0; i < storageArray.length; i++) {
      let new_pokemon = $("#team-list")
        .append(
          `<img class="pokemon-sprite" id="${storageArray[i].id}" src="${storageArray[i].sprite}"/>`
        )
        .append(`<button class="remove-pokemon">X</button>`);
    }
    getDamageRelations()
  }
}

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

function removeFromLocalStorage() {
  let storageArray = JSON.parse(localStorage.getItem("team"));
  const updatedArray = storageArray.filter(
    (pokemon) => pokemon.id != $(this).attr("id")
  );
  localStorage.setItem("team", JSON.stringify(updatedArray));
  getDamageRelations()
}

function displayLoader() {
  $("#loader").show();
  setTimeout(() => {
    $("#loader").hide();
  }, 5000);
}

function hideLoader() {
  $("#loader").hide();
}

function displayPokemonCard(resp) {
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

function displaySearchError() {
  $("#search-error").show();
  hideLoader();
  $("#pokemon-card").hide();
}

function displayTeamError() {
  $("#team-error").show();
}

let pokemon_data;
async function processPokemonSearch(evt) {
  evt.preventDefault();
  let name = $("#search-term").val();

  displayLoader();
  try {
    response = await axios
      .post("/team_builder/search_pokemon", { name: name })
      .then((response) => {
        pokemon_data = response.data;
        console.log(pokemon_data);
        $("#search-error").hide();
        displayPokemonCard(response.data);
        hideLoader();
        return pokemon_data;
      });
  } catch (error) {
    displaySearchError();
  }
}


function displayDualTypeDamageRelations(data){
  console.log("THERES TWO TYPES", data)
  let weak_arr = []
  let immune_arr = []
  for(type of data){
    console.log(type)
    //for each type of current pokemon, push weakness into a single arr
    for(let i = 0; i < type.weak_against.length; i++){
      weak_arr.push(type.weak_against[i])
    }
    //for each type of current pokemon, push immunities into a single arr
    for(let i =0; i < type.immune_to.length; i++){
      immune_arr.push(type.immune_to[i])
    }
    //filter through the weaknesses and immunities and return only the type names that aren't in the immunity arr
    let filtered_arr = weak_arr.filter((word) => !immune_arr.includes(word))
    console.log("HERE",immune_arr,weak_arr,filtered_arr) 
  }
}

function displayDamageRelations(resp){
  $(".stat").html("0")
  for(data of resp.data){
    if(data.damage_relations.length > 1) {
      return displayDualTypeDamageRelations(data.damage_relations)
    }
    for(let i = 0; i < data.damage_relations.length; i++){
      console.log(data.damage_relations[i])
      console.log(data.damage_relations[i].type)
      for(resist of data.damage_relations[i].resists){
        console.log("RESISTS",resist)
        let curr_value = parseInt($(`.${resist}#resists`).text())
        $(`.${resist}#resists`).html(`${curr_value + 1}`)
        
      }
      for(immunity of data.damage_relations[i].immune_to){
        console.log("IMMUNE TO",immunity)
        let curr_value = parseInt($(`.${resist}#immune_to`).text())
        $(`.${immunity}#immune_to`).html(`${curr_value + 1}`)
      }
      for(weakness of data.damage_relations[i].weak_against){
        console.log("WEAK AGAINST", weakness)
        let curr_value = parseInt($(`.${weakness}#weak_against`).text())
        $(`.${weakness}#weak_against`).html(`${curr_value + 1}`)
      }
    }
  }
}

async function getDamageRelations() {
  let storageArray = JSON.parse(localStorage.getItem("team"));
  if (storageArray) {
      let response = await axios.post("/team_builder/damage_relations",{data: storageArray})
      displayDamageRelations(response.data)
    }
  }


function displayAddedPokemon() {
  if (counter < 6) {
    let new_pokemon = $("#team-list")
      .append(
        `<img class="pokemon-sprite" id="${pokemon_data.id}" src="${pokemon_data.sprite}"/>`
      )
      .append(`<button class="remove-pokemon">X</button>`);
    counter++;
    addToLocalStorage(pokemon_data);
    getDamageRelations();
  } else $("#team-error").show();
}

function removePokemon() {
  removeFromLocalStorage.call($(this).prev());
  $("#team-error").hide();
  $(this).prev().remove();
  $(this).remove();
  counter--;
  if ($("#team-list").text().length < 1){
    $("#save-team").hide()
  }
}

async function saveTeam(evt) {
  evt.preventDefault();
  let storageArray = JSON.parse(localStorage.getItem("team"));
  let response;
  try {
    response = await axios.post("/team_builder/save_team", {
      data: storageArray,
      team_name: $("#team-name").val(),
    });
    $("#save-team-message").text(response.data.message);
  } catch (error) {
    $("#save-team-message").text(error.response.data.message);
  }
}

$(document).ready(loadLocalStorage);
$(document).ready(function(){
  if ($("#team-list").text().length > 0){
    $("#save-team").show()
  }
})
$("#search-form").on("submit", processPokemonSearch);
$("#add-btn").on("click", displayAddedPokemon);
$("#team-list").on("click", ".remove-pokemon", removePokemon);
$("#save-team").on("submit", saveTeam);
