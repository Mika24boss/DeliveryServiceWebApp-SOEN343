<svelte:head>
    <title>Orders</title>
</svelte:head>

<script>
    import authService from '$lib/features/authService.js';
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
    import {goto} from "$app/navigation";
    import Order from "$lib/components/Order.svelte";

    let user;
    let finishedLoading = false;
    let orders = [];

    onMount(() => {
        user = authService.getUser();
        loadPage();
    });

    async function loadPage() {
        // if (user == null) {
        //     await goto('/');
        // }
        // setTimeout(() => {finishedLoading = true;}, 300);
        orders.push({orderID:123, estimatedDeliveryDate: '12 December 2023', details: "mangoes, toys, candies", total: '888$'})
        finishedLoading = true;
    }

</script>

<div class='orders'>
    {#if !finishedLoading}
        <LoadingAnimation/>
    {:else}
        <div class='orders-section'>
            <h1>Orders</h1>
            <div class='orders-container'>
                {#each orders as order(order.orderID)}
                    <Order {...order}/>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>

    .orders-section {
        margin-top: 2%;
    }

    .orders-container{
        display:flex;
        flex-direction: column;
        gap: 1.5em;
    }

</style>
