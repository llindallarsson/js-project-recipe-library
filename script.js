const recipeSection = document.querySelector('.recipe-card-section');
const recipeCount = document.querySelector('.recipe-count');
const filterCheckboxes = document.querySelectorAll('input[name="filter"]');
const sortRadioButtons = document.querySelectorAll('input[name="sort"]');
const randomRecipeButton = document.querySelector('.random-recipe-button');
const favoriteRecipeButton = document.getElementById('favorite-recipe-button');
// const clearFiltersButton = document.getElementById('clear-filters-button');


const apiKey = 'd003d333cdad4f2ab6b218a0b87d79f2';
const baseURL = 'https://api.spoonacular.com/recipes/complexSearch';
const localStorageKey = 'recipeLibraryCache'; // Key for local storage
const availableFilters = ["Mediterranean", "Middle Eastern", "Asian", "Italian", "Mexican", "European"];

let allRecipes = [];
let currentFilter = 'all'; // 'all', 'random', 'favorites'

// Helper function to find the first matching cuisine
const findFirstMatchingCuisine = (recipeCuisines) => {
  if (!recipeCuisines || recipeCuisines.length === 0) {
    return ''; // Return empty string if no cuisines
  }

  for (const cuisine of recipeCuisines) {
    if (availableFilters.includes(cuisine)) {
      return cuisine; // Return the first cuisine that matches an available filter
    }
  }
  return ''; // Return empty string if no cuisine matches an available filter
};

const fetchRecipes = () => {
  const cachedRecipes = localStorage.getItem(localStorageKey);

  if (cachedRecipes) {
    // If data is in local storage, use it
    allRecipes = JSON.parse(cachedRecipes);
    console.log('Recipes loaded from cache');
    console.log('Cached Recipes:', allRecipes); // Log the cached data
    displayFilteredSortedRecipes(allRecipes);
  } else {
    // If data is not in local storage, fetch from API
    const url = `${baseURL}?number=15&apiKey=${apiKey}&instructionsRequired=true&addRecipeInformation=true&fillIngredients=true&cuisine=Mediterranean,Middle Eastern,Asian,Italian,Mexican,European`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        allRecipes = data.results.map(recipe => {
          // Find the first matching cuisine or an empty string if there are no matches
          const firstMatchingCuisine = findFirstMatchingCuisine(recipe.cuisines);
          return { ...recipe, firstMatchingCuisine, isLiked: false }; // Add isLiked property
        });
        console.log('Recipes loaded from API');
        // Store the data in local storage
        localStorage.setItem(localStorageKey, JSON.stringify(allRecipes));
        console.log('Recipes stored in cache:', allRecipes); // Log the data being stored
        displayFilteredSortedRecipes(allRecipes);
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
      });
  }
};

const createRecipeCard = (recipeArray) => {
  const fragment = document.createDocumentFragment();

  recipeArray.forEach((recipe, index) => {
    const article = document.createElement('article');
    article.classList.add('recipe-card');
    // Add data-index attribute to the article
    article.setAttribute('data-index', index);

    const isFilled = recipe.isLiked ? 'filled' : ''; // Determine if the heart should be filled


    article.innerHTML = `
  <div class="recipe-content">
      <div class="recipe-media">
            <img src="${recipe.image}" alt="${recipe.title}">
      </div>
       <div class="recipe-data">
      <h3>${recipe.title}</h3>
      <hr>
      <div class="recipe-info">
            <p><b>Cuisine:</b> ${recipe.firstMatchingCuisine}</p>
            <p><b>Time:</b> ${recipe.readyInMinutes} minutes</p>
            <p><b>Amount of ingredients:</b> ${recipe.extendedIngredients?.length}</p>
      </div>
      <div class="like-container">
              <span class="material-symbols-outlined like-button ${isFilled}">favorite</span>
              <p class="like-count">${recipe.aggregateLikes} likes</p>
      </div>
    </div>
  </div>
    `;

    fragment.appendChild(article);
  });

  recipeSection.innerHTML = '';
  recipeSection.appendChild(fragment);

  // Add event listeners to like buttons after they are created
  const likeButtons = document.querySelectorAll('.like-button');
  likeButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
      handleLikeClick(index, event);
    });
  });

  // Add event listeners to recipe cards after they are created
  const recipeCards = document.querySelectorAll('.recipe-card');
  recipeCards.forEach(card => {
    card.addEventListener('click', () => {
      const index = card.getAttribute('data-index');
      handleRecipeCardClick(index);
    });
  });
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

  if (currentFilter === 'random') {
    filteredRecipes = allRecipes.filter(recipe => recipe.firstMatchingCuisine !== '');
    const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
    filteredRecipes = [filteredRecipes[randomIndex]];
  } else if (currentFilter === 'favorites') {
    filteredRecipes = allRecipes.filter(recipe => recipe.isLiked);
  } else if (selectedFilters.length > 0) {
    filteredRecipes = allRecipes.filter(recipe => {
      return recipe.cuisines.some(cuisine => selectedFilters.includes(cuisine));
    });
  } else {
    filteredRecipes = allRecipes;
  }
  return filteredRecipes;
};

// Sort recipes
const sortRecipes = (recipes) => {
  const selectedSort = Array.from(sortRadioButtons).find(radioButton => radioButton.checked);

  if (selectedSort) {
    const sortValue = selectedSort.value;

    if (sortValue === 'mostPopularRecipes') {
      recipes.sort((a, b) => b.aggregateLikes - a.aggregateLikes);
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
  createRecipeCard(sortedRecipes); // Display all recipes
  updateRecipeCount(sortedRecipes.length);
};

// Event listeners
filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    currentFilter = 'all';
    randomRecipeButton.classList.remove('active');
    favoriteRecipeButton.classList.remove('active');
    displayFilteredSortedRecipes(allRecipes)
    randomRecipeButton.textContent = "Surprise me";
    favoriteRecipeButton.textContent = "My favorites recipes";
  });
});

sortRadioButtons.forEach(radioButton => {
  radioButton.addEventListener('change', () => displayFilteredSortedRecipes(allRecipes));
});

// Random recipe
const ShowRandomRecipe = () => {
  if (currentFilter === 'random') {
    currentFilter = 'all';
    randomRecipeButton.classList.remove('active');
    randomRecipeButton.textContent = "Random Recipe";
  } else {
    currentFilter = 'random';
    randomRecipeButton.classList.add('active');
    favoriteRecipeButton.classList.remove('active');
    randomRecipeButton.textContent = "Show All Recipes";
  }
  displayFilteredSortedRecipes(allRecipes);
}

randomRecipeButton.addEventListener('click', ShowRandomRecipe);

// Function to handle like button clicks
const handleLikeClick = (recipeIndex, event) => {
  event.stopPropagation(); // Prevent event bubbling

  const recipe = allRecipes[recipeIndex];
  const likeButton = document.querySelectorAll('.like-button')[recipeIndex];
  const likeCountElement = document.querySelectorAll('.like-count')[recipeIndex];

  if (recipe.isLiked) {
    recipe.aggregateLikes--; // Decrement the like count
    likeButton.classList.remove('filled'); // Remove the filled class
  } else {
    recipe.aggregateLikes++; // Increment the like count
    likeButton.classList.add('filled'); // Add the filled class
  }

  recipe.isLiked = !recipe.isLiked; // Toggle the isLiked state

  likeCountElement.textContent = `${recipe.aggregateLikes} likes`; // Update the like count in the UI

  // Update local storage
  localStorage.setItem(localStorageKey, JSON.stringify(allRecipes));
};

// Function to handle recipe card clicks
const handleRecipeCardClick = (recipeIndex) => {
  const recipe = allRecipes[recipeIndex];
  if (recipe && recipe.sourceUrl) {
    window.open(recipe.sourceUrl, '_blank'); // Open the URL in a new tab
  } else {
    console.error('Recipe or source URL not found.');
  }
};

// Function to display only liked recipes
const showLikedRecipes = () => {
  if (currentFilter === 'favorites') {
    currentFilter = 'all';
    favoriteRecipeButton.classList.remove('active');
    favoriteRecipeButton.textContent = "My Favorites Recipes";
  } else {
    currentFilter = 'favorites';
    favoriteRecipeButton.classList.add('active');
    randomRecipeButton.classList.remove('active');
    favoriteRecipeButton.textContent = "Show All Recipes";
  }
  displayFilteredSortedRecipes(allRecipes);
};

// Event listener for the favorite recipe button
favoriteRecipeButton.addEventListener('click', showLikedRecipes);


fetchRecipes();


