const apiURL = 'https://www.themealdb.com/api/json/v1/1';

const categoryMapping = {
    Breakfast: 'Breakfast',
    Lunch: 'Miscellaneous',
    Dinner: 'Miscellaneous',
    'Side-dish': 'Side',
    Dessert: 'Dessert',
    Snack: 'Miscellaneous',
};

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        const userCategory = button.getAttribute('data-category');
        const apiCategory = categoryMapping[userCategory];
        fetchRecipesByCategory(apiCategory);
    });
});

document.getElementById('surpriseMe').addEventListener('click', () => {
    fetch(`${apiURL}/random.php`)
        .then(response => response.json())
        .then(data => displayRecipe(data.meals[0]))
        .catch(error => console.error('Error:', error));
});

function fetchRecipesByCategory(category) {
    fetch(`${apiURL}/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];
                fetch(`${apiURL}/lookup.php?i=${randomMeal.idMeal}`)
                    .then(response => response.json())
                    .then(data => displayRecipe(data.meals[0]))
                    .catch(error => console.error('Error:', error));
            } else {
                document.getElementById('recipeContainer').innerHTML = `<p class="text-danger">No recipes found for this category.</p>`;
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayRecipe(meal) {
    const recipeContainer = document.getElementById('recipeContainer');
    recipeContainer.innerHTML = `
        <div class="card">
            <div class="row no-gutters">
                <div class="col-md-4">
                    <img src="${meal.strMealThumb}" class="card-img" alt="${meal.strMeal}" style="max-width: 100%;">
                    <div class="text-center mt-4">
                        <p><strong>Tags:</strong> ${meal.strTags || 'N/A'}</p>
                        <p><strong>Area:</strong> ${meal.strArea}</p>
                        <p><strong>Category:</strong> ${meal.strCategory}</p>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <h6>Ingredients</h6>
                        <ul>${getIngredientsList(meal)}</ul>
                        <h6>Instructions</h6>
                        <ol>${getInstructionsList(meal)}</ol>
                        <a href="${meal.strYoutube}" class="btn btn-primary" target="_blank">Watch Video Tutorial</a>
                        <a href="${meal.strSource}" class="btn btn-secondary" target="_blank">Food Blog Source</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getIngredientsList(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal['strIngredient' + i];
        const measure = meal['strMeasure' + i];
        if (ingredient) {
            ingredientsList += `<li>${measure} - ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
}

function getInstructionsList(meal) {
    const instructions = meal.strInstructions.split(/\r\n|\n/);
    return instructions.map(instruction => instruction.trim()).filter(instruction => instruction).map(instruction => `<li>${instruction}</li>`).join('');
}
