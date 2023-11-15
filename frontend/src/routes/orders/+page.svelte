<svelte:head>
    <title>Orders</title>
</svelte:head>

<script>
    import authService from '$lib/features/authService.js';
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
    import {goto} from "$app/navigation";
    import Order from "$lib/components/Order.svelte";
    import {browser} from "$app/environment";

    let user;
    let finishedLoading = false;
    let orders = [];

    onMount(() => {
        user = JSON.parse(localStorage.getItem('user'));
        loadJobs();
    });

    async function loadJobs() {
        if (!browser) return;
        // await onMount(() => {
        //     //user = authService.getUser();
        //
        // })
        user = 'TO CHANGE';
        if (user == null) {
            await goto('/');
        } else {
            //const requests = await jobService.getJobs(user.token);
            let orderItems = [{itemName: 'Mango', quantity: '10'},
                {itemName: 'Couch', quantity: '500'},
                {itemName: 'Number 10 machine screw (0.190 inch major diameter)', quantity: '51700'}];
            orders.push({
                quotationID: '57f5en320a83',
                submissionDate: 'Fri Nov 17 2023 17:11:22',
                orderItems: orderItems,
                distance: '5 km'
            });
            orders = orders;
        }
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
