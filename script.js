const files = [
  "data/banana-oatmeal-cookie.json",
  "data/basil-and-pesto-hummus.json",
  "data/black-bean-and-rice-enchiladas.json",
  "data/divine-hard-boiled-eggs.json",
  "data/four-cheese-margherita-pizza.json",
  "data/homemade-black-bean-veggie-burgers.json",
  "data/homemade-chicken-enchiladas.json",
  "data/marinated-grilled-shrimp.json",
  "data/vegetable-fried-rice.json",
  "data/vegetarian-korma.json",
  "data/worlds-best-lasagna.json",
];
let recipeData = [];
let categories = [];
let currentCategory = [];
let currentID = "";
const mainContent = document.getElementById("main");
const heading = document.getElementById("heading");
const list = document.getElementById("list");
const categoryBtn = document.querySelectorAll(".category");
const recipeTitle = document.querySelectorAll(".recipeTitle");

const fetchData = () => {
  files.forEach((data) => {
    fetch(data)
      .then((response) => response.json())
      .then((data) => {
        recipeData.push(data);
        categories.push(...data.tags);
        categories = [...new Set(categories)];
        currentCategory = categories;
      });
  });
};

const displaySingleRecipe = (id, batches = 1) => {
  mainContent.innerHTML = "";
  let data = recipeData[id];
  let ingredients = ``;
  let directions = ``;
  let heading = `<h1 class='recipeTitle'>${data.title}</h1>
    <h2>${data.description}</h2>
    <br>
    `;

  data.ingredients.map((data) => {
    function extract(item) {
      let newData = "";
      const regex = /^(\d+)( |\/|)?(\d+)?( |\/)?(\d{1})?/gim;
      const singular =
        /(\bcup\b)|(\bteaspoon\b)|(\btablespoon\b)|(\begg\b)|(\bclove\b)|(\bpepper\b)|(\bonion\b)|(\bcan\b)|(\bbunch\b)/gim;
      let firstChar = item.charAt(0);
      if (firstChar >= "0" && firstChar <= "9") {
        let match = item.match(regex);
        let fraction = String(match).trim();
        let newValue = math
          .multiply(math.fraction(fraction), batches)
          .toFraction(true);
        newData = item.replace(regex, `${newValue} `);
        if (
          newData.match(singular) != null &&
          math.compare(math.fraction(newValue), 1).toFraction(true) == 1
        ) {
          let newString = newData.match(singular);
          let pluralString = "";
          if (newString.toString() === "bunch") {
            pluralString = newString.toString() + "es";
          } else {
            pluralString = newString.toString() + "s";
          }
          newData = newData.replace(singular, pluralString);
        }
      }
      data = newData;
    }
    extract(data);
    ingredients += `<p>${data}</p>`;
  });

  data.directions.map((data) => {
    directions += `<p>${data}</p>`;
  });

  let content = `<div class='recipe'>
    ${heading}
    ${ingredients}
    ${directions}
    <p>Servings: ${data.servings * batches}</p>
    <button id='1' class='button'>x1</button>
    <button id='2' class='button'>x2</button>
    <button id='3' class='button'>x3</button>
    <button id='4' class='button'>x4</button>
    </div>`;

  mainContent.insertAdjacentHTML("beforeend", content);
  document.querySelectorAll(".button").forEach((e) => {
    e.addEventListener("click", () => {
      displaySingleRecipe(currentID, e.id);
    });
  });
};

const displayData = (value) => {
  value === "all" ? (currentCategory = categories) : (currentCategory = value);
  mainContent.innerHTML = "";
  recipeData.map((data, index) => {
    const values = [...data.tags];
    const found = values.some((r) => currentCategory.indexOf(r) >= 0);
    if (found) {
      let content = `<div class='recipe'>
    <h1 class='recipeTitle' id=${index}>${data.title}</h1>
    <h2>${data.description}</h2>
    <br>
    </div>
    `;
      mainContent.insertAdjacentHTML("beforeend", content);
    }
    document.querySelectorAll(".recipeTitle").forEach((e) => {
      e.addEventListener("click", () => {
        currentID = e.id;
        displaySingleRecipe(e.id);
      });
    });
  });
};

window.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

categoryBtn.forEach((e) => {
  e.addEventListener("click", () => {
    displayData(e.innerHTML.toLowerCase());
  });
});
