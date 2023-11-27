<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import LoadingAnimation from "$lib/components/LoadingAnimation.svelte";
    import authService from "$lib/features/authService.js";
    import {mutation, setClient} from "svelte-apollo";
    import {UPDATE_PRICE} from "../../../mutations/quotationMutation.js";
    import {ADD_ADDRESS} from "../../../mutations/addressesMutation.js";
    import {ApolloClient, InMemoryCache} from "@apollo/client/core";

    let user = authService.getUser();
    console.log(user.token)
    const client = new ApolloClient({
        uri: 'https://bwm.happyfir.com/graphql/create_request',
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        cache: new InMemoryCache()
    });
    setClient(client);
    const quotationID = $page.url.pathname.split('/').pop();
    let pageTitle = "Delivery Request #" + quotationID;
    let request;
    let orderItems = [];
    let finishedLoading = false;
    let price;

    onMount(async () => {
        if (user == null || user.role !== 'ADMIN') {
            await goto('/');
            return;
        }

        //request = (await jobService.getJobByID(jobID, user.token))[0];

        request = {
            buyerName: 'John Smith',
            deliveryAddress: '550 Dat Street',
            deliveryCity: 'Pi',
            deliveryProvince: 'Nutkuabec',
            deliveryCountry: 'Uganda',
            deliveryPostalCode: '13579',
            sellerName: 'Mohammed Li',
            pickupAddress: '550 Dis Street',
            pickupCity: 'Golden Ratio',
            pickupProvince: 'Kuabec',
            pickupCountry: 'Uruguay',
            pickupPostalCode: '24680',
            date: 'Fri Nov 17 2023 17:11:22',
            distance: '5 km'
        }
        orderItems = [{itemName: 'Mango', quantity: '10'},
            {itemName: 'Couch', quantity: '500'},
            {itemName: 'Number 10 machine screw (0.190 inch major diameter)', quantity: '51700'}];

        if (request == null) {
            alert('No request has an ID #' + quotationID + '.');
            await goto('/requests');
        }
        finishedLoading = true;
    })

    const updatePrice = mutation(UPDATE_PRICE);
    async function accept() {
        if (price === undefined) alert("Please enter a price.")
        else {
            alert("Accepted at " + price + "$!");
            console.log(price)
            console.log(typeof price)
            try {
                const response= await updatePrice({
                    variables: {
                        quotationID: quotationID,
                        price: price,
                    }
                });
                console.log(response);
            } catch (error) {
                console.error("Error changing price:", error);
            }

        }
    }

    function reject() {
        alert("Rejected!");
    }

    //make quotation(ADD_QUOTATION), only works when admin
   //const updatePrice=mutation(UPDATE_PRICE);
    //function updatePrices(){

   // }
</script>

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
    <div>{request.deliveryCity} {request.deliveryProvince} {request.deliveryPostalCode} {request.deliveryCountry}</div>

    <h2>Pickup</h2>
    <div>{request.sellerName}</div>
    <div>{request.pickupAddress}</div>
    <div>{request.pickupCity} {request.pickupProvince} {request.pickupPostalCode} {request.pickupCountry}</div>
    <br/>
    <div>{request.date}</div>
    <br/>
    <div>{request.distance}</div>

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

    <h2>Price</h2>
    <span><input class="price" type='number' placeholder='Price' min="0" bind:value={price}/>$</span>
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

    .price {
        max-width: 200px;
    }

</style>