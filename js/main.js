// main.js - Entry point
import { fetchEvents } from './api.js';
import { displayEvents, displayEventDetails } from './ui.js';
import { getFavorites, saveFavorite } from './storage.js';
import { initMap } from './map.js';
import { formatDate } from './utils.js';
import { BASE_URL } from './config.js';

// Detect page
const currentPage = window.location.pathname.split('/').pop();

if (currentPage === 'index.html' || currentPage === '') {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const filter = document.getElementById('filter-type');
    const results = document.getElementById('results');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        const type = filter.value;
        if (!query) return;

        try {
            const events = await fetchEvents(query, type);
            displayEvents(events, results, saveFavorite, initMap); // Pass save and map funcs
        } catch (error) {
            console.error('Error fetching events:', error);
            results.innerHTML = '<p class="text-danger">Failed to load events. Try again.</p>';
        }
    });
} else if (currentPage === 'favorites.html') {
    const favoritesList = document.getElementById('favorites-list');
    const favorites = getFavorites();
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorites saved yet.</p>';
    } else {
        displayEvents(favorites, favoritesList, null, initMap); // No save button on favorites
    }
}

// For details: Assuming details shown in modal or same page, but since multi-page, I use query params for event ID?
// For simplicity, details in modal on click.