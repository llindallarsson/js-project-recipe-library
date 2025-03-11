const recipeSection = document.querySelector('.recipe-card-section');
const recipeCount = document.querySelector('.recipe-count');
const apiKey = 'd003d333cdad4f2ab6b218a0b87d79f2';
const baseURL = 'https://api.spoonacular.com/recipes/complexSearch';

const fetchRecipes = () => {
  const url = `${baseURL}?number=7&apiKey=${apiKey}&instructionsRequired=true&addRecipeInformation=true`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      console.log('response', response);
      return response.json();
    })
    .then((data) => {
      console.log('data', data.results);
      createRecipeCard(data.results); // Call createRecipeCard here!
      updateRecipeCount(data.results.length) // call updateRecipeCount here
    })
    .catch((error) => {
      console.error('Error fetching recipes:', error);
    });
};

const createRecipeCard = (recipeArray) => {
  const fragment = document.createDocumentFragment(); // Create a DocumentFragment

  recipeArray.forEach(recipe => {
    const article = document.createElement('article');
    article.classList.add('recipe-card');

    // Use a template literal for cleaner HTML generation
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

    fragment.appendChild(article); // Append each card to the fragment
  });

  recipeSection.innerHTML = ''; // Clear previous content before appending
  recipeSection.appendChild(fragment); // Append the entire fragment at once
};

const updateRecipeCount = (count) => {
  recipeCount.innerHTML = `Recipes (${count})`;
}

fetchRecipes();


