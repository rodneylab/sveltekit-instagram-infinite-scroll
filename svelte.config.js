/** @type {import('@sveltejs/kit').Config} */
import 'dotenv/config';
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
  },
};

export default config;
