const recipeSection = document.querySelector('.recipe-card-section');
const recipeCount = document.querySelector('.recipe-count');
const filterCheckboxes = document.querySelectorAll('input[name="filter"]');
const sortRadioButtons = document.querySelectorAll('input[name="sort"]');
const randomRecipeButton = document.querySelector('.random-recipe-button');

const apiKey = 'd003d333cdad4f2ab6b218a0b87d79f2';
const baseURL = 'https://api.spoonacular.com/recipes/complexSearch';

let allRecipes = [];

const fetchRecipes = () => {
  const url = `${baseURL}?number=100&apiKey=${apiKey}&instructionsRequired=true&addRecipeInformation=true&cuisine=Mediterranean,Middle Eastern,Asian,Italian,Mexican,European`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      allRecipes = data.results;
      console.log('all data', allRecipes);
      displayInitialRecipes(allRecipes); // Display initial recipes
    })
    .catch((error) => {
      console.error('Error fetching recipes:', error);
    });
};

// Function to display the initial 7 recipes
const displayInitialRecipes = (recipes) => {
  const initialRecipes = recipes.slice(0, 7);
  createRecipeCard(initialRecipes);
  updateRecipeCount(initialRecipes.length);
};

const createRecipeCard = (recipeArray) => {
  const fragment = document.createDocumentFragment();

  recipeArray.forEach(recipe => {
    const article = document.createElement('article');
    article.classList.add('recipe-card');

    article.innerHTML = `
  <div class="recipe-content">
      <div class="recipe-media">
            <img src="${recipe.image}" alt="${recipe.title}">
      </div>
       <div class="recipe-data">
      <h3>${recipe.title}</h3>
      <hr>
      <div class="recipe-info">
            <p><b>Cuisine:</b> ${recipe.pricePerServing}kr</p>
            <p><b>Time:</b> ${recipe.readyInMinutes} minutes</p>
      </div>
    </div>
  </div>
    `;

    fragment.appendChild(article);
  });

  recipeSection.innerHTML = '';
  recipeSection.appendChild(fragment);
};

const updateRecipeCount = (count) => {
  recipeCount.innerHTML = `Recipes (${count})`;
}

// Filter recipes
const filterRecipes = () => {
  const selectedFilters = Array.from(filterCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  let filteredRecipes = allRecipes;
  if (selectedFilters.length > 0) {
    filteredRecipes = allRecipes.filter(recipe =>
      selectedFilters.some(filter => recipe.cuisines.includes(filter))
    );
  }
  return filteredRecipes;
};

// Sort recipes
const sortRecipes = (recipes) => {
  const selectedSort = Array.from(sortRadioButtons).find(radioButton => radioButton.checked);

  if (selectedSort) {
    const sortValue = selectedSort.value;

    if (sortValue === 'mostPopularRecipes') {
      recipes.sort((a, b) => b.popularity - a.popularity);
    } else if (sortValue === 'shortestCookingTime') {
      recipes.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
    } else if (sortValue === 'fewestIngredients') {
      recipes.sort((a, b) => a.extendedIngredients.length - b.extendedIngredients.length);
    }
  }
  return recipes
};

// Function to display filtered and sorted recipes
const displayFilteredSortedRecipes = (recipes) => {
  const filteredRecipes = filterRecipes();
  const sortedRecipes = sortRecipes(filteredRecipes);
  const recipesToDisplay = sortedRecipes.slice(0, 7);
  createRecipeCard(recipesToDisplay);
  updateRecipeCount(recipesToDisplay.length);
};

// Event listeners
filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => displayFilteredSortedRecipes(allRecipes));
});

sortRadioButtons.forEach(radioButton => {
  radioButton.addEventListener('change', () => displayFilteredSortedRecipes(allRecipes));
});

// Random recipe
const ShowRandomRecipe = () => {
  const randomIndex = Math.floor(Math.random() * allRecipes.length);
  const randomRecipe = allRecipes[randomIndex];
  createRecipeCard([randomRecipe]);
  updateRecipeCount(1);
}

randomRecipeButton.addEventListener('click', ShowRandomRecipe);

displayFilteredSortedRecipes(allRecipes)
fetchRecipes();