const STORAGE_KEYS = {
    'main-course': 'kcc_added_main-course',
    'desserts':    'kcc_added_desserts',
    'appetizer':   'kcc_added_appetizer'
};

const PAGE_URLS = {
    'main-course': 'main course.html',
    'desserts':    'Desserts.html',
    'appetizer':   'appetizer.html'
};

const CATEGORY_LABELS = {
    'main-course': '🍽️ Main Course',
    'desserts':    '🍰 Desserts',
    'appetizer':   '🥗 Appetizer'
};

/* =========================
   Detect Category
========================= */
function getCurrentCategory() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('dessert'))   return 'desserts';
    if (path.includes('main'))      return 'main-course';
    if (path.includes('appetizer')) return 'appetizer';
    return null;
}

/* =========================
   Add Edit Buttons
========================= */
function addEditButtons() {
    const category = getCurrentCategory();
    if (!category) return;

    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'Admin') return;

    document.querySelectorAll('.user-recipe[data-name]').forEach(function(div) {
        const heading = div.querySelector('h1') || div.querySelector('h2');
        if (!heading) return;

        const oldBtn = heading.querySelector('.edit-recipe-btn');
        if (oldBtn) oldBtn.remove();

        const recipeName = (div.getAttribute('data-name') || '').trim();
        if (!recipeName) return;

        const btn = document.createElement('a');
        btn.className   = 'edit-recipe-btn';
        btn.textContent = '✏️';
        btn.title       = 'Edit ' + recipeName;
        btn.href = 'edit.html?name=' + encodeURIComponent(recipeName) + '&cat=' + encodeURIComponent(category);

        btn.addEventListener('click', function() {

            
            var ingredientsText = Array.from(div.querySelectorAll('ul li'))
                .map(li => li.innerText.trim())
                .join('\n');

            
            var stepsText = Array.from(div.querySelectorAll('ol > li'))
                .map(li => li.innerText.replace(/\s+/g, ' ').trim())
                .join('\n');

            var imgEl = div.querySelector('img');
            var imgSrc = (imgEl && imgEl.src) ? imgEl.src : '';

            sessionStorage.setItem('kcc_edit_prefill', JSON.stringify({
                name        : recipeName,
                category    : category,
                ingredients : ingredientsText,
                steps       : stepsText,
                imgSrc      : imgSrc
            }));
        });

        heading.appendChild(btn);
    });
}

/* =========================
   Globals
========================= */
let currentName     = '';
let currentCategory = '';
let currentRecipes  = [];
let currentIndex    = -1;
let newImgBase64    = '';

/* =========================
   Init Edit Page
========================= */
function initEditPage() {
    const params    = new URLSearchParams(window.location.search);
    currentName     = decodeURIComponent(params.get('name') || '');
    currentCategory = decodeURIComponent(params.get('cat')  || '');

    if (!currentName || !currentCategory || !STORAGE_KEYS[currentCategory]) {
        showNotFound(); return;
    }

    currentRecipes = JSON.parse(localStorage.getItem(STORAGE_KEYS[currentCategory]) || '[]');
    currentIndex   = currentRecipes.findIndex(r => r.name === currentName);

    if (currentIndex === -1) {
        document.getElementById('category-badge').textContent = CATEGORY_LABELS[currentCategory];
        document.getElementById('recipe-name').value = currentName;

        var prefillRaw = sessionStorage.getItem('kcc_edit_prefill');
        if (prefillRaw) {
            try {
                var prefill = JSON.parse(prefillRaw);
                document.getElementById('ingredients').value = prefill.ingredients || '';
                document.getElementById('steps').value       = prefill.steps       || '';

                if (prefill.imgSrc) {
                    document.getElementById('current-img-wrap').style.display = 'flex';
                    document.getElementById('current-img').src = prefill.imgSrc;
                }
            } catch(e) {}
            sessionStorage.removeItem('kcc_edit_prefill');
        }
    } else {
        loadRecipeIntoForm(currentRecipes[currentIndex]);
    }

    // image preview
    document.getElementById('recipe-image')?.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            newImgBase64 = e.target.result;
            const preview = document.getElementById('img-preview');
            preview.src = newImgBase64;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });
}

/* =========================
   Load Recipe
========================= */
function loadRecipeIntoForm(recipe) {
    document.getElementById('category-badge').textContent = CATEGORY_LABELS[recipe.category];
    document.getElementById('recipe-name').value  = recipe.name;
    document.getElementById('ingredients').value  = recipe.ingredients;
    document.getElementById('steps').value        = recipe.steps;

    if (recipe.imgBase64) {
        document.getElementById('current-img-wrap').style.display = 'flex';
        document.getElementById('current-img').src = recipe.imgBase64;
    }
}

/* =========================
   Save Edit
========================= */
function saveEdit() {
    const newName  = document.getElementById('recipe-name').value.trim();
    const newIng   = document.getElementById('ingredients').value.trim();
    const newSteps = document.getElementById('steps').value.trim();

    if (!newName || !newIng || !newSteps) {
        return showToast('⚠️ All fields are required!');
    }

    const oldRecipe  = currentRecipes[currentIndex] || {};
    const finalImage = newImgBase64 || oldRecipe.imgBase64 || '';

    const updatedRecipe = {
        name: newName,
        ingredients: newIng,
        steps: newSteps,
        imgBase64: finalImage,
        category: currentCategory
    };

    if (currentIndex !== -1) {
        currentRecipes[currentIndex] = updatedRecipe;
        localStorage.setItem(STORAGE_KEYS[currentCategory], JSON.stringify(currentRecipes));
    } else {
        var key = 'kcc_override_' + currentCategory;
        var overrides = JSON.parse(localStorage.getItem(key) || '{}');
        overrides[currentName] = updatedRecipe;
        localStorage.setItem(key, JSON.stringify(overrides));
    }

    showToast('✅ Updated!');
    setTimeout(() => window.location.href = PAGE_URLS[currentCategory], 1200);
}

/* =========================
   Apply Overrides (FIXED)
========================= */
function applyOverrides() {
    var category = getCurrentCategory();
    if (!category) return;

    var overrides = JSON.parse(localStorage.getItem('kcc_override_' + category) || '{}');

    document.querySelectorAll('.user-recipe[data-name]').forEach(function(div) {
        var name = div.getAttribute('data-name');
        var updated = overrides[name];
        if (!updated) return;

        // ingredients
        var ul = div.querySelector('ul');
        if (ul) {
            ul.innerHTML = updated.ingredients
                .split('\n')
                .filter(Boolean)
                .map(x => `<li>${x}</li>`)
                .join('');
        }

        // FIXED steps
        var ol = div.querySelector('ol');
        if (ol) {
            ol.innerHTML = updated.steps
                .split('\n')
                .filter(Boolean)
                .map(x => `<li>${x}</li>`)
                .join('');
        }

        // name
        div.setAttribute('data-name', updated.name);

        // image
        if (updated.imgBase64) {
            var img = div.querySelector('img');
            if (img) img.src = updated.imgBase64;
        }
    });
}

/* =========================
   Utils
========================= */
function showToast(msg) {
    const toast = document.getElementById('edit-toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.style.display = 'none', 2500);
}

function showNotFound() {
    document.getElementById('edit-form').style.display = 'none';
    document.getElementById('not-found').style.display = 'block';
}

/* =========================
   Init
========================= */
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('edit-form')) {
        initEditPage();
    } else {
        applyOverrides();
        addEditButtons();
    }
});