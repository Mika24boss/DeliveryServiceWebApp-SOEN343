<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {page} from "$app/stores";

    const urlElements = $page.url.pathname.split('/');
    const quotationID = urlElements[urlElements.length - 2];
    let pageTitle = "Payment | Quotation #" + quotationID;
</script>

<h2>Payment for quotation #{quotationID}</h2>