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
        document.getElementById("pokemon-name").textContent =
          response.data.name.toUpperCase();
        const stat_name = document.getElementsByClassName("pokemon-stat-name");
        const base_stat = document.getElementsByClassName("stat");

        for (let i = 0; i < stat_name.length; i++) {
          stat_name[i].textContent = response.data.stats[i].stat.name;
          base_stat[i].textContent = response.data.stats[i].base_stat;
        }
        hideLoader();
      });
  } catch (error) {
    hideLoader();
    search_error.classList.remove("hidden");
  }
}

search_form.addEventListener("submit", handleSubmit);
