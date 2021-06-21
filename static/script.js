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

function displayDualTypeDamageRelations(type){
  console.log(type)
  for(immunity of type.immune_to){
    console.log("IMMUNE TO", immunity)
    let curr_value = parseInt($(`.${immunity}#immune_to`).text())
    $(`.${immunity}#immune_to`).html(`${curr_value + 1}`)
  }
  for(resist of type.resists){
    console.log("RESISTS", resist)
    let curr_value = parseInt($(`.${resist}#resists`).text())
    $(`.${resist}#resists`).html(`${curr_value + 1}`)
  }
  for(weakness of type.weak_against){
    console.log("WEAK AGAINST", weakness)
    let curr_value = parseInt($(`.${weakness}#weak_against`).text())
    $(`.${weakness}#weak_against`).html(`${curr_value + 1}`)
  }
  // for(let i = 0; i < data.damage_relations.length; i++){
  //   console.log(data.damage_relations[i])
  //   console.log(data.damage_relations[i].type)
  //   for(resist of data.damage_relations[i].resists){
  //     console.log("RESISTS",resist)
  //     let curr_value = parseInt($(`.${resist}#resists`).text())
  //     $(`.${resist}#resists`).html(`${curr_value + 1}`)
      
  //   }
  //   for(immunity of data.damage_relations[i].immune_to){
  //     console.log("IMMUNE TO",immunity)
  //     let curr_value = parseInt($(`.${immunity}#immune_to`).text())
  //     $(`.${immunity}#immune_to`).html(`${curr_value + 1}`)
  //   }
  //   for(weakness of data.damage_relations[i].weak_against){
  //     console.log("WEAK AGAINST", weakness)
  //     let curr_value = parseInt($(`.${weakness}#weak_against`).text())
  //     $(`.${weakness}#weak_against`).html(`${curr_value + 1}`)
  //   }
  // }
}

function calculateDualTypeDamageRelations(data){
  console.log("THERES TWO TYPES", data)
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

function displayDamageRelations(resp){
  $(".stat").html("0")
  console.log("ORIGINAL RESPONSE",resp)
  console.log("RESP.DATA", resp.data)
  for(data of resp.data){
    console.log("THIS IS THE DATA", data)
    if(data.damage_relations.length > 1) {
     calculateDualTypeDamageRelations(data.damage_relations)
    }
    else{
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
          let curr_value = parseInt($(`.${immunity}#immune_to`).text())
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
