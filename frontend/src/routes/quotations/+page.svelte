<svelte:head>
    <title>Quotations</title>
</svelte:head>

<script>
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
    import {goto} from "$app/navigation";
    import Quotation from "$lib/components/Quotation.svelte";
    import {browser} from "$app/environment";
    import authService from "$lib/features/authService.js";
    import {ApolloClient, InMemoryCache} from "@apollo/client/core";
    import {mutation, setClient} from "svelte-apollo";
    import {GET_QUOTATIONS_FOR_EACH_CLIENT} from "../../mutations/quotationMutation.js";
    import {GET_ORDERED_ITEM} from "../../mutations/orderedItemMutation.js";
    import {GET_ITEM} from "../../mutations/itemsMutation.js";

    let user;
    let finishedLoading = false;
    let quotations = [];

    loadQuotations();

    async function loadQuotations() {
        if (!browser) return;
        user = authService.getUser();
        if (user == null || (user.role !== 'GOLD-CLIENT' && user.role !== 'REGULAR-CLIENT')) {
            await goto('/');
            return
        }
        const client = new ApolloClient({
            //uri: 'https://bwm.happyfir.com/graphql/quotations',
            //uri: 'http://localhost:8000/graphql/create_request',
            uri: 'https://bwm.happyfir.com/graphql/create_request',
            cache: new InMemoryCache()
        });
        //http://localhost:8000/graphql/quotations
        //'https://bwm.happyfir.com/graphql/orders'
        setClient(client);

        const getQuotationMutation = mutation(GET_QUOTATIONS_FOR_EACH_CLIENT);
        const getOrderItemsMutation = mutation(GET_ORDERED_ITEM)
        const getItemMutation = mutation(GET_ITEM)


        onMount(async () => {
            let quotationsResponse = await getQuotationMutation({
                variables: {
                    clientID: user.id
                }
            });

            quotationsResponse = quotationsResponse.data.quotationForEachClient;
            quotationsResponse = quotationsResponse.filter((m) => {
                return !(m.price === undefined || m.price === 0);
            });

            quotations = await Promise.all(quotationsResponse.map(async function (quote) {
                console.log(quote.orderItems)
                let orderItemResponse = await getOrderItemsMutation({
                    variables: {
                        id: quote.orderItems
                    }
                })
                let items = []
                await Promise.all(orderItemResponse.data.orderedItem.items.map(async function (item) {
                    let itemResponse = await getItemMutation({
                        variables: {
                            id: item
                        }
                    })
                    items.push(itemResponse.data.item)
                }));

                return {
                    quotationID: quote.id,
                    orderItems: items,
                    price: quote.price
                };
            }));

            finishedLoading = true;
        })
    }

    //payment


</script>

<div class='quotations'>
    {#if !finishedLoading}
        <LoadingAnimation/>
    {:else}
        <div class='quotations-section'>
            <button class="btn-createQuotation" type="submit" on:click={()=> goto('/create_request')}> + Create New
                Quotation
            </button>
            <h1>Quotations</h1>
            <div class='quotations-container'>
                {#each quotations as quotation(quotation.quotationID)}
                    <Quotation {...quotation}/>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>

    .quotations-section {
        margin-top: 2%;
    }

    .btn-createQuotation {
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

    .btn-createQuotation::before {
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

    .btn-createQuotation:hover::before {
        transform: translateX(0);
    }

    .quotations-container {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
    }

</style>
