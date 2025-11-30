import { client } from './client.js';

const adsContainer = document.getElementById('ads-container');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const emptyState = document.getElementById('empty-state');
const errorText = document.getElementById('error-text');
const authButtons = document.getElementById('auth-buttons');

function isLoggedIn() {
  return !!localStorage.getItem('auth_token');
}

function renderAuthButtons() {
  if (isLoggedIn()) {
    authButtons.innerHTML = `
      <a href="/create.html" class="px-6 py-2 text-white rounded-full font-semibold" style="background-color: #13C1AC;">
        Publicar anuncio
      </a>
      <button id="logout-btn" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300">
        Cerrar sesión
      </button>
    `;
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("auth_token");
      location.reload();
    });
  } else {
    authButtons.innerHTML = `
      <a href="/login.html" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300">
        Iniciar sesión
      </a>
      <a href="/register.html" class="px-6 py-2 text-white rounded-full font-semibold" style="background-color: #13C1AC;">
        Registrarse
      </a>
    `;
  }
}

function showState(state) {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");
  adsContainer.classList.add("hidden");

  if (state === "loading") loadingState.classList.remove("hidden");
  if (state === "error") errorState.classList.remove("hidden");
  if (state === "empty") emptyState.classList.remove("hidden");
  if (state === "success") adsContainer.classList.remove("hidden");
}

function renderAds(ads) {
  adsContainer.innerHTML = ads
    .map(
      (ad) => `
    <div class="ad-card" onclick="window.location.href='/detail.html?id=${
      ad.id
    }'">
      ${
        ad.photo
          ? `<img src="http://127.0.0.1:8000${ad.photo}" alt="${ad.name}" class="ad-image" />`
          : `<div class="ad-image flex items-center justify-center text-gray-400">Sin imagen</div>`
      }
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-gray-800 line-clamp-1">${
            ad.name
          }</h3>
          <span class="${ad.type === "sell" ? "badge-sell" : "badge-buy"}">
            ${ad.type === "sell" ? "Venta" : "Compra"}
          </span>
        </div>
        <p class="text-gray-600 text-sm line-clamp-2 mb-3">${ad.description}</p>
        <p class="text-2xl font-bold" style="color: #13C1AC;">${ad.price}€</p>
      </div>
    </div>
  `
    )
    .join("");
}

async function loadAds() {
  showState("loading");

  try {
    const ads = await client.get("/api/adverts");

    if (ads.length === 0) {
      showState("empty");
    } else {
      renderAds(ads);
      showState("success");
    }
  } catch (error) {
    errorText.textContent = error.message || "Error al cargar los anuncios";
    showState("error");
  }
}

renderAuthButtons();
loadAds();