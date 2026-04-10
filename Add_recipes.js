/* ---- preview---- */
document.getElementById('recipe-image').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const preview = document.getElementById('img-preview');
        preview.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

/* ----Add recipe---- */
function addRecipe() {
    const category    = document.getElementById('Category').value;
    const name        = document.getElementById('recipe-name').value.trim();
    const imageFile   = document.getElementById('recipe-image').files[0];
    const ingredients = document.getElementById('ingredients').value.trim();
    const steps       = document.getElementById('steps').value.trim();

    if (!category)    return showToast('⚠️ Please choose a category!');
    if (!name)        return showToast('⚠️ Please enter the recipe name!');
    if (!ingredients) return showToast('⚠️ Please enter the ingredients!');
    if (!steps)       return showToast('⚠️ Please enter the preparation steps!');

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            saveRecipe(category, name, e.target.result, ingredients, steps);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveRecipe(category, name, '', ingredients, steps);
    }
}


//save recipe
function saveRecipe(category, name, imgBase64, ingredients, steps) {
    const ingredientsList = ingredients.split('\n')
        .filter(i => i.trim())
        .map(i => '<li>' + i.trim() + '</li>')
        .join('');

    const stepsList = steps.split('\n')
        .filter(s => s.trim())
        .map(s => '<li>' + s.trim() + '</li>')
        .join('');

    const imgTag = imgBase64
        ? '<img src="' + imgBase64 + '" alt="' + name + '">'
        : '';

    const recipeHTML = `
        <div class="user-recipe">
            <h1>${name}
                <button class="heart-btn">
                    <i class="fa-regular fa-heart"></i>
                </button>
            </h1>
            ${imgTag}
            <h2>📝 Ingredients</h2>
            <ul>${ingredientsList}</ul>
            <h2>➡️ Preparation Steps</h2>
            <ol>${stepsList}</ol>
        </div>
    `;

    const key = 'kcc_added_' + category;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    saved.push({ name: name, html: recipeHTML });
    localStorage.setItem(key, JSON.stringify(saved));

    showToast('✅ Recipe added successfully!');
    setTimeout(() => {
        if (category === 'main-course')    window.location.href = 'main course.html';
        else if (category === 'desserts')  window.location.href = 'Desserts.html';
        else if (category === 'appetizer') window.location.href = 'appetizer.html';
    }, 1500);
}

function showToast(msg) {
    const toast = document.getElementById('add-toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.display = 'none'; }, 2500);
}

// Build recipe HTML — identical structure to each page's cards
function buildRecipeHTML(category, name, imgBase64, ingredients, steps) {
 
    const ingredientsHTML = ingredients
        .split('\n').filter(i => i.trim())
        .map(i => `<li>${i.trim()}</li>`).join('');
 
    const stepsHTML = steps
        .split('\n').filter(s => s.trim())
        .map(s => `<li>${s.trim()}</li>`).join('');
 
    const heartBtn = `<button class="heart-btn">
        <i class="fa-regular fa-heart"></i>
    </button>`;
 
    const imgTag = imgBase64
        ? `<img src="${imgBase64}" alt="${name}">`
        : '';
         if (category === 'desserts') {
        return `
<div class="Choco">
    <h1><i>${name} 🍴 ${heartBtn}</i></h1>
    <div class="recipe-container">
        ${imgTag}
        <div class="recipe">
            <h2><i>📝 Ingredients</i></h2>
            <ul>${ingredientsHTML}</ul>
            <h2><i>➡️ Preparation Steps</i></h2>
            <ol>${stepsHTML}</ol>
        </div>
    </div>
</div>`;
    }

      if (category === 'appetizer') {
        return `
<div id="user-${safeid(name)}">
    <h2>${name} 🍴 ${heartBtn}</h2>
    ${imgTag}
    <h3>📝 Ingredients</h3>
    <ul>${ingredientsHTML}</ul>
    <h3>➡️ Preparation Steps</h3>
    <ol>${stepsHTML}</ol>
</div>`;
    }

      if (category === 'main-course') {
        return `
<div class="Warak3nab">
    <h1><i>${name} 🍴 ${heartBtn}</i></h1>
    ${imgTag}
    <h2><i>📝 Ingredients</i></h2>
    <ul>${ingredientsHTML}</ul>
    <h2><i>➡️ Preparation Steps</i></h2>
    <ol>${stepsHTML}</ol>
</div>`;
    }
 
    return '';
}
 
function safeid(name) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

