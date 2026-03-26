
/* ============ Save and return the data ==============*/
function getFavourites() {
    return JSON.parse(localStorage.getItem('kcc_favourites') || '[]');
}
function saveFavourites(list) {
    localStorage.setItem('kcc_favourites', JSON.stringify(list));
}

/* ========= Heart btn =============== */
function initHeartButtons() {
    document.querySelectorAll('.heart-btn').forEach(btn => {
        const recipeDiv = btn.closest('div');
        if (!recipeDiv) return;

        const titleEl = recipeDiv.querySelector('h1');
        const recipeName = titleEl ? titleEl.innerText.replace(/[❤️🤍]/g, '').trim() : 'recipe';

        if (getFavourites().some(r => r.name === recipeName)) {
            activateHeart(btn);
        }

        btn.addEventListener('click', function () {
            const recipeDiv = this.closest('div');
            if (!recipeDiv) return;

            const titleEl = recipeDiv.querySelector('h1, h2');
            const recipeName = titleEl ? titleEl.innerText.replace(/[❤️🤍]/g, '').trim() : 'recipe';

            let favs = getFavourites();
            const exists = favs.some(r => r.name === recipeName);

            if (exists) {
                favs = favs.filter(r => r.name !== recipeName);
                saveFavourites(favs);
                deactivateHeart(this);
                showToast(recipeName + ' Removed from favourite💔');
            } else {
                const htmlSnapshot = recipeDiv.outerHTML;
                favs.push({ name: recipeName, html: htmlSnapshot });
                saveFavourites(favs);
                activateHeart(this);
                showToast(recipeName + ' Added to favourite ❤️');
            }
        });
    });
}



function activateHeart(btn) {
    const icon = btn.querySelector('i');
    if (icon) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
    btn.classList.add('active');
}

function deactivateHeart(btn) {
    const icon = btn.querySelector('i');
    if (icon) { icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); }
    btn.classList.remove('active');
}

function showToast(msg) {
    let toast = document.getElementById('fav-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'fav-toast';
        Object.assign(toast.style, {
            position: 'fixed', bottom: '30px', left: '50%',
            transform: 'translateX(-50%)', background: '#3a1a00',
            color: '#fff', padding: '12px 28px', borderRadius: '30px',
            fontFamily: 'Georgia,serif', fontSize: '15px',
            zIndex: '9999', opacity: '0', transition: 'opacity 0.4s',
            whiteSpace: 'nowrap'
        });
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}


function renderFavouritesPage() {
    const container = document.getElementById('favourite-list');
    if (!container) return;

    const favs = getFavourites();

    if (favs.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:80px 20px;font-family:Georgia,serif;color:#7a3b1e;font-size:20px;"><div style="font-size:60px;margin-bottom:20px;">🍽️</div><p>No favourite recipes yet!</p><p style="font-size:16px;color:#a06040;">Click the ❤️ next to any recipe to save it here.</p></div>';
        return;
    }

    container.innerHTML = favs.map(function(recipe, index) {
        return '<div class="fav-recipe-wrapper">' +
               '<div class="fav-recipe-content">' + recipe.html + '</div>' +
               '<div class="fav-remove-bar">' +
               '<button class="remove-fav-btn" onclick="removeRecipe(' + index + ')">🗑️ Remove from favourites</button>' +
               '</div><hr class="fav-divider"></div>';
    }).join('');

   
    document.querySelectorAll('.fav-recipe-content .heart-btn').forEach(function(btn) {
        activateHeart(btn);
        btn.addEventListener('click', function() {
            var wrapper = this.closest('.fav-recipe-wrapper');
            var titleEl = wrapper.querySelector('h1, h2');
            var name = titleEl ? titleEl.innerText.replace(/[❤️🤍]/g,'').trim() : '';
            var favs = getFavourites().filter(function(r){ return r.name !== name; });
            saveFavourites(favs);
            wrapper.remove();
            if (getFavourites().length === 0) renderFavouritesPage();
            showToast(name + ' Removed from favourites 💔');
        });
    });
}

function removeRecipe(index) {
    var favs = getFavourites();
    var name = favs[index] ? favs[index].name : '';
    favs.splice(index, 1);
    saveFavourites(favs);
    renderFavouritesPage();
    showToast(name + ' Removed from favourites 💔');
}

document.addEventListener('DOMContentLoaded', function() {
    initHeartButtons();
    renderFavouritesPage();
});
