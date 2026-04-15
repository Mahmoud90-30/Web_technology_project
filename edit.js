const STORAGE_KEYS = {
    'main-course': 'kcc_added_main-course',
    'desserts':    'kcc_added_desserts',
    'appetizer':   'kcc_added_appetizer'
};

const PAGE_URLS = {
    'main-course': 'main_course.html',
    'desserts':    'Desserts.html',
    'appetizer':   'appetizer.html'
};

const CATEGORY_LABELS = {
    'main-course': '🍽️ Main Course',
    'desserts':    '🍰 Desserts',
    'appetizer':   '🥗 Appetizer'
};


function getCurrentCategory() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('dessert'))   return 'desserts';
    if (path.includes('main'))      return 'main-course';
    if (path.includes('appetizer')) return 'appetizer';
    return null;
}

function addEditButtons() {
    const category = getCurrentCategory();
    if (!category) return;

    const skipIds      = ['user-recipes-section','topBtn','results','top-bar'];
    const skipClasses  = ['navbar','footer','footer-content','recipe-links',
                          'main-course-links','recipe-container','recipe',
                          'TopButton','search-box','TRENDING','food-container',
                          'container','scroll-box','links','scroll-box'];

    document.querySelectorAll('body div').forEach(function(div) {
        if (skipIds.some(function(s){ return div.id === s; })) return;
        if (skipClasses.some(function(s){ return div.classList.contains(s); })) return;

        const heading = div.querySelector(':scope > h1, :scope > h2');
        if (!heading) return;
        if (heading.querySelector('.edit-recipe-btn')) return;

        const rawText    = heading.innerText || heading.textContent || '';
        const recipeName = rawText.replace(/\s+/g,' ').trim();
        if (!recipeName || recipeName.length < 2) return;

        const btn = document.createElement('a');
        btn.className   = 'edit-recipe-btn';
        btn.textContent = '✏️ Edit';
        btn.href = 'edit.html?name=' + encodeURIComponent(recipeName) + '&cat=' + encodeURIComponent(category);

        btn.addEventListener('click', function() {
            // جيب الـ ingredients من كل الـ ul li
            var ingredientItems = div.querySelectorAll('ul li');
            var ingredientsText = Array.from(ingredientItems).map(function(li) {
                return li.innerText.trim();
            }).join('\n');

            // جيب الـ steps من الـ ol > li بس من غير الـ nested
            var stepItems = div.querySelectorAll('ol > li');
            var stepsText = Array.from(stepItems).map(function(li) {
                var clone = li.cloneNode(true);
                var nested = clone.querySelectorAll('ul, ol');
                nested.forEach(function(n){ n.remove(); });
                return clone.innerText.trim();
            }).join('\n');

            // جيب الصورة لو موجودة
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


let currentName     = '';
let currentCategory = '';
let currentRecipes  = [];
let currentIndex    = -1;
let newImgBase64    = '';

function initEditPage() {
    const params    = new URLSearchParams(window.location.search);
    currentName     = decodeURIComponent(params.get('name') || '');
    currentCategory = decodeURIComponent(params.get('cat')  || '');

    if (!currentName || !currentCategory || !STORAGE_KEYS[currentCategory]) {
        showNotFound(); return;
    }

    currentRecipes = JSON.parse(localStorage.getItem(STORAGE_KEYS[currentCategory]) || '[]');
    currentIndex   = currentRecipes.findIndex(function(r){ return r.name === currentName; });

    if (currentIndex === -1) {
        // وصفة أصلية — نجيب بياناتها من sessionStorage
        const badge = document.getElementById('category-badge');
        if (badge) badge.textContent = CATEGORY_LABELS[currentCategory] || currentCategory;
        document.getElementById('recipe-name').value = currentName;

        var prefillRaw = sessionStorage.getItem('kcc_edit_prefill');
        if (prefillRaw) {
            try {
                var prefill = JSON.parse(prefillRaw);
                if (prefill.name === currentName && prefill.category === currentCategory) {
                    document.getElementById('ingredients').value = prefill.ingredients || '';
                    document.getElementById('steps').value       = prefill.steps       || '';
                    if (prefill.imgSrc) {
                        var wrap = document.getElementById('current-img-wrap');
                        var img  = document.getElementById('current-img');
                        if (wrap) wrap.style.display = 'flex';
                        if (img)  img.src = prefill.imgSrc;
                    }
                }
            } catch(e) {}
            sessionStorage.removeItem('kcc_edit_prefill');
        }
    } else {
        loadRecipeIntoForm(currentRecipes[currentIndex]);
    }

    /* image preview */
    const fileInput = document.getElementById('recipe-image');
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                newImgBase64 = e.target.result;
                const preview = document.getElementById('img-preview');
                if (preview) { preview.src = newImgBase64; preview.style.display = 'block'; }
            };
            reader.readAsDataURL(file);
        });
    }
}

function loadRecipeIntoForm(recipe) {
    const badge = document.getElementById('category-badge');
    if (badge) badge.textContent = CATEGORY_LABELS[recipe.category] || recipe.category;
    document.getElementById('recipe-name').value  = recipe.name        || '';
    document.getElementById('ingredients').value  = recipe.ingredients || '';
    document.getElementById('steps').value        = recipe.steps       || '';
    if (recipe.imgBase64) {
        const wrap = document.getElementById('current-img-wrap');
        const img  = document.getElementById('current-img');
        if (wrap) wrap.style.display = 'flex';
        if (img)  img.src = recipe.imgBase64;
    }
}

function saveEdit() {
    const newName        = document.getElementById('recipe-name').value.trim();
    const newIngredients = document.getElementById('ingredients').value.trim();
    const newSteps       = document.getElementById('steps').value.trim();

    if (!newName)        return showToast('⚠️ Recipe name cannot be empty!');
    if (!newIngredients) return showToast('⚠️ Ingredients cannot be empty!');
    if (!newSteps)       return showToast('⚠️ Steps cannot be empty!');

    if (newName !== currentName) {
        const dup = currentRecipes.findIndex(function(r){ return r.name === newName; });
        if (dup !== -1) return showToast('⚠️ Another recipe with this name already exists!');
    }

    const oldRecipe  = currentRecipes[currentIndex] || {};
    const finalImage = newImgBase64 || oldRecipe.imgBase64 || '';
    const updatedHTML = buildRecipeHTML(currentCategory, newName, finalImage, newIngredients, newSteps);

    const updatedRecipe = {
        name: newName, html: updatedHTML,
        ingredients: newIngredients, steps: newSteps,
        imgBase64: finalImage, category: currentCategory
    };

    if (currentIndex !== -1) {
        currentRecipes[currentIndex] = updatedRecipe;
    } else {
        currentRecipes.push(updatedRecipe);
    }

    localStorage.setItem(STORAGE_KEYS[currentCategory], JSON.stringify(currentRecipes));
    showToast('✅ Recipe updated successfully!');
    setTimeout(function(){ window.location.href = PAGE_URLS[currentCategory]; }, 1500);
}

function openModal()  { document.getElementById('confirm-modal').classList.add('active'); }
function closeModal() { document.getElementById('confirm-modal').classList.remove('active'); }

function confirmDelete() {
    if (currentIndex === -1) {
        closeModal();
        showToast('⚠️ Original recipes cannot be deleted.');
        return;
    }
    currentRecipes.splice(currentIndex, 1);
    localStorage.setItem(STORAGE_KEYS[currentCategory], JSON.stringify(currentRecipes));
    closeModal();
    showToast('🗑️ Recipe deleted!');
    setTimeout(function(){ window.location.href = PAGE_URLS[currentCategory]; }, 1500);
}

function showNotFound() {
    const form = document.getElementById('edit-form');
    const nf   = document.getElementById('not-found');
    if (form) form.style.display = 'none';
    if (nf)   nf.style.display  = 'block';
}

function buildRecipeHTML(category, name, imgBase64, ingredients, steps) {
    const li = function(arr){ return arr.split('\n').filter(function(x){ return x.trim(); }).map(function(x){ return '<li>'+x.trim()+'</li>'; }).join(''); };
    const heartBtn = '<button class="heart-btn"><i class="fa-regular fa-heart"></i></button>';
    const editBtn  = '<a class="edit-recipe-btn" href="edit.html?name='+encodeURIComponent(name)+'&cat='+encodeURIComponent(category)+'">✏️ Edit</a>';
    const imgTag   = imgBase64 ? '<img src="'+imgBase64+'" alt="'+name+'">' : '';

    if (category === 'desserts') return '<div class="Choco user-recipe" data-name="'+name+'" data-category="'+category+'"><h1><i>'+name+' 🍴 '+heartBtn+' '+editBtn+'</i></h1><div class="recipe-container">'+imgTag+'<div class="recipe"><h2><i>📝 Ingredients</i></h2><ul>'+li(ingredients)+'</ul><h2><i>➡️ Preparation Steps</i></h2><ol>'+li(steps)+'</ol></div></div></div>';
    if (category === 'appetizer') return '<div id="user-'+safeid(name)+'" class="user-recipe" data-name="'+name+'" data-category="'+category+'"><h2>'+name+' 🍴 '+heartBtn+' '+editBtn+'</h2>'+imgTag+'<h3>📝 Ingredients</h3><ul>'+li(ingredients)+'</ul><h3>➡️ Preparation Steps</h3><ol>'+li(steps)+'</ol></div>';
    if (category === 'main-course') return '<div class="Warak3nab user-recipe" data-name="'+name+'" data-category="'+category+'"><h1><i>'+name+' 🍴 '+heartBtn+' '+editBtn+'</i></h1>'+imgTag+'<h2><i>📝 Ingredients</i></h2><ul>'+li(ingredients)+'</ul><h2><i>➡️ Preparation Steps</i></h2><ol>'+li(steps)+'</ol></div>';
    return '';
}

function safeid(name) { return name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''); }

function showToast(msg) {
    const toast = document.getElementById('edit-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function(){ toast.style.display = 'none'; }, 2500);
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('edit-form')) {
        initEditPage();   
    } else {
        addEditButtons();
    }
});