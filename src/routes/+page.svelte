<script>
	import instagram from '$lib/shared/stores/instagram';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import '@fontsource/playfair-display/400.css';
	import '@fontsource/playfair-display/700.css';
	import '$lib/styles/global.css';

	/** @type {import('./$types').PageData} */
	export let data;

	const INITIAL_POSTS = 6;

	const { data: feed, paging } = data.data;
	let next = paging?.next ? paging.next : null;
	instagram.set(feed);

	let limit = INITIAL_POSTS;

	function morePostsAvailable() {
		return limit < $instagram.length || next;
	}

	let footer;

	onMount(() => {
		if (browser) {
			const handleIntersect = (entries, observer) => {
				entries.forEach((entry) => {
					if (!morePostsAvailable()) {
						observer.unobserve(entry.target);
					}
					showMorePosts();
				});
			};
			const options = { threshold: 0.5, rootMargin: '-100% 0% 100%' };
			const observer = new IntersectionObserver(handleIntersect, options);
			observer.observe(footer);
		}
	});

	$: showMorePosts;
	async function showMorePosts() {
		try {
			const newLimit = limit + 6;
			if (newLimit <= $instagram.length) {
				// load more images from store
				limit = newLimit;
			} else if (next) {
				// get another page from IG if there is another page available
				const response = await fetch('/api/instagram-feed-more.json', {
					method: 'POST',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ next: next.replace(/%2C/g, ',') }),
				});
				const newData = await response.json();
				const { data: newFeed, next: newNext } = newData;
				instagram.set([...$instagram, ...newFeed]);
				next = newNext ?? null;
				limit = newLimit;
			}
		} catch (error) {
			console.error('Error fetching more posts in index');
		}
	}
</script>

<svelte:head>
	<title>SvelteKit Infinite Feed Scroll</title>
</svelte:head>

<header>SvelteKit Infinite Scroll</header>

<main class="container">
	<h1>Instagram Feed</h1>
	<section class="feed">
		{#each $instagram?.slice(0, limit) as { caption, media_url }, index}
			<article aria-posinset={index + 1} aria-setsize={$instagram.length} class="feed-image">
				<img
					class="lazy"
					alt={caption ? caption : 'Image from instagram feed'}
					loading="lazy"
					decoding="async"
					width="256"
					height="256"
					src={media_url}
				/>
			</article>
		{:else}
			No feed images yet!
		{/each}
	</section>
</main>
<footer bind:this={footer}>
	<small>Copyright (c) 2021–2023 Rodney Lab. All Rights Reserved.</small>
</footer>

<style>
	header {
		color: #ffdc80;
		max-width: 768rem;
		padding: 1.5rem;
		font-size: 3.052rem;
		font-weight: var(--font-weight-bold);
	}
	h1 {
		color: #ffdc80;
		font-size: 3.815rem;
		text-align: center;
	}
	.container {
		min-height: 100vh;
	}

	.feed {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto;
		row-gap: 0;
		max-width: 768px;
		margin: 3rem auto;
		width: 100%;
		height: auto;
	}

	.feed img {
		width: 100%;
		height: 100%;
	}
	.feed-image {
		width: 100%;
		height: 100%;
	}

	footer {
		background: #833ab4;
		color: #fff;
		text-align: center;
		padding: 1rem;
	}

	@media (max-width: 768px) {
		.feed {
			padding: 0 1.5rem;
			width: 100%;
		}
	}
</style>
