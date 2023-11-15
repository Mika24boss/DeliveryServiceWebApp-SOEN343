<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import authService from '$lib/features/authService.js';
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';

    let subtotal = '50$';
    let taxes = '20$';
    let total = '70$';
    const quotationID = $page.url.pathname.split('/').pop();
    let pageTitle = "Payment | Quotation #" + quotationID;

    async function makePayment() {
        // if (user == null) {
        //     await goto('/');
        // }
        // setTimeout(() => {finishedLoading = true;}, 300);
    }

</script>

<h1>Payment for quotation</h1>
<h2>Enter payment details:</h2>
<div class="payment-page">
    <div class="payment-section">
        <div class="payment-details column">
            <div class='formGroup'><input type="text" id="cardNum" placeholder="Card number" required></div>
            <div class='formGroup'><input type="text" id="expiryDate" placeholder="MM/YY" required></div>
            <div class='formGroup'><input type="text" id="cvc" placeholder="CVC" required></div>
            <div class='formGroup'><input type="text" id="streetAddress" placeholder="Street Address" required></div>
            <div class='formGroup'><input type="text" id="apartment" placeholder="Apt, unit, suite, etc. (optional)" required></div>
            <div class='formGroup'><input type="text" id="country" placeholder="Country" required></div>
            <div class='formGroup'><input type="text" id="city" placeholder="City" required></div>
            <div class='formGroup'><input type="text" id="state" placeholder="State" required></div>
            <div class='formGroup'><input type="text" id="zipCode" placeholder="Zip code" required></div>
        </div>
        <div class="order-summary column">
            <div class='subtotal'>Subtotal: {subtotal}</div>
            <div class='Taxes'>Taxes: {taxes}</div>
            <div class='total'>Total: {total}</div>
        </div>
    </div>
    <div class='btn-container'>
        <button class="btn-pay centerBlock" type="submit" on:click="{makePayment}">Pay</button>
    </div>
</div>
<style>

    * {
        box-sizing: border-box;
    }

    .payment-section {
        width: 100%;
        margin-top: 2%;
        display: flex;
        justify-content: center;
    }

    .order-summary {
        text-align: left;
        vertical-align: middle;
    }

    .payment-details {
        position: relative;
        align-self: center;
    }

    .formGroup{
        text-align: right;
        width: 100%;
    }

    .formGroup input, .formGroup input:focus {
        border: none;
        width: 50%;
        border-bottom: 2px solid orange;
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: bold;
        background-color: transparent;
    }

    .formGroup input::placeholder {
        color: black;
    }

    .column {
        width: 60%;
        padding: 10px;
    }

    .payment-section:after {
        content: "";
        display: table;
        clear: both;
    }

    .centerBlock {
        text-align: center;
        display: block;
        margin: 10px;
    }

    .btn-pay {
        width: 20em;
        height: 5em;
        font-size: 24px;
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
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .btn-pay::before {
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

    .btn-pay:hover::before {
        transform: translateX(0);
    }
</style>