<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<script>
    import authService from '$lib/features/authService.js';
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
    import {goto} from "$app/navigation";

    let user;
    let finishedLoading = false;

    onMount(() => {
        user = authService.getUser();
        loadPage();
    });

    async function loadPage() {
        if (user == null) {
            await goto('/');
        }
        setTimeout(() => {finishedLoading = true;}, 300);
    }

</script>

<div class='employer-dashboard'>
    {#if !finishedLoading}
        <LoadingAnimation/>
    {:else}

        <!-- Some Section-->
        <div class='thing-section'>
            <div class='thing'>
                <h1 class='badge'>0</h1>
                <h1 class='label'>Thing(s)</h1>
            </div>
            <p>Nothing new since your last login</p>
        </div>
    {/if}
</div>

<style>
    * {
        font-family: 'Barlow', sans-serif;
    }

    h1, p {
        color: lightgray;
    }

    .employer-dashboard {
        width: 80%;
        margin-left: 10%;
    }

    .thing-section {
        margin-top: 2%;
    }

    .thing {
        text-align: left;
        margin-bottom: 1em;
    }

    .badge, .label {
        display: inline;
    }

    .badge {
        border-radius: 50%;
        padding-left: 0.3em;
        padding-right: 0.3em;

        text-align: center;
        background: #3A98B9;
        color: white;
    }

</style>
