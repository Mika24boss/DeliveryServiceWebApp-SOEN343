<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import authService from '$lib/features/authService.js';
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';

    let user;
    let finishedLoading = false;
    const quotationID = $page.url.pathname.split('/').pop();
    let pageTitle = "Quotation #" + quotationID;
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

<div class='quotation'>
    {#if !finishedLoading}
        <LoadingAnimation/>
    {:else}
        <div class='quotation-section'>
            <h1>Quotation #{quotationID}</h1>
            <div class='quotation-container'>
                <div class="details">{details}</div>

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

    img {
        display: block;
        margin-left: auto;
        margin-right: auto;
        border: 0.4em solid black;
        width: 50%;
        height: 50%;
    }


</style>
