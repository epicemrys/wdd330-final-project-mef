// api.js - API fetches
import { API_KEYS } from './config.js';

export async function fetchEvents(query, type = '', dateFrom = '', dateTo = '') {
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEYS.TICKETMASTER_KEY}&size=20&sort=date,asc`;
    const keyword = [query, type].filter(Boolean).join(' ');
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    if (dateFrom) url += `&startDateTime=${dateFrom}T00:00:00Z`;
    if (dateTo) url += `&endDateTime=${dateTo}T23:59:59Z`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);
        const data = await response.json();
        return data._embedded?.events || [];
    } catch (error) {
        console.error('Failed to fetch events:', error);
        throw error;
    }
}