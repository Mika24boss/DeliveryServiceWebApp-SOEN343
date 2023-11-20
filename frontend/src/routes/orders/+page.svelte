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
    import {ApolloClient, InMemoryCache} from "@apollo/client/core";
    import {mutation, setClient} from "svelte-apollo";
    import {GET_ORDERS_FOR_EACH_CLIENT, GET_ORDERS_FOR_EACH_DELIVERY_MAN} from "../../mutations/ordersMutation.js";

    const client = new ApolloClient({
        uri: 'https://bwm.happyfir.com/graphql/orders',
        cache: new InMemoryCache()
    });

    setClient(client);
    let user;
    let finishedLoading = false;
    let orders = [];
    const getOrdersEachClientMutation = mutation(GET_ORDERS_FOR_EACH_CLIENT);
    const getOrdersEachDeliveryManMutation = mutation(GET_ORDERS_FOR_EACH_DELIVERY_MAN)

    loadOrders();

    async function loadOrders() {
        if (!browser) return;
        await onMount(() => {
            user = authService.getUser();
        })
        if (user == null || user.role === 'ADMIN') {
            await goto('/');
        } else if (user.role === "REGULAR-CLIENT" || user.role === 'GOLD-CLIENT') {
            const ordersResponse = await getOrdersEachClientMutation({
                variables: {
                    clientID: user.id
                }
            });
            // const requests = await jobService.getJobs(user.token);
            console.log(ordersResponse)
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
        } else if (user.role === "DELIVERY-MAN" || user.role === "PICKUP-MAN") {
            const ordersResponse = await getOrdersEachDeliveryManMutation({
                variables: {
                    deliveryManID: user.id
                }
            });
            // const requests = await jobService.getJobs(user.token);
            console.log(ordersResponse)
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

    .orders-container {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
    }

</style>
