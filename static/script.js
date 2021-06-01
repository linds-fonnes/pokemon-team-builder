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
        search_term.value = "";
        console.log(response.data);
        hideLoader();
      });
  } catch (error) {
    console.log(error);
    hideLoader();
    search_error.classList.remove("hidden");
  }
}

search_form.addEventListener("submit", handleSubmit);
