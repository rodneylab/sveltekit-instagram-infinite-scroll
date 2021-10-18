export async function post(request) {
  try {
    const { next } = request.body;
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
