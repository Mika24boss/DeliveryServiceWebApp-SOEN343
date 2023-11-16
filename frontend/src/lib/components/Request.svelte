<script>
    export var quotationID, submissionDate, orderItems, distance;
</script>

<a class="outline" href="/requests/{quotationID}">
    <div class="date">
        {submissionDate}
    </div>
    <div class="items">
        {#each orderItems as item, i}
            {item.quantity} X {item.itemName}{ i === orderItems.length - 1 ? '' : ', '}
        {/each}
    </div>
    <div class="distance">
        {distance}
    </div>
</a>


<style>
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

    .outline {
        min-width: 50em;
        height: 4em;
        outline: 2px solid black;
        border-radius: 1em;
        grid-template-columns: 2fr 10fr 1fr;
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

</style>
