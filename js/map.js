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


AIzaSyBGm4pv2fdu4X2z7c2ta1ToLv_SRbBpRdc