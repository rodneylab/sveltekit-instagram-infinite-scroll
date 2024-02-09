import { INSTAGRAM_ACCESS_TOKEN } from '$env/static/private';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const url = `https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
		const response = await fetch(url, {
			method: 'GET',
		});

		const data = await response.json();

		return {
			data,
		};
	} catch (err) {
		console.log('Error: ', err);
		error(500, 'Error retrieving data in /api.instagram-feed.json');
	}
}
