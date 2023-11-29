<svelte:head>
    <title>Pending Requests</title>
</svelte:head>

<script>
    import {browser} from "$app/environment";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import LoadingAnimation from "$lib/components/LoadingAnimation.svelte";
    import Request from "$lib/components/Request.svelte";
    import authService from "$lib/features/authService.js";
    import {ApolloClient, InMemoryCache} from "@apollo/client/core";
    import {mutation, setClient} from "svelte-apollo";
    import {GET_QUOTATIONS} from "../../mutations/quotationMutation.js";
    import {GET_ORDERED_ITEM} from "../../mutations/orderedItemMutation.js";
    import {GET_ITEM} from "../../mutations/itemsMutation.js";


    let requests = [];
    let isWaiting = true;
    let user;
    const client = new ApolloClient({
        uri: 'https://bwm.happyfir.com/graphql/create_request',
        // uri: 'http://localhost:8000/graphql/create_request',
        cache: new InMemoryCache()
    });
    setClient(client);
    const getQuotationsMutation = mutation(GET_QUOTATIONS)
    const getOrderItemsMutation = mutation(GET_ORDERED_ITEM)
    const getItemMutation = mutation(GET_ITEM)
    loadRequests();

    function convertDate(backendDate) {
        return new Date(parseInt(backendDate)).toLocaleDateString([], {year: 'numeric', month: 'long', day: 'numeric'});
    }

    async function loadRequests() {
        if (!browser) return;
        await onMount(() => {
            user = authService.getUser();
        })

        if (user == null || user.role !== 'ADMIN') {
            await goto('/');
            return;
        }
        const response = await getQuotationsMutation()

        requests = await Promise.all(response.data.quotations.map(async function (quotation) {
            console.log(quotation.orderItems)
            let orderItemResponse = await getOrderItemsMutation({
                variables: {
                    id: quotation.orderItems
                }
            })
            let items = []
            // orderItemResponse.data.orderedItem.items.forEach(getItems)
            await Promise.all(orderItemResponse.data.orderedItem.items.map(async function (item) {
                let itemResponse = await getItemMutation({
                    variables: {
                        id: item
                    }
                })
                items.push(itemResponse.data.item)
            }))
            return {
                quotationID: quotation.id,
                submissionDate: convertDate(quotation.orderDate),
                orderItems: items,
                distance: quotation.distance,
                price: quotation.price
            };
        }));
        let orderItems = [{name: 'Mango', quantity: '10'},
            {name: 'Couch', quantity: '500'},
            {name: 'Number 10 machine screw (0.190 inch major diameter)', quantity: '51700'}];
        requests.push({
            quotationID: '57f5en320a83',
            submissionDate: 'November 13, 2023',
            orderItems: orderItems,
            distance: '5 km',
            price: 0
        });
        requests = requests.filter((m) => {
            return (m.price === undefined || m.price === 0);
        });
        isWaiting = false;
    }


</script>

{#if isWaiting}
    <LoadingAnimation/>
{:else}
    <h1>Requests</h1>
    <div class='requests'>
        {#each requests as request}
            <Request {...request}></Request>
        {/each}

    </div>
{/if}

<style>

    h1 {
        color: black;
    }

    .requests {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
    }

</style>