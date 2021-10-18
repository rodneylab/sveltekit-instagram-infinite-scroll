export async function get() {
  try {
    const url = `https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,timestamp&access_token=${process.env['INSTAGRAM_ACCESS_TOKEN']}`;
    const response = await fetch(url, {
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
      error: 'Error retrieving data in /api.instagram-feed.json',
    };
  }
}
