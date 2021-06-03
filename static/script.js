const search_term = document.getElementById("search-term");
const search_form = document.getElementById("search-form");
const search_error = document.getElementById("search-error");
const loader = document.getElementById("loader");

function handleSubmit(evt) {
  evt.preventDefault();
  getPokemonData(search_term.value.toLowerCase());
}

function displayLoader() {
  loader.classList.remove("hidden");
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 5000);
}

function hideLoader() {
  loader.classList.add("hidden");
}

async function getPokemonData(term) {
  search_error.classList.add("hidden");
  displayLoader();
  try {
    await axios
      .get(`https://pokeapi.co/api/v2/pokemon/${term}`)
      .then((response) => {
        console.log(response.data);
        search_term.value = "";
        document
          .getElementById("pokemon-img")
          .setAttribute(
            "src",
            response.data.sprites.other.dream_world.front_default
          );
        document.getElementById("pokemon-card").classList.remove("hidden");
        const pokemon_name = document.getElementById("pokemon-name");
        pokemon_name.textContent = response.data.name.toUpperCase();
        const types = response.data.types;
        for (let i = 0; i < types.length; i++) {
          const type_el = document.createElement("span");
          type_el.textContent = ` ${response.data.types[i].type.name} `;
          pokemon_name.appendChild(type_el);
        }

        const stat_name = document.getElementsByClassName("pokemon-stat-name");
        const base_stat = document.getElementsByClassName("pokemon-stat");

        for (let i = 0; i < stat_name.length; i++) {
          stat_name[i].textContent = response.data.stats[i].stat.name;
          base_stat[i].textContent = response.data.stats[i].base_stat;
        }
        const card = document.getElementById("pokemon-card");
        const btn = document.createElement("button");
        btn.textContent = "Add to Team";
        card.appendChild(btn);
        hideLoader();
      });
  } catch (error) {
    hideLoader();
    search_error.classList.remove("hidden");
    document.getElementById("pokemon-card").classList.add("hidden");
  }
}

search_form.addEventListener("submit", handleSubmit);
