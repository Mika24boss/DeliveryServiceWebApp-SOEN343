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
    import {GET_ORDERED_ITEM} from "../../mutations/orderedItemMutation.js";
    import {GET_ITEM} from "../../mutations/itemsMutation.js";

    let user;
    let finishedLoading = false;
    let orders = [];
    let getOrdersEachClientMutation;
    let getOrdersEachDeliveryManMutation;
    let getOrderItemsMutation;
    let getItemMutation;
    //const updateStatusMutation = mutation(UPDATE_ORDER_STATUS);

    loadOrders();

    async function loadOrders() {
        if (!browser) return;
        user = authService.getUser();
        if (user == null || user.role === 'ADMIN') {
            await goto('/');
        }

        const client = new ApolloClient({
            // uri: 'http://localhost:8000/graphql/orders',
            uri: 'https://bwm.happyfir.com/graphql/orders',
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            cache: new InMemoryCache()
        });
        //http://localhost:8000/graphql/quotations
        //'https://bwm.happyfir.com/graphql/orders'
        setClient(client);

        getOrdersEachClientMutation = mutation(GET_ORDERS_FOR_EACH_CLIENT);
        getOrdersEachDeliveryManMutation = mutation(GET_ORDERS_FOR_EACH_DELIVERY_MAN);

        await onMount(async() => {

            let ordersResponse;

            if (user.role === "REGULAR-CLIENT" || user.role === 'GOLD-CLIENT') {
                ordersResponse = await getOrdersEachClientMutation({
                    variables: {
                        clientID: user.id
                    }
                });
                ordersResponse = ordersResponse.data.ordersForEachClient;
                console.log(ordersResponse)
            } else if (user.role === "DELIVERY-MAN" || user.role === "PICKUP-MAN") {
                ordersResponse = await getOrdersEachDeliveryManMutation({
                    variables: {
                        deliveryManID: user.id
                    }
                });
                ordersResponse = ordersResponse.data.ordersForEachDeliveryMan;
            }
            const client = new ApolloClient({
                // uri: 'http://localhost:8000/graphql/create_request',
                uri: 'https://bwm.happyfir.com/graphql/create_request',
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                cache: new InMemoryCache()
            });
            setClient(client);
            // getOrderItemsMutation = mutation(GET_ORDERED_ITEM);
            // getItemMutation = mutation(GET_ITEM);

            // ordersResponse.map(async function (order) {
            //     let orderItemResponse = await getOrderItemsMutation({
            //         variables: {
            //             id: order.orderItems
            //         }
            //     })
                /*let items = []
                await Promise.all(orderItemResponse.data.orderedItem.items.map(async function (item) {
                    let itemResponse = await getItemMutation({
                        variables: {
                            id: item
                        }
                    })
                    items.push(itemResponse.data.item)
                }));
                console.log(items);*/
            //});

            // orders = ordersResponse.map(function (order) {
            //     return {
            //         orderID: order.id,
            //         submissionDate: convertDate(order.orderDate),
            //         orderItems: order.orderItems,
            //         status: convertStatus(order.status),
            //     };
            // });

            finishedLoading = true;
        })
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

    function convertDate(backendDate) {
        return new Date(parseInt(backendDate)).toLocaleDateString([], {year: 'numeric', month: 'long', day: 'numeric'});
    }

    //for delivery man
    function changeOrderStatus() {
        let orderID = 'your_order_id'; // Replace with actual order ID
        let newStatus = 'new_status'; // Replace with the desired new status

        /*const handleUpdateStatus = async () => {
            try {
                const {data} = await updateStatusMutation({variables: {orderID, status: newStatus}});

                // Handle the response data as needed
                console.log('Order status updated successfully:', data.updateOrderStatus);
            } catch (err) {
                // Handle errors
                console.error('Error updating order status:', err);
            }
        };*/
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
