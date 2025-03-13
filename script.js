const recipeSection = document.querySelector('.recipe-card-section');
const recipeCount = document.querySelector('.recipe-count');
const filterCheckboxes = document.querySelectorAll('input[name="filter"]');
const sortRadioButtons = document.querySelectorAll('input[name="sort"]');
const randomRecipeButton = document.querySelector('.random-recipe-button');

const apiKey = 'd003d333cdad4f2ab6b218a0b87d79f2';
const baseURL = 'https://api.spoonacular.com/recipes/complexSearch';
const localStorageKey = 'recipeLibraryCache'; // Key for local storage
const availableFilters = ["Mediterranean", "Middle Eastern", "Asian", "Italian", "Mexican", "European"];

let allRecipes = [];

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
    const url = `${baseURL}?number=100&apiKey=${apiKey}&instructionsRequired=true&addRecipeInformation=true&cuisine=Mediterranean,Middle Eastern,Asian,Italian,Mexican,European`;
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

  recipeArray.forEach(recipe => {
    const article = document.createElement('article');
    article.classList.add('recipe-card');

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
    button.addEventListener('click', () => {
      handleLikeClick(index);
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
  if (selectedFilters.length > 0) {
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
  createRecipeCard(sortedRecipes); // Display all recipes
  updateRecipeCount(sortedRecipes.length);
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
  // Filter recipes that have a matching cuisine
  const filteredRecipes = allRecipes.filter(recipe => recipe.firstMatchingCuisine !== '');

  if (filteredRecipes.length === 0) {
    console.log("No recipes with matching cuisines found.");
    return; // Exit if no matching recipes are found
  }

  const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
  const randomRecipe = filteredRecipes[randomIndex];
  createRecipeCard([randomRecipe]);
  updateRecipeCount(1);
}

randomRecipeButton.addEventListener('click', ShowRandomRecipe);

// Function to handle like button clicks
const handleLikeClick = (recipeIndex) => {
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

fetchRecipes();