<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {page} from "$app/stores";

    const quotationID = $page.url.pathname.split('/').pop();
    let pageTitle = "Payment | Quotation #" + quotationID;
</script>

<h2>Payment for quotation #{quotationID}</h2>