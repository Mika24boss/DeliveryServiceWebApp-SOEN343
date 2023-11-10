<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {page} from "$app/stores";
    import Map from '$lib/images/tracking-map.png';
    import {goto} from "$app/navigation";
    import authService from '$lib/features/authService.js';
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';

    let user;
    let finishedLoading = false;
    const orderID = $page.url.pathname.split('/').pop();
    let pageTitle = "Order #" + orderID;
    let estimatedDeliveryDate = '12 December 2023';
    let details = "mangoes, toys, candies";
    let total = '888$';
    let deliveryType = 'Small trucks';
    let statusOrder = 'ongoing';

    onMount(() => {
        user = authService.getUser();
        loadPage();
    });

    async function loadPage() {
        // if (user == null) {
        //     await goto('/');
        // }
        // setTimeout(() => {finishedLoading = true;}, 300);
        finishedLoading = true;
    }

</script>

<div class='order'>
    {#if !finishedLoading}
        <LoadingAnimation/>
    {:else}
        <div class='order-section'>
            <h1>Order #{orderID}</h1>
            <h2>Estimated delivery date: {estimatedDeliveryDate}</h2>
            <div class='order-container'>
                <div class="delivery-type">Delivery type: {deliveryType}</div>
                <div class="status-order">Status: {statusOrder}</div>
                <img src={Map} alt="map_image"/>
            </div>
        </div>
    {/if}
</div>

<style>

    h1, p {
        color: black;
    }

    .order {
        width: 80%;
        margin-left: 10%;
    }

    .order-section {
        margin-top: 2%;
    }

    img{
        display: block;
        margin-left: auto;
        margin-right: auto;
        border: 0.4em solid black;
        width: 50%;
        height: 50%;
    }


</style>
