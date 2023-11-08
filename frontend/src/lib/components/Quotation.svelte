<script>
    import authService from '$lib/features/authService.js';
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    export var quotationID, creationDateQuotation;

    let user, role = 'Customer';
    loadQuotation();

    async function loadQuotation() {
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
        // await goto('/payment');
    }

</script>
{#await user}
{:then user}
    <div class="outline" id={quotationID}>
        <div class="creation-date">
            25-December-2023
        </div>
        {#if role === 'Customer'}
            <button class="payment-button" type="submit" on:click={onClick}>
                Pay
            </button>

        {:else if role === 'Admin'}
            <p>Nothing</p>
        {/if}
    </div>
{/await}


<style>

    * {
        font-family: 'Barlow', sans-serif;
        color: black;
    }

    .outline {
        min-width: 50em;
        height: 4em;
        outline: 2px solid black;
        border-radius: 1em;
        grid-template-columns: 1fr 3fr 1fr;
        grid-template-areas: "date details paymentBtn";
        display: grid;
        place-items: center;
    }

    .creation-date {
        text-align: left;
        grid-area: date;
    }

    .payment-button {
        width: 90%;
        height: 90%;
        font-size: 16px;
        font-weight: 700;
        color: black;
        border: 3px solid orange;
        cursor: pointer;
        position: relative;
        background-color: transparent;
        text-decoration: none;
        overflow: hidden;
        z-index: 1;
        font-family: inherit;
        border-radius: 1em;
        grid-area: paymentBtn;

    }

    .payment-button::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: orange;
        transform: translateX(-100%);
        transition: all .3s;
        z-index: -1;
    }

    .payment-button:hover::before {
        transform: translateX(0);
    }

</style>
