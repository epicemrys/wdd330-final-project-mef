// api.js - API fetches
const TICKETMASTER_KEY = 'TICKETMASTER_KEY'; // I'll eplace with my key after setup

export async function fetchEvents(query, type = '') {
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_KEY}&size=20&sort=date,asc`;
    if (query) url += `&keyword=${encodeURIComponent(query)}`;
    if (type) url += `&classificationName=${encodeURIComponent(type)}`; // Approximate filter

    const response = await fetch(url);
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data._embedded ? data._embedded.events : [];
}