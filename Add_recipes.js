/* ============================================================
   Add_recipes.js  –  Kitchen Chaos Club
   ============================================================ */

/* ---------- Image preview ---------- */
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

/* ---------- Validation & entry point ---------- */
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

/* ---------- Storage keys (must match each page's load script) ---------- */
const STORAGE_KEYS = {
    'main-course' : 'kcc_added_main-course',
    'desserts'    : 'kcc_added_desserts',
    'appetizer'   : 'kcc_added_appetizer'
};

const PAGE_URLS = {
    'main-course' : 'main course.html',
    'desserts'    : 'Desserts.html',
    'appetizer'   : 'appetizer.html'
};

/* ---------- Save ---------- */
function saveRecipe(category, name, imgBase64, ingredients, steps) {
    const recipeHTML = buildRecipeHTML(category, name, imgBase64, ingredients, steps);

    const key   = STORAGE_KEYS[category];
    const saved = JSON.parse(localStorage.getItem(key) || '[]');

    // prevent duplicate names
    const dupIndex = saved.findIndex(r => r.name === name);
    if (dupIndex !== -1) {
        showToast('⚠️ A recipe with this name already exists!');
        return;
    }

    saved.push({
        name,
        html       : recipeHTML,
        ingredients,
        steps,
        imgBase64,
        category
    });
    localStorage.setItem(key, JSON.stringify(saved));

    showToast('✅ Recipe added successfully!');
    setTimeout(() => { window.location.href = PAGE_URLS[category]; }, 1500);
}

/* ---------- Build recipe HTML (matches each page's card structure) ---------- */
function buildRecipeHTML(category, name, imgBase64, ingredients, steps) {
    const ingredientsHTML = ingredients
        .split('\n').filter(i => i.trim())
        .map(i => `<li>${i.trim()}</li>`).join('');

    const stepsHTML = steps
        .split('\n').filter(s => s.trim())
        .map(s => `<li>${s.trim()}</li>`).join('');

    const heartBtn = `<button class="heart-btn"><i class="fa-regular fa-heart"></i></button>`;
    const editBtn  = `<a class="edit-recipe-btn" href="edit.html?name=${encodeURIComponent(name)}&cat=${encodeURIComponent(category)}" title="Edit ${name}">✏️</a>`;

    const imgTag = imgBase64
    ? `<img src="${imgBase64}" alt="${name}" style="float:right; width:400px; height:400px; object-fit:cover; border-radius:20px; margin:0 0 20px 30px;">`
    : '';

    if (category === 'desserts') {
        return `
<div class="Choco user-recipe" data-name="${name}" data-category="${category}">
    <h1><i>${name} 🍴 ${heartBtn} ${editBtn}</i></h1>
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
<div id="user-${safeid(name)}" class="user-recipe" data-name="${name}" data-category="${category}">
    <h2>${name} 🍴 ${heartBtn} ${editBtn}</h2>
    ${imgTag}
    <h3>📝 Ingredients</h3>
    <ul>${ingredientsHTML}</ul>
    <h3>➡️ Preparation Steps</h3>
    <ol>${stepsHTML}</ol>
</div>`;
    }

    if (category === 'main-course') {
        return `
<div class="Warak3nab user-recipe" data-name="${name}" data-category="${category}">
    <h1><i>${name} 🍴 ${heartBtn} ${editBtn}</i></h1>
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

/* ---------- Toast ---------- */
function showToast(msg) {
    const toast = document.getElementById('add-toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.display = 'none'; }, 2500);
}