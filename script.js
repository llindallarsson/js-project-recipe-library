
const recipe = [
  {
    id: 1,
    title: "Vegan Lentil Soup",
    image: "img/ella-olsson-mmnKI8kMxpc-unsplash.jpg",
    readyInMinutes: 30,
    servings: 4,
    sourceUrl: "https://example.com/vegan-lentil-soup",
    diets: ["vegan"],
    cuisine: "Mediterranean",
    ingredients: [
      "red lentils",
      "carrots",
      "onion",
      "garlic",
      "tomato paste",
      "cumin",
      "paprika",
      "vegetable broth",
      "olive oil",
      "salt"
    ],
    pricePerServing: 2.5,
    popularity: 85
  },
  {
    id: 2,
    title: "Vegetarian Pesto Pasta",
    image: "img/ella-olsson-mmnKI8kMxpc-unsplash.jpg",
    readyInMinutes: 25,
    servings: 2,
    sourceUrl: "https://example.com/vegetarian-pesto-pasta",
    diets: ["vegetarian"],
    cuisine: "Italian",
    ingredients: [
      "pasta",
      "basil",
      "parmesan cheese",
      "garlic",
      "pine nuts",
      "olive oil",
      "salt",
      "black pepper"
    ],
    pricePerServing: 3.0,
    popularity: 92
  },
  {
    id: 3,
    title: "Gluten-Free Chicken Stir-Fry",
    image: "img/ella-olsson-mmnKI8kMxpc-unsplash.jpg",
    readyInMinutes: 20,
    servings: 3,
    sourceUrl: "https://example.com/gluten-free-chicken-stir-fry",
    diets: ["gluten-free"],
    cuisine: "Asian",
    ingredients: [
      "chicken breast",
      "broccoli",
      "bell pepper",
      "carrot",
      "soy sauce (gluten-free)",
      "ginger",
      "garlic",
      "sesame oil",
      "cornstarch",
      "green onion",
      "sesame seeds",
      "rice"
    ],
    pricePerServing: 4.0,
    popularity: 78
  },
  {
    id: 4,
    title: "Dairy-Free Tacos",
    image: "img/ella-olsson-mmnKI8kMxpc-unsplash.jpg",
    readyInMinutes: 15,
    servings: 2,
    sourceUrl: "https://example.com/dairy-free-tacos",
    diets: ["dairy-free"],
    cuisine: "Mexican",
    ingredients: [
      "corn tortillas",
      "ground beef",
      "taco seasoning",
      "lettuce",
      "tomato",
      "avocado"
    ],
    pricePerServing: 2.8,
    popularity: 88
  },
  {
    id: 5,
    title: "Middle Eastern Hummus",
    image: "img/ella-olsson-mmnKI8kMxpc-unsplash.jpg",
    readyInMinutes: 10,
    servings: 4,
    sourceUrl: "https://example.com/middle-eastern-hummus",
    diets: ["vegan", "gluten-free"],
    cuisine: "Middle Eastern",
    ingredients: [
      "chickpeas",
      "tahini",
      "garlic",
      "lemon juice",
      "olive oil"
    ],
    pricePerServing: 1.5,
    popularity: 95
  },
  {
    id: 6,
    title: "Quick Avocado Toast",
    image: "img/ella-olsson-mmnKI8kMxpc-unsplash.jpg",
    readyInMinutes: 5,
    servings: 1,
    sourceUrl: "https://example.com/quick-avocado-toast",
    diets: ["vegan"],
    cuisine: "Mediterranean",
    ingredients: [
      "bread",
      "avocado",
      "lemon juice",
      "salt"
    ],
    pricePerServing: 2.0,
    popularity: 90
  },
  {
    id: 7,
    title: "Beef Stew",
    image: "img/ella-olsson-mmnKI8kMxpc-unsplash.jpg",
    readyInMinutes: 90,
    servings: 5,
    sourceUrl: "https://example.com/beef-stew",
    diets: [],
    cuisine: "European",
    ingredients: [
      "beef chunks",
      "potatoes",
      "carrots",
      "onion",
      "garlic",
      "tomato paste",
      "beef broth",
      "red wine",
      "bay leaves",
      "thyme",
      "salt",
      "black pepper",
      "butter",
      "flour",
      "celery",
      "mushrooms"
    ],
    pricePerServing: 5.5,
    popularity: 80
  }
]

const recipeSection = document.querySelector('.recipe-card-section');
const recipeCount = document.querySelector('.recipe-count');
const filterCheckboxes = document.querySelectorAll('input[name="filter"]');
const sortRadioButtons = document.querySelectorAll('input[name="sort"]');
const randomRecipeButton = document.querySelector('.random-recipe-button');


// Ladda recept
const loadRecipes = (recipeArrays) => {
  recipeSection.innerHTML = ' ';
  updateRecipeCount(recipeArrays.length);

  if (recipeArrays.length === 0) {
    recipeSection.innerHTML = '<p> No recipes match your criteria.</p>';
  } else {
    recipeArrays.forEach(recipe => {
      recipeSection.innerHTML += ` 
    <article class="recipe-card">
    <div class="recipe-content">

        <div class="recipe-data">
          <div class="recipe-media">
            <img src="${recipe.image}" alt="${recipe.title}">
          </div>
          <h3>${recipe.title}</h3>
          <hr>
          <div class="recipe-info">
            <p><b>Cuisine:</b> ${recipe.cuisine}</p>
            <p><b>Time:</b> ${recipe.readyInMinutes} minutes</p>
            <hr>
          </div>
          <div class="recipe-ingredients">
            <ul>
              <p><b>Ingredients</b></p>
              ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')} 
            </ul>
          </div>
        </div>
      </div>
      </article>
      `;
    });
  }
};

const updateRecipeCount = (count) => {
  recipeCount.innerHTML = `Recipes (${count})`
};

// Filtrera recept baserat på ikryssade val
const filterRecipe = () => {
  const selectedFilters = Array.from(filterCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  let filteredArray = recipe;

  if (selectedFilters.length > 0) {
    filteredArray = recipe.filter(recipe => {
      return selectedFilters.some(filter => recipe.cuisine.includes(filter));
    });
  }

  sortRecipe(filteredArray); // Efter filtrering, sortera recepten
};

// Sortera recept baserat på vald radioknapp
const sortRecipe = (filteredArray) => {
  const selectedSort = Array.from(sortRadioButtons).find(radioButton => radioButton.checked);

  if (selectedSort) {
    const sortMap = {
      mostPopularRecipes: (a, b) => b.popularity - a.popularity, // Sortera efter popularitet
      shortestCookingTime: (a, b) => a.readyInMinutes - b.readyInMinutes, // Sortera efter tid
      fewestIngredients: (a, b) => a.ingredients.length - b.ingredients.length, // Sortera efter antal ingredienser
    };

    filteredArray.sort(sortMap[selectedSort.value]); // Använd rätt sorteringsfunktion
  }

  loadRecipes(filteredArray); // Ladda de filtrerade och sorterade recepten
};

// Event-lyssnare för filter och sortering
filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', filterRecipe);
});

sortRadioButtons.forEach(radioButton => {
  radioButton.addEventListener('change', () => filterRecipe()); // Om sortering ändras, återställ filtreringen
});

// Random recipe
const ShowRandomRecipe = () => {
  const randomIndex = Math.floor(Math.random() * recipe.length);
  const randomRecipe = recipe[randomIndex];
  loadRecipes([randomRecipe]);
}

randomRecipeButton.addEventListener('click', ShowRandomRecipe)


loadRecipes(recipe); // Ladda alla recept initialt