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

//Loops through each of the JSON files in the files const. Fetches the data, parses the JSON and then pushes it to the recipesData variable.
//Does the sames with the categories in each JSON and pushes them to the categories variables while removing any duplicates.
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

// function for displaying a full recipe. Takes two variables: the index of the recipe and the amount to multiply the recipe ingredients by
const displaySingleRecipe = (id, batches = 1) => {
  mainContent.innerHTML = "";
  let data = recipeData[id];
  let ingredients = ``;
  let directions = ``;
  let title = `<h1 class='recipeTitle'>${data.title}</h1>
    <h2>${data.description}</h2>
    <br>
    `;

  data.ingredients.map((data) => {
    //fucntion to increase ingredient amounts
    function extract(item) {
      let newData = "";

      //regex for finding the fractions from the begining of each ingredients line
      const regex = /^(\d+)( |\/|)?(\d+)?( |\/)?(\d{1})?/gim;

      //regex for finding the singular of the ingredient types
      const singular =
        /(\bcup\b)|(\bteaspoon\b)|(\btablespoon\b)|(\begg\b)|(\bclove\b)|(\bpepper\b)|(\bonion\b)|(\bcan\b)|(\bbunch\b)/i;

      let firstChar = item.charAt(0);

      //if the first character is a number proceed to change data
      if (firstChar >= "0" && firstChar <= "9") {
        let match = item.match(regex);
        let fraction = String(match).trim();
        let newValue = math
          .multiply(math.fraction(fraction), batches)
          .toFraction(true);
        newData = item.replace(regex, `${newValue} `);

        //checks if the amount has increased to a value higher than 1: if so changes the ingredient type to plural
        if (
          newData.match(singular) != null &&
          math.compare(math.fraction(newValue), 1).toFraction(true) == 1
        ) {
          let newString = newData.match(singular);
          let pluralString = "";
          if (newString[0].toString() === "bunch") {
            pluralString = newString[0].toString() + "es";
          } else {
            pluralString = newString[0].toString() + "s";
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
    directions += `<li>${data}</li>`;
  });

  let content = `<div class='recipe'>
  <div class=title>
    ${title}
    </div>
    <div class=ingredients>
    <h3>Ingredients:</h3>
    ${ingredients}
    </div>
    <br>
    <div class=directions>
    <h3>Directions:</h3>
    <ol>
    ${directions}
    </ol>
    </div>
    <br>
    <div class=servings>
    <p>Servings: ${data.servings * batches}</p>
    </div>
    <br>
    <div class=changeBatch>
    <h3>Change batch size:</h3>
    <button id='1' class='button'>x1</button>
    <button id='2' class='button'>x2</button>
    <button id='3' class='button'>x3</button>
    <button id='4' class='button'>x4</button>
    </div>
    </div>`;

  mainContent.insertAdjacentHTML("beforeend", content);

  document.querySelectorAll(".button").forEach((e) => {
    e.addEventListener("click", () => {
      displaySingleRecipe(currentID, e.id);
    });
  });
};

//checks the category heading clicked then maps through recipes with that category type and displays them
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

//fetches the JSON data on page load
window.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

categoryBtn.forEach((e) => {
  e.addEventListener("click", () => {
    displayData(e.innerHTML.toLowerCase());
  });
});
