<svelte:head>
    <title>Quotations</title>
</svelte:head>

<script>
    import {onMount} from 'svelte';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
    import {goto} from "$app/navigation";
    import Quotation from "$lib/components/Quotation.svelte";
    import {browser} from "$app/environment";

    let user;
    let finishedLoading = false;
    let quotations = [];


    onMount(() => {
        user = JSON.parse(localStorage.getItem('user'));
        loadJobs();
    });

    async function loadJobs() {
        if (!browser) return;
        // await onMount(() => {
        //     //user = authService.getUser();
        //
        // })
        user = 'TO CHANGE';
        if (user == null) {
            await goto('/');
        } else {
            //const requests = await jobService.getJobs(user.token);
            let orderItems = [{itemName: 'Mango', quantity: '10'},
                {itemName: 'Couch', quantity: '500'},
                {itemName: 'Number 10 machine screw (0.190 inch major diameter)', quantity: '51700'}];
            quotations.push({
                quotationID: '57f5en320a83',
                submissionDate: 'Fri Nov 17 2023 17:11:22',
                orderItems: orderItems,
                distance: '5 km'
            });
            quotations = quotations;
        }
        finishedLoading = true;
    }

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
