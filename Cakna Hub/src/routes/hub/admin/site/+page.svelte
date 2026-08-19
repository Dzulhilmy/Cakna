<script lang="ts">
	import { Home, Info, GraduationCap, Newspaper, Phone, BookOpen } from 'lucide-svelte';

	const pages = [
		{
			href: '/hub/admin/site/home',
			label: 'Home Page',
			desc: 'Hero, about, programs, impact & CTA.',
			icon: Home
		},
		{
			href: '/hub/admin/site/aboutPage',
			label: 'About Us',
			desc: 'Who we are, purpose, collaboration & stats.',
			icon: Info
		},
		{
			href: '/hub/admin/site/setemPage',
			label: 'SETEM',
			desc: 'Math therapy seminar page.',
			icon: GraduationCap
		},
		{
			href: '/hub/admin/site/csrPage',
			label: 'CSR Stories',
			desc: 'Franchisee CSR stories & gallery.',
			icon: Newspaper
		},
		{
			href: '/hub/admin/site/footer',
			label: 'Contact & Footer',
			desc: 'Footer contact details.',
			icon: Phone
		},
		{
			href: '/hub/admin/site/docs',
			label: 'Polisi, SOP & Panduan',
			desc: 'Policy, SOP, guidelines & manual pages.',
			icon: BookOpen
		}
	];
</script>

<svelte:head><title>Website · Cakna Hub Admin</title></svelte:head>

<div class="space-y-8">
	<header>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Website</h1>
		<p class="mt-1.5 text-zinc-500">Edit the public-facing pages by section.</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		{#each pages as p (p.href)}
			<a
				href={p.href}
				class="group flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-rose-200 hover:bg-rose-50"
			>
				<div class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-100">
					<svelte:component this={p.icon} size={20} />
				</div>
				<div>
					<p class="font-semibold text-zinc-900">{p.label}</p>
					<p class="mt-0.5 text-sm text-zinc-500">{p.desc}</p>
				</div>
			</a>
		{/each}
	</div>
</div>
