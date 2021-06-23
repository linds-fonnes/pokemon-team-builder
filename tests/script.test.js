describe("local storage tests", function () {
  beforeEach(function () {
    data = {
      id: 38,
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/38.svg",
      name: "ninetales",
      sprite:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png",
      stats: [
        { base_stat: 73, stat_name: "hp" },
        { base_stat: 76, stat_name: "attack" },
        { base_stat: 75, stat_name: "defense" },
        { base_stat: 81, stat_name: "special-attack" },
        { base_stat: 100, stat_name: "special-defense" },
        { base_stat: 100, stat_name: "speed" },
      ],
      types: ["fire"],
    };
    localStorage.setItem("data", data);
  });

  afterEach(function () {
    localStorage.clear();
  });

  it("should add pokemon data to local storage", function () {
    addToLocalStorage(data);
    expect(team.length).toEqual(1);
    expect(JSON.parse(localStorage.getItem("team")).length).toEqual(1);
    expect(localStorage.getItem("team")).toContain(
      data.id,
      data.sprite,
      data.types
    );
  });
});
