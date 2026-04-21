// Search
const searchInput = document.getElementById("searchInput");
const recipes = [
    { name: "Warek 3enab", link: "main course.html#warak" },
    { name: "Molokhia", link: "main course.html#molokhia" },
    { name: "koshari", link: "main course.html#koshari" },
    { name: "Macaroni bechamel", link: "main course.html#bshamel" },
    { name: "Shrimps", link: "main course.html#shrimp" },
    { name: "Steak", link: "main course.html#steak" },
    { name: "pizza", link: "main course.html#pizza" },
    { name: "shawerma", link: "main course.html#shawerma" },
    { name: "creamychickenpasta", link: "main course.html#creamychickenpasta" },
    { name: "redsaucepasta", link: "main course.html#redsaucepasta" },

    { name: "Chocolate cake", link: "Desserts.html#choco-cake" },
    { name: "Cookies", link: "Desserts.html#cookie" },
    { name: "Tiramisu", link: "Desserts.html#tiramisu" },
    { name: "Donuts", link: "Desserts.html#donuts" },
    { name: "strawberry-ice-cream", link: "Desserts.html#strawberry-ice-cream" },
    { name: "Cinnamon rolls", link: "Desserts.html#cinnamon" },
    { name: "Basbousa", link: "Desserts.html#Basbousa" },
    { name: "Applepie", link: "Desserts.html#applepie" },
    { name: "Cheesecake", link: "Desserts.html#Cheesecake" },
    { name: "CrèmeCaramel", link: "Desserts.html#CrèmeCaramel" },

    { name: "Caesar salad", link: "appetizer.html#caesar-salad" },
    { name: "Greek salad", link: "appetizer.html#greek-salad" },
    { name: "Sambosa", link: "appetizer.html#sambosa" },
    { name: "Kobeba", link: "appetizer.html#kobeba" },
    { name: "Garlic bread", link: "appetizer.html#garlic-bread" },
    { name: "Cheese sticks", link: "appetizer.html#cheese-sticks" },
    { name: "Spring rolls", link: "appetizer.html#spring-rolls" }
];

const resultsBox = document.getElementById("results");
resultsBox.classList.add("results");
document.querySelector(".search-box").appendChild(resultsBox);

searchInput.addEventListener("keyup", function () {
    let input = this.value.toLowerCase();
    resultsBox.innerHTML = "";

    if (input === "") return;

    let filtered = recipes.filter(r => r.name.toLowerCase().includes(input));

    filtered.forEach(r => {
        let item = document.createElement("div");
        item.innerHTML = `<a href="${r.link}">${r.name}</a>`;
        resultsBox.appendChild(item);
    });
});

document.addEventListener("DOMContentLoaded", function () {

    let role = localStorage.getItem("userRole");
    let isLoggedIn = localStorage.getItem("isLoggedIn");

    let addBtn = document.getElementById("addBtn");

    if (isLoggedIn === "true" && role === "Admin") {
        addBtn.style.display = "inline-block";
    } else {
        addBtn.style.display = "none";
    }
});

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", function () {

    let isLoggedIn = localStorage.getItem("isLoggedIn");

    let authLinks = document.getElementById("authLinks");

    if (isLoggedIn === "true") {
        authLinks.innerHTML = `<a href="#" onclick="logout()">Logout</a>`;
    } 
});