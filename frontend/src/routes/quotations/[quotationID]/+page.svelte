<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import authService from '$lib/features/authService.js';
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
    import {ApolloClient, InMemoryCache} from "@apollo/client/core";
    import {mutation, setClient} from "svelte-apollo";
    import {GET_QUOTATION} from "../../../mutations/quotationMutation.js";
    import {GET_ADDRESS} from "../../../mutations/addressesMutation.js";
    import {GET_ORDERED_ITEM} from "../../../mutations/orderedItemMutation.js";
    import {GET_ITEM} from "../../../mutations/itemsMutation.js";

    const client = new ApolloClient({
        // uri: 'https://bwm.happyfir.com/graphql/create_request',
        uri: "http://localhost:8000/graphql/create_request",
        cache: new InMemoryCache()
    });

    setClient(client);
    const getQuotation = mutation(GET_QUOTATION);
    const getAddress = mutation(GET_ADDRESS)
    const orderItemsMutation = mutation(GET_ORDERED_ITEM);
    const itemMutation = mutation(GET_ITEM)
    let user;
    let finishedLoading = false;
    const quotationID = $page.url.pathname.split('/').pop();
    let pageTitle = "Quotation #" + quotationID;
    let quotation = [];
    let orderItems = [];
    onMount(async () => {
        user = authService.getUser();
        console.log(user)
        if (user == null || (user.role !== 'GOLD-CLIENT' && user.role !== 'REGULAR-CLIENT')) {
            await goto('/');
            return;
        }
        try {
            let response = await getQuotation({
                variables: {
                    id: quotationID,
                }
            });
            console.log(response.data.quotation.pickUpAddress)
            let pickUpAddressResponse = await getAddress({
                variables: {
                    id: response.data.quotation.pickUpAddress
                }
            })
            console.log(pickUpAddressResponse)
            let shippingAddressResponse = await getAddress({
                variables: {
                    id: response.data.quotation.shippingAddress
                }
            })
            let orderItemsResponse = await orderItemsMutation({
                variables: {
                    id: response.data.quotation.orderItems
                }
            })
            for (let index = 0; index < orderItemsResponse.data.orderedItem.items.length; index++) {
                console.log(orderItemsResponse.data.orderedItem.items[index])
                let itemResponse = await itemMutation({
                    variables: {
                        id: orderItemsResponse.data.orderedItem.items[index]
                    }
                })
                console.log(itemResponse.data.item)
                orderItems.push(itemResponse.data.item)
            }
            response.data.quotation.pickUpAddress = pickUpAddressResponse.data.address
            response.data.quotation.shippingAddress = shippingAddressResponse.data.address
            console.log(orderItems)
            quotation = {
                deliveryAddress: response.data.quotation.shippingAddress.street,
                deliveryCity: response.data.quotation.shippingAddress.city,
                deliveryProvince: response.data.quotation.shippingAddress.province,
                deliveryCountry: response.data.quotation.shippingAddress.country,
                deliveryPostalCode: response.data.quotation.shippingAddress.postalCode,
                pickupAddress: response.data.quotation.pickUpAddress.street,
                pickupCity: response.data.quotation.pickUpAddress.city,
                pickupProvince: response.data.quotation.pickUpAddress.province,
                pickupCountry: response.data.quotation.pickUpAddress.country,
                pickupPostalCode: response.data.quotation.pickUpAddress.postalCode,
                distance: response.data.quotation.distance
            }
        } catch (e) {
            return alert("QuotationID is invalid")
        }
        //quotation = (await jobService.getJobByID(jobID, user.token))[0];


        orderItems = [{itemName: 'Mango', quantity: '10'},
            {itemName: 'Couch', quantity: '500'},
            {itemName: 'Number 10 machine screw (0.190 inch major diameter)', quantity: '51700'}];

        if (quotation == null) {
            alert('No quotation has an ID #' + quotationID + '.');
            await goto('/quotations');
        }
        finishedLoading = true;
    })

    async function onClick() {
        await goto('/quotations' + '/payment/' + quotationID);
    }

</script>

<div class='quotation'>
    {#if !finishedLoading}
        <LoadingAnimation/>
    {:else}
        <div class="header">
            <h1>Delivery quotation</h1>
            <button class="payment-button" on:click={onClick}>Pay</button>
        </div>

        <h2>Delivery</h2>
        <div>{quotation.deliveryAddress}</div>
        <div>{quotation.deliveryCity} {quotation.deliveryProvince} {quotation.deliveryPostalCode} {quotation.deliveryCountry}</div>

        <h2>Pickup</h2>
        <div>{quotation.pickupAddress}</div>
        <div>{quotation.pickupCity} {quotation.pickupProvince} {quotation.pickupPostalCode} {quotation.pickupCountry}</div>
        <div>{quotation.distance}</div>

        <h2>Order items</h2>
        <table>
            {#each orderItems as item, i}
                <tr>
                    <td>#{i + 1}</td>
                    <td>{item.quantity}</td>
                    <td>X</td>
                    <td>{item.itemName}</td>
                </tr>
            {/each}
        </table>
    {/if}
</div>

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
