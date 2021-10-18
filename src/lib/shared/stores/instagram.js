import { writable } from 'svelte/store';

const feed = writable([]);

export { feed as default };
