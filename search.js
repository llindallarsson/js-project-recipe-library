// Search recipes
export const searchRecipes = (allRecipes, displayFilteredSortedRecipes) => {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase();

  const searchedRecipes = allRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm)
  );
  displayFilteredSortedRecipes(searchedRecipes);
}