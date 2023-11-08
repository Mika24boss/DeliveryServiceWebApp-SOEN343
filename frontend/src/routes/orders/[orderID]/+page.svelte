<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {page} from "$app/stores";

    const orderID = $page.url.pathname.split('/').pop();
    let pageTitle = "Order #" + orderID;
</script>

<h2>Order #{orderID}</h2>