export async function POST({ request }) {
  try {
    const { next } = await request.json();
    const response = await fetch(next, {
      method: 'GET',
    });

    const data = await response.json();

    return {
      body: { ...data },
    };
  } catch (err) {
    console.log('Error: ', err);
    return {
      status: 500,
      error: 'Error retrieving data in /api.instagram-feed-more.json',
    };
  }
}
