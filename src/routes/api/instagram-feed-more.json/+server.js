import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { next } = await request.json();
		const response = await fetch(next);
		const data = await response.json();

		return new Response(JSON.stringify(data));
	} catch (err) {
		console.log('Error: ', err);
		error(500, 'Error retrieving data in /api.instagram-feed-more.json');
	}
}
