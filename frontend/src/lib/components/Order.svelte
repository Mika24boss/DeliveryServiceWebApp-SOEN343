<script>
    import authService from '$lib/features/authService.js';
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    export var orderID, estimatedDeliveryDate, details, total;

    let user, role = 'Customer';
    loadOrder();

    async function loadOrder() {
        // await onMount(() => {
        //     user = authService.getUser();
        // })
        // role = user.role;
        //
        // if (user == null) {
        //     await goto('/');
        // }
    }

    async function onClick() {
        await goto('/orders/' + orderID);
    }

</script>
{#await user}
{:then user}
    <div class="outline" id={orderID}>
        <div class="estimated-delivery-date">{estimatedDeliveryDate}</div>
        <div class="details">{details}</div>
        <div class="total">{total}</div>
    </div>
{/await}

<style>

    .outline {
        min-width: 50em;
        height: 4em;
        outline: 2px solid black;
        border-radius: 1em;
        grid-template-columns: 1fr 3fr 1fr;
        grid-template-areas: "date details total";
        display: grid;
        place-items: center;
    }

    .estimated-delivery-date {
        text-align: left;
        grid-area: date;
    }

</style>
