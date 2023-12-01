<script>
    import {page} from '$app/stores';
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
    import {browser} from '$app/environment';
    import authService from '$lib/features/authService.js';
    import {ApolloClient, InMemoryCache} from '@apollo/client/core';
    import {mutation, setClient} from 'svelte-apollo';
    import {DELETE_QUOTATION, GET_QUOTATION, UPDATE_PRICE} from '../../../mutations/quotationMutation.js';
    import {GET_ITEM} from '../../../mutations/itemsMutation.js';
    import {GET_ORDERED_ITEM} from '../../../mutations/orderedItemMutation.js';
    import {goto} from '$app/navigation';
    import {GET_ADDRESS} from '../../../mutations/addressesMutation.js';

    let user;
    let quotations = [];
    const quotationID = $page.url.pathname.split('/').pop();
    let pageTitle = 'Delivery Request #' + quotationID;
    let request;
    let items = [];
    let finishedLoading = false;
    let price;
    let quotation, updatePrice, deleteMutation;

    loadPage();

    async function loadPage() {
        if (!browser) return;
        user = authService.getUser();
        if (user == null || user.role !== 'ADMIN') {
            await goto('/');
            return;
        }
        const client = new ApolloClient({
            uri: 'https://bwm.happyfir.com/graphql/create_request',
            // uri: 'http://localhost:8000/graphql/create_request',
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            cache: new InMemoryCache()
        });
        setClient(client);
        const getQuotationMutation = mutation(GET_QUOTATION);
        const getOrderedItemMutation = mutation(GET_ORDERED_ITEM);
        const getItemMutation = mutation(GET_ITEM);
        updatePrice = mutation(UPDATE_PRICE);
        const getAddress = mutation(GET_ADDRESS);
        deleteMutation = mutation(DELETE_QUOTATION)
        onMount(async () => {
            try {
                let quotationResponse = await getQuotationMutation({
                    variables: {
                        id: quotationID
                    }
                });
                let quotationData = quotationResponse.data.quotation;
                const shippingAddressResponse = await getAddress({
                    variables: {
                        id: quotationData.shippingAddress
                    }
                });
                const pickUpAddressResponse = await getAddress({
                    variables: {
                        id: quotationData.pickUpAddress
                    }
                });
                request = {
                    buyerName: quotationData.id,
                    deliveryAddress: shippingAddressResponse.data.address,
                    pickupAddress: pickUpAddressResponse.data.address,
                    distance: quotationData.distance,
                    price: quotationData.price,
                    pickUpDate: quotationData.pickUpDate
                };

                let orderedItemResponse = await getOrderedItemMutation({
                    variables: {
                        id: quotationResponse.data.quotation.orderItems
                    }
                });
                let orderedItems = orderedItemResponse.data.orderedItem.items;

                for (let index = 0; index < orderedItems.length; index++) {
                    let itemResponse = await getItemMutation({
                        variables: {
                            id: orderedItems[index]
                        }
                    });

                    items.push(itemResponse.data.item);
                }
                //
                quotation = {
                    deliveryAddress: shippingAddressResponse.data.address.street,
                    deliveryCity: shippingAddressResponse.data.address.city,
                    deliveryProvince: shippingAddressResponse.data.address.province,
                    deliveryCountry: shippingAddressResponse.data.address.country,
                    deliveryPostalCode: shippingAddressResponse.data.address.postalCode,
                    pickupAddress: pickUpAddressResponse.data.address.street,
                    pickupCity: pickUpAddressResponse.data.address.city,
                    pickupProvince: pickUpAddressResponse.data.address.province,
                    pickupCountry: pickUpAddressResponse.data.address.country,
                    pickupPostalCode: pickUpAddressResponse.data.address.postalCode,
                    pickUpDate: pickUpAddressResponse.data.address.pickUpDate,
                    distance: quotationResponse.data.quotation.distance
                };
            } catch (e) {
                return alert('quotationID is invalid');
            }

            if (request == null) {
                alert('No request has an ID #' + quotationID + '.');
                await goto('/requests');
            }
            finishedLoading = true;
        });
    }

    async function accept() {
        if (price === undefined) alert('Please enter a price.');
        else {
            alert('Accepted at ' + price + '$!');
            console.log(price);
            console.log(typeof price);
            try {
                const response = await updatePrice({
                    variables: {
                        quotationID: quotationID,
                        price: parseInt(price)
                    }
                });
                console.log(response);
            } catch (error) {
                console.error('Error changing price:', error);
            }
            await goto('/requests')
        }
    }

    async function reject() {
        try {
            const response = await deleteMutation({
                variables: {
                    quotationID: quotationID
                }
            })
        } catch (e) {
            throw Error("Reject failed")
        }
        alert('Rejected!');
        await goto('/requests')
    }
</script>

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

{#if !finishedLoading}
    <LoadingAnimation/>
{:else}
    <div class="header">
        <h1>Delivery request</h1>
        <button class="payment-button" on:click={accept}>Accept</button>
        <button class="payment-button" on:click={reject}>Reject</button>
    </div>
    <h2>Delivery</h2>
    <div>{quotation.deliveryAddress}</div>
    <div>
        {quotation.deliveryCity}
        {quotation.deliveryProvince}
        {quotation.deliveryPostalCode}
        {quotation.deliveryCountry}
    </div>

    <h2>Pickup</h2>
    <div>{quotation.pickupAddress}</div>
    <div>
        {quotation.pickupCity}
        {quotation.pickupProvince}
        {quotation.pickupPostalCode}
        {quotation.pickupCountry}{quotation.pickUpDate}
    </div>
    <div>{quotation.distance} km</div>

    <h2>Order items</h2>
    <table>
        {#each items as item, i}
            <tr>
                <td>#{i + 1}</td>
                <td>{item.quantity}</td>
                <td>X</td>
                <td>{item.name}</td>
            </tr>
        {/each}
    </table>

    <h2>Price</h2>
    <span><input class="price" type="number" placeholder="Price" min="0" bind:value={price}/>$</span>
{/if}

<style>
    h1 {
        color: black;
    }

    h2 {
        margin: 2em 0 1em 0;
    }

    tr:nth-child(odd) {
        background-color: var(--secondary-color);
    }

    table {
        max-width: 1000px;
    }

    table td:nth-child(1) {
        width: 3%;
    }

    table td:nth-child(2) {
        width: 5%;
    }

    table td:nth-child(3) {
        width: 2%;
    }

    table td:nth-child(4) {
        width: 90%;
    }

    input {
        color: black;
        border: none;
        border-bottom: 2px solid orange;
        font-size: 16px;
        font-weight: bold;
        background-color: transparent;
    }

    input::placeholder {
        color: black;
    }

    .payment-button {
        max-width: 20em;
        width: 100%;
        margin-right: 1em;
        display: inline-block;
        padding: 0.9rem 1.8rem;
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
    }

    .payment-button::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: orange;
        transform: translateX(-100%);
        transition: all 0.3s;
        z-index: -1;
    }

    .payment-button:hover::before {
        transform: translateX(0);
    }

    .price {
        max-width: 200px;
    }
</style>
