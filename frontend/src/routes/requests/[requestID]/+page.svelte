<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {page} from "$app/stores";

    const requestID = $page.url.pathname.split('/').pop();
    let pageTitle = "Delivery Request #" + requestID;
</script>

<h2>Delivery request #{requestID}</h2>