<script>
    import {page} from '$app/stores';
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
    import {browser} from '$app/environment';
    import authService from '$lib/features/authService.js';
    import {ApolloClient, InMemoryCache} from "@apollo/client/core";
    import {mutation, setClient} from "svelte-apollo";
    import {GET_QUOTATION, UPDATE_PRICE} from "../../../mutations/quotationMutation.js";
    import {GET_ITEM} from "../../../mutations/itemsMutation.js";
    import {GET_ORDERED_ITEM} from "../../../mutations/orderedItemMutation.js";
    import {goto} from "$app/navigation";

    let user;
    // console.log(user)
    //console.log(user.token)
    let quotations = [];
    const quotationID = $page.url.pathname.split('/').pop();
    let pageTitle = 'Delivery Request #' + quotationID;
    let request;
    let orderItems;
    let Items = [];
    let finishedLoading = false;
    let price;

    loadPage();

    function loadPage() {
        if (!browser) return;
        user = authService.getUser();
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
        const getOrderedItemMutation = mutation(GET_ORDERED_ITEM)
        const getItemMutation = mutation(GET_ITEM);
        const updatePrice = mutation(UPDATE_PRICE);
        onMount(async () => {
            try {
                const quotationResponse = await getQuotationMutation({
                    variables: {
                        id: quotationID,
                    }
                });
                request = {
                    buyerName: quotationResponse.data.quotation.id,
                    deliveryAddress: quotationResponse.data.quotation.shippingAddress,
                    pickupAddress: quotationResponse.data.quotation.pickUpAddress,
                    distance: quotationResponse.data.quotation.distance,
                    price: quotationResponse.data.quotation.price,
                    pickUpDate: quotationResponse.data.quotation.pickUpDate
                };
                orderItems = quotationResponse.data.quotation.orderItems;
                let orderedItemResponse = await getOrderedItemMutation({
                    variables: {
                        id: quotationResponse.data.quotation.orderItems
                    }
                });
                for (let index = 0; index < orderedItemResponse.data.orderedItem.items.length; index++) {
                    console.log(orderedItemResponse.data.orderedItem.items[index])
                    let itemResponse = await getItemMutation({
                        variables: {
                            id: orderedItemResponse.data.orderedItem.items[index]
                        }
                    })
                    Items.push(itemResponse.data.item)
                }
            } catch (e) {
                return alert("quotationID is invalid")
            }
            if (request == null) {
                alert('No request has an ID #' + quotationID + '.');
                await goto('/requests');
            }
            finishedLoading = true;
        });
    }


    async function accept() {
        const client = new ApolloClient({
            // uri: 'https://bwm.happyfir.com/graphql/create_request',
            uri: "http://localhost:8000/graphql/create_request",
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            cache: new InMemoryCache()
        });
        setClient(client);
        const updatePrice = mutation(UPDATE_PRICE);
        if (price === undefined) alert('Please enter a price.');
        else {
            alert('Accepted at ' + price + '$!');
            console.log(price);
            console.log(typeof price);
            try {
                const response = await updatePrice({
                    variables: {
                        quotationID: quotationID,
                        price: parseInt(price),
                    }
                });
                console.log(response);
            } catch (error) {
                console.error("Error changing price:", error);
            }
        }
    }

    function reject() {
        alert('Rejected!');
    }

    //make quotation(ADD_QUOTATION), only works when admin
    //const updatePrice=mutation(UPDATE_PRICE);
    //function updatePrices(){

    // }
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
    <div>{request.buyerName}</div>
    <div>{request.deliveryAddress}</div>


    <h2>Pickup</h2>
    <div>{request.sellerName}</div>
    <div>{request.pickupAddress}</div>
    <br/>
    <div>{request.pickUpDate}</div>
    <br/>
    <div>{request.distance}</div>

    <h2>Order items</h2>
    <table>
        {#each Items as item, i}
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
