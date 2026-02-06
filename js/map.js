// map.js - Google Maps

export function initMap(mapId, lat, lng) {
    if (!window.google || !window.google.maps) {
        console.warn('Google Maps not loaded. Check your API key in config.js.');
        return;
    }

    const mapElement = document.getElementById(mapId);
    if (!mapElement) {
        console.error('Map element not found:', mapId);
        return;
    }
    
    const map = new google.maps.Map(mapElement, {
        center: { lat, lng },
        zoom: 15
    });
    
    new google.maps.Marker({
        position: { lat, lng },
        map
    });
}

export function getDirectionsUrl(lat, lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}