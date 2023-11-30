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
    import {
        GET_ORDERS_FOR_EACH_CLIENT,
        GET_ORDERS_FOR_EACH_DELIVERY_MAN,
        UPDATE_ORDER_STATUS
    } from "../../mutations/ordersMutation.js";

    const client = new ApolloClient({
        uri: 'https://bwm.happyfir.com/graphql/orders',
        cache: new InMemoryCache()
    });

    setClient(client);
    let user;
    let finishedLoading = false;
    let orders = [];
    const getOrdersEachClientMutation = mutation(GET_ORDERS_FOR_EACH_CLIENT);
    const getOrdersEachDeliveryManMutation = mutation(GET_ORDERS_FOR_EACH_DELIVERY_MAN);
    const updateStatusMutation = mutation(UPDATE_ORDER_STATUS);

    loadOrders();

    async function loadOrders() {
        if (!browser) return;
        await onMount(() => {
            user = authService.getUser();
        })
        let ordersResponse;
        if (user == null || user.role === 'ADMIN') {
            await goto('/');
        } else if (user.role === "REGULAR-CLIENT" || user.role === 'GOLD-CLIENT') {
            ordersResponse = await getOrdersEachClientMutation({
                variables: {
                    clientID: user.id
                }
            });
            ordersResponse = ordersResponse.data.ordersForEachClient;
        } else if (user.role === "DELIVERY-MAN" || user.role === "PICKUP-MAN") {
            ordersResponse = await getOrdersEachDeliveryManMutation({
                variables: {
                    deliveryManID: user.id
                }
            });
            ordersResponse = ordersResponse.data.ordersForEachDeliveryMan;
        }
        orders = ordersResponse.map(function(order) {
            return {
                orderID: order.id,
                submissionDate: convertDate(order.orderDate),
                orderItems: order.orderItems,
                status: convertStatus(order.status),
            };
        });
        console.log(orders)

        finishedLoading = true;
    }

    function convertStatus(backendStatus) {
        switch (backendStatus) {
            case "PAID":
                return "Paid";
            case "PICKUP":
                return "En route to pickup";
            case "DELIVERING":
                return "En route to delivery";
            case "DELIVERED":
                return "Delivered";
            default:
                return "Paid";
        }
    }

    function convertDate(backendDate){
        return new Date(parseInt(backendDate)).toLocaleDateString([], {year: 'numeric', month: 'long', day: 'numeric'});
    }

    //for delivery man
    function changeOrderStatus(){
        let orderID = 'your_order_id'; // Replace with actual order ID
        let newStatus = 'new_status'; // Replace with the desired new status

        const handleUpdateStatus = async () => {
            try {
                const { data } = await updateStatusMutation({ variables: { orderID, status: newStatus } });

                // Handle the response data as needed
                console.log('Order status updated successfully:', data.updateOrderStatus);
            } catch (err) {
                // Handle errors
                console.error('Error updating order status:', err);
            }
        };
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
