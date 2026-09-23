 import { fetchProducts } from "./api.js";

const state = {
  products: [],
  search: "",
  category: "all",
  sort: "default",
  tab: "all",
  favorites: JSON.parse(localStorage.getItem("favoriteProducts") || "[]")
};

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const sortSelect = document.querySelector("#sortSelect");
const resultCount = document.querySelector("#resultCount");
const status = document.querySelector("#status");
const tabs = document.querySelectorAll(".tab");

function saveFavorites() {
  localStorage.setItem(
    "favoriteProducts",
    JSON.stringify(state.favorites)
  );
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function populateCategories() {
  const categories = [
    ...new Set(state.products.map(product => product.category))
  ].sort();

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  });
}

function getVisibleProducts() {
  let products = [...state.products];

  if (state.tab === "favorites") {
    products = products.filter(product =>
      state.favorites.includes(product.id)
    );
  }

  if (state.search.trim()) {
    const query = state.search.toLowerCase();

    products = products.filter(product =>
      product.title.toLowerCase().includes(query)
    );
  }

  if (state.category !== "all") {
    products = products.filter(
      product => product.category === state.category
    );
  }

  switch (state.sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;

    case "rating-desc":
      products.sort(
        (a, b) => b.rating.rate - a.rating.rate
      );
      break;

    case "title-asc":
      products.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;
  }

  return products;
}

function toggleFavorite(id) {
  if (state.favorites.includes(id)) {
    state.favorites = state.favorites.filter(
      favoriteId => favoriteId !== id
    );
  } else {
    state.favorites.push(id);
  }

  saveFavorites();
  render();
}

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "card";

  const isFavorite = state.favorites.includes(product.id);

  article.innerHTML = `
    <img src="${product.image}" alt="${product.title}">

    <div class="card-body">
      <span class="category">
        ${product.category}
      </span>

      <h3>${product.title}</h3>

      <span class="price">
        $${product.price.toFixed(2)}
      </span>

      <span class="rating">
        Rating: ${product.rating.rate}/5
        (${product.rating.count} reviews)
      </span>

      <button
        class="favorite"
        type="button"
        aria-pressed="${isFavorite}">
        ${isFavorite
          ? "★ Remove favorite"
          : "☆ Add favorite"}
      </button>
    </div>
  `;

  article
    .querySelector(".favorite")
    .addEventListener("click", () => {
      toggleFavorite(product.id);
    });

  return article;
}

function render() {
  const products = getVisibleProducts();

  productGrid.replaceChildren();

  if (products.length === 0) {
    const empty = document.createElement("p");

    empty.className = "empty";
    empty.textContent =
      "No products match the current filters.";

    productGrid.append(empty);
  } else {
    products.forEach(product => {
      productGrid.append(
        createProductCard(product)
      );
    });
  }

  resultCount.textContent =
    `${products.length} product${
      products.length === 1 ? "" : "s"
    }`;

  setStatus(
    `Showing ${products.length} matching product${
      products.length === 1 ? "" : "s"
    }.`
  );
}

searchInput.addEventListener("input", event => {
  state.search = event.target.value;
  render();
});

categorySelect.addEventListener("change", event => {
  state.category = event.target.value;
  render();
});

sortSelect.addEventListener("change", event => {
  state.sort = event.target.value;
  render();
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    state.tab = tab.dataset.tab;

    tabs.forEach(item => {
      const active = item === tab;

      item.classList.toggle("active", active);

      item.setAttribute(
        "aria-selected",
        String(active)
      );
    });

    render();
  });
});

async function init() {
  setStatus("Loading products from REST API...");

  try {
    state.products = await fetchProducts();

    populateCategories();
    render();

  } catch (error) {
    console.error(error);

    setStatus(
      "Unable to load products. Please check your connection.",
      true
    );

    productGrid.innerHTML = `
      <p class="empty">
        API data could not be loaded.
      </p>
    `;
  }
}

init();
