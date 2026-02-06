// ui.js - Build HTML
import { formatDate } from './utils.js';
import { BASE_URL } from './config.js';

export function displayEvents(events, container, saveFunc, mapFunc) {
    container.innerHTML = '';
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-3 fade-in'; // Animation class
        card.innerHTML = `
            <div class="card" aria-label="Event card for ${event.name}">
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text">${formatDate(event.dates.start.localDate)}</p>
                    <p class="card-text">${event._embedded.venues[0].name || 'Location TBD'}</p>
                    <button class="btn btn-sm btn-outline-primary view-details">View Details</button>
                    ${saveFunc ? '<button class="btn btn-sm btn-outline-warning save-fav">Save</button>' : ''}
                </div>
            </div>
        `;
        container.appendChild(card);

        // Details button: Open modal
        card.querySelector('.view-details').addEventListener('click', () => {
            displayEventDetails(event, mapFunc);
        });

        if (saveFunc) {
            card.querySelector('.save-fav').addEventListener('click', () => saveFunc(event));
        }
    });
}

export function displayEventDetails(event, mapFunc) {
    // Create modal (using Bootstrap modal)
    const modal = document.createElement('div');
    modal.className = 'modal fade show d-block';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${event.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Date: ${formatDate(event.dates.start.localDate)}</p>
                    <p>Location: ${event._embedded.venues[0].name}</p>
                    <p>${event.info || 'No description'}</p>
                    <div id="map"></div>
                    <button class="btn btn-sm btn-outline-info share-btn">Share</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Init map
    const venue = event._embedded.venues[0];
    if (venue.location) {
        mapFunc('map', parseFloat(venue.location.latitude), parseFloat(venue.location.longitude));
    }

    // Share
    modal.querySelector('.share-btn').addEventListener('click', () => {
    const eventUrl = `${BASE_URL}${window.location.pathname}?event=${event.id || 'shared'}`;  
    // Optional: add ?event=xxx query param so it looks nicer / trackable

    const shareData = {
        title: event.name,
        text: `Check out this ${event.classifications?.[0]?.segment?.name || 'event'}: ${event.name}`,
        url: event.url || eventUrl   // prefer Ticketmaster's own URL if available
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch(err => console.error('Share failed:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareData.url)
            .then(() => alert('Link copied to clipboard!'))
            .catch(() => alert('Could not copy. Link: ' + shareData.url));
    }
});

    // Close
    modal.querySelector('.btn-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}