// map.js - Google Maps
export function initMap(mapId, lat, lng) {
    const map = new google.maps.Map(document.getElementById(mapId), {
        center: { lat, lng },
        zoom: 15
    });
    new google.maps.Marker({
        position: { lat, lng },
        map
    });
}