// storage.js - LocalStorage
export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

export function saveFavorite(event) {
    const favorites = getFavorites();
    if (!favorites.some(fav => fav.id === event.id)) {
        favorites.push({ id: event.id, name: event.name, dates: event.dates, _embedded: event._embedded });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Saved to favorites!');
    }
}