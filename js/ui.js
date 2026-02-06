// ui.js - Build HTML
import { formatDate, showToast } from './utils.js';
import { BASE_URL } from './config.js';
import { removeFavorite } from './storage.js';
import { getDirectionsUrl } from './map.js';

export function displayEvents(events, container, saveFunc, mapFunc, removeFunc) {
    if (!events || events.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No events found. Try a different search.</p></div>';
        return;
    }
    
    container.innerHTML = '';
    events.forEach(event => {
        const venueName = event._embedded?.venues?.[0]?.name || 'Location TBD';
        const eventCard = document.createElement('div');
        eventCard.className = 'col-md-4 mb-3 fade-in';
        eventCard.innerHTML = `
            <div class="card h-100" aria-label="Event card for ${event.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text"><small class="text-muted">${formatDate(event.dates?.start?.localDate || 'TBD')}</small></p>
                    <p class="card-text"><small>${venueName}</small></p>
                    <div class="mt-auto">
                        <button class="btn btn-sm btn-outline-primary view-details">View Details</button>
                        ${saveFunc ? '<button class="btn btn-sm btn-outline-warning save-fav ms-2">Save</button>' : ''}
                        ${removeFunc ? '<button class="btn btn-sm btn-outline-danger remove-fav ms-2">Remove</button>' : ''}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(eventCard);

        // Details button
        eventCard.querySelector('.view-details').addEventListener('click', () => {
            displayEventDetails(event, mapFunc);
        });

        // Save button
        if (saveFunc) {
            eventCard.querySelector('.save-fav').addEventListener('click', () => {
                const result = saveFunc(event);
                if (result) {
                    showToast('Added to favorites!', 'success');
                } else {
                    showToast('Already in favorites', 'info');
                }
            });
        }

        // Remove button
        if (removeFunc) {
            eventCard.querySelector('.remove-fav').addEventListener('click', () => {
                removeFunc(event.id);
                eventCard.remove();
                showToast('Removed from favorites', 'warning');
            });
        }
    });
}

export function displayEventDetails(event, mapFunc) {
    // Create modal with proper Bootstrap structure
    const modalElement = document.createElement('div');
    modalElement.className = 'modal fade';
    modalElement.setAttribute('tabindex', '-1');
    
    const venueName = event._embedded?.venues?.[0]?.name || 'Location TBD';
    const venueLocation = event._embedded?.venues?.[0]?.location;
    const directionsUrl = venueLocation ? getDirectionsUrl(venueLocation.latitude, venueLocation.longitude) : null;
    
    modalElement.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${event.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Date:</strong> ${formatDate(event.dates?.start?.localDate || 'TBD')}</p>
                    <p><strong>Location:</strong> ${venueName}</p>
                    ${event.info ? `<p><strong>Description:</strong> ${event.info}</p>` : ''}
                    ${event.url ? `<p><a href="${event.url}" target="_blank" class="btn btn-sm btn-primary">Get Tickets</a></p>` : ''}
                    <div id="map" style="height: 300px; margin: 20px 0;"></div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-info share-btn">Share Event</button>
                        ${directionsUrl ? `<a href="${directionsUrl}" target="_blank" class="btn btn-sm btn-outline-secondary">Get Directions</a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalElement);
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Initialize map if location available
    if (venueLocation && mapFunc) {
        try {
            mapFunc('map', parseFloat(venueLocation.latitude), parseFloat(venueLocation.longitude));
        } catch (error) {
            console.error('Failed to initialize map:', error);
        }
    }

    // Share functionality
    modalElement.querySelector('.share-btn').addEventListener('click', () => {
        const eventUrl = event.url || `${BASE_URL}?event=${event.id}`;
        const shareData = {
            title: event.name,
            text: `Check out this event: ${event.name}`,
            url: eventUrl
        };

        if (navigator.share && navigator.canShare?.(shareData)) {
            navigator.share(shareData)
                .then(() => showToast('Shared successfully!', 'success'))
                .catch(err => console.error('Share failed:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(eventUrl)
                .then(() => showToast('Link copied to clipboard!', 'success'))
                .catch(() => showToast('Could not copy link', 'danger'));
        }
    });

    // Clean up modal on close
    modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.remove();
    });
}