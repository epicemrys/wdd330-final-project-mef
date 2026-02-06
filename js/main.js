// main.js - Entry point
import { fetchEvents } from './api.js';
import { displayEvents } from './ui.js';
import { getFavorites, saveFavorite, removeFavorite } from './storage.js';
import { initMap } from './map.js';
import { API_KEYS } from './config.js';

// Load Google Maps API dynamically
function loadGoogleMaps() {
    if (!API_KEYS.GOOGLE_MAPS_KEY || API_KEYS.GOOGLE_MAPS_KEY === '') {
        console.warn('Google Maps API key not configured. Map features will not work.');
        return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Highlight active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Load Google Maps on page load
loadGoogleMaps();

// Set active nav link
setActiveNavLink();

// Detect current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

if (currentPage === 'index.html' || currentPage === '') {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const filterType = document.getElementById('filter-type');
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    const results = document.getElementById('results');
    const spinner = document.getElementById('loading-spinner');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        const type = filterType.value;
        const fromDate = dateFrom.value;
        const toDate = dateTo.value;

        if (!query) {
            results.innerHTML = '<div class="col-12"><p class="text-warning">Please enter a search term.</p></div>';
            return;
        }

        // Show spinner, hide results
        spinner.style.display = 'block';
        results.innerHTML = '';

        try {
            const events = await fetchEvents(query, type, fromDate, toDate);
            spinner.style.display = 'none';
            displayEvents(events, results, saveFavorite, initMap);
        } catch (error) {
            spinner.style.display = 'none';
            console.error('Error fetching events:', error);
            results.innerHTML = '<div class="col-12"><p class="text-danger">Failed to load events. Please try again or check your API keys in config.js.</p></div>';
        }
    });

} else if (currentPage === 'favorites.html') {
    const favoritesList = document.getElementById('favorites-list');
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<div class="col-12"><p class="text-muted">No favorites saved yet. <a href="index.html">Browse events</a> to add some!</p></div>';
    } else {
        displayEvents(favorites, favoritesList, null, initMap, removeFavorite);
    }
}