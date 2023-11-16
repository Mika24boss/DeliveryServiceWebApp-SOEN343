<script>
    import {goto} from "$app/navigation";

    export var quotationID, submissionDate, orderItems, distance;

    async function onClick() {
        await goto('/quotations' + '/payment/' + quotationID);
    }

</script>

<div class="outline" id={quotationID}>
    <a class="date" href="/quotations/{quotationID}">
        {submissionDate}
    </a>
    <a class="items" href="/quotations/{quotationID}">
        {#each orderItems as item, i}
            {item.quantity} X {item.itemName}{ i === orderItems.length - 1 ? '' : ', '}
        {/each}
    </a>
    <a class="distance" href="/quotations/{quotationID}">
        {distance}
    </a>
    <button class="payment-button" type="submit" on:click={onClick}>
        Pay
    </button>
</div>

<style>

    .outline {
        min-width: 50em;
        height: 4em;
        outline: 2px solid black;
        border-radius: 1em;
        grid-template-columns: 2fr 8fr 1fr 1fr;
        display: grid;
        align-items: center;
        gap: 1em;
        padding: 0 1em;
        text-decoration: none;
    }

    .items {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .date {
        text-align: left;
    }

    a {
        text-decoration: none;
    }

    a:link {
        color: black;
    }

    a:visited {
        color: black;
    }

    a:hover {
        color: white;
        transition: 0.7s;
    }

    a:active {
        color: black;
    }

    .payment-button {
        width: 90%;
        height: 90%;
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
