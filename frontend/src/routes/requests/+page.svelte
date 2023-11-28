<svelte:head>
    <title>Pending Requests</title>
</svelte:head>

<script>
    import {browser} from "$app/environment";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import LoadingAnimation from "$lib/components/LoadingAnimation.svelte";
    import Request from "$lib/components/Request.svelte";
    import authService from "$lib/features/authService.js";


    let requests = [];
    let user;

    loadRequests();

    async function loadRequests() {
        if (!browser) return;
        await onMount(() => {
            user = authService.getUser();
        })

        if (user == null || user.role !== 'ADMIN') {
            await goto('/');
            return;
        }
        let orderItems = [{itemName: 'Mango', quantity: '10'},
            {itemName: 'Couch', quantity: '500'},
            {itemName: 'Number 10 machine screw (0.190 inch major diameter)', quantity: '51700'}];
        requests.push({
            quotationID: '57f5en320a83',
            submissionDate: 'November 13, 2023',
            orderItems: orderItems,
            distance: '5 km',
            price: 0
        });
        requests = requests.filter((m) => {
            return (m.price === undefined || m.price === 0);
        });

    }





</script>

{#if !user}
    <LoadingAnimation/>
{:else}
    <h1>Requests</h1>
    <div class='requests'>
        {#each requests as request}
            <Request {...request}></Request>
        {/each}
    </div>
{/if}

<style>

    h1 {
        color: black;
    }

    .requests {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
    }

</style>