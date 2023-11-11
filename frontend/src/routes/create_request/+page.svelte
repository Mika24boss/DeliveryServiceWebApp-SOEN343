<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {preventTabClose} from '$lib/features/preventTabClose.js'
    import {DateInput} from 'date-picker-svelte';
    import {goto} from "$app/navigation";

    let hasChanged = false;
    let pageTitle = "Create Delivery Request";
    let date = new Date();
    let maxDate = new Date((date.getFullYear() + 1) + '-' + date.getMonth() + '-' + date.getDate());
    let orderItems = [{itemID: 0, itemName: "", quantity: ""}];

    function changedText() {
        hasChanged = true;
        pageTitle = '* ' + "Create Delivery Request";
    }

    async function submit() {
        await goto('/quotations');
    }

    function addItem() {
        let newID = 0;
        if (orderItems.length > 0)
            newID = orderItems[orderItems.length - 1].itemID + 1;
        orderItems.push({itemID: newID, itemName: "", quantity: ""});
        orderItems = orderItems;
    }

    function remove(i) {
        orderItems.splice(i, 1);
        orderItems = orderItems;
    }

    function update(e) {
        if (e.target.id === "itemName") {
            orderItems[e.target.dataset.index].itemName = e.target.value;
        } else {
            orderItems[e.target.dataset.index].quantity = e.target.value;
        }
    }
</script>

<div class="header">
    <h1 class="title" use:preventTabClose={hasChanged}>Create A Delivery Request</h1>
    <button class="submitBtn" on:click={submit}>Submit</button>
</div>

<div class="informationSection">

    <div class="buyerInfo">
        <h2>Delivery address</h2>
        <input type='text' id='buyerName' placeholder='Your full name' on:keydown={changedText}/>
        <input type='text' id='deliveryStreet' placeholder='Street' on:keydown={changedText}/>
        <input type='text' id='deliveryCity' placeholder='City' on:keydown={changedText}/>
        <input type='text' id='deliveryProvince' placeholder='State/Province' on:keydown={changedText}/>
        <input type='text' id='deliveryCountry' placeholder='Country' on:keydown={changedText}/>
        <input type='text' id='deliveryPostalCode' placeholder='Postal code/ZIP code' on:keydown={changedText}/>
    </div>

    <div class="sellerInfo">
        <h2>Pick up address</h2>
        <input type='text' id='sellerName' placeholder='Full name of seller' on:keydown={changedText}/>
        <input type='text' id='pickupStreet' placeholder='Street' on:keydown={changedText}/>
        <input type='text' id='pickupCity' placeholder='City' on:keydown={changedText}/>
        <input type='text' id='pickupProvince' placeholder='State/Province' on:keydown={changedText}/>
        <input type='text' id='pickupCountry' placeholder='Country' on:keydown={changedText}/>
        <input type='text' id='pickupPostalCode' placeholder='Postal code/ZIP code' on:keydown={changedText}/>
        <h3 class="dateTitle">Pick up date and time:</h3>
        <DateInput class="datePicker" min='{new Date()}' max='{maxDate}' bind:value={date} format='yyyy-MM-dd HH:mm'/>
    </div>

</div>

<h2>Order items</h2>
<button class="addItemBtn" on:click={addItem}>+ Add</button>
{#if orderItems.length > 0}
    <div class="columnTitles">
        <span class="itemNameTitle">Name</span>
        <span class="itemQtyTitle">Quantity</span>
    </div>
{/if}

{#each orderItems as item, i (item.itemID)}
    <div class="itemNum">
        #{i + 1}
    </div>
    <div class="item">
        <input class="itemName" type='text' id='itemName' placeholder='Item name' on:keydown={changedText}
               data-index={i}
               on:input={update}/>
        <input class="itemQty" type='number' id='quantity' placeholder='Qty' min=1 value=1 on:keydown={changedText}
               data-index={i}
               on:input={update}/>
        <button class="removeItemBtn" on:click={() => remove(i)}>Remove</button>
    </div>
{/each}

<style>

    .header {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        margin-bottom: 3em;
    }

    .submitBtn {
        display: inline-block;
        padding: 0.9em 1.8em;
        font-size: 24px;
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
        grid-column: 3;
    }

    .submitBtn::before {
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

    .submitBtn:hover::before {
        transform: translateX(0);
    }

    @media (max-width: 1000px) {
        .informationSection {
            gap: 3em;
            grid-template-columns: 1fr;
        }

        .buyerInfo {
            grid-template-rows: repeat(7, 1fr);
        }
    }

    @media (min-width: 1001px) {
        .informationSection {
            gap: 10em;
            grid-template-columns: 1fr 1fr;
        }

        .buyerInfo {
            grid-template-rows: repeat(7, 1fr) 2em 1fr;
        }
    }

    .informationSection {
        display: grid;
    }

    .buyerInfo {
        display: grid;
        justify-items: stretch;
        grid-gap: 1em;
    }

    .sellerInfo {
        display: grid;
        justify-items: stretch;
        grid-gap: 1em;
        grid-template-rows: repeat(7, 1fr) 2em 1fr;
    }

    .addItemBtn {
        max-width: 200px;
        display: inline-block;
        padding: 0.9em 1.8em;
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

    .addItemBtn::before {
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

    .addItemBtn:hover::before {
        transform: translateX(0);
    }

    .removeItemBtn {
        max-width: 100px;
        height: 3em;
        display: inline-block;
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

    .removeItemBtn::before {
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

    .removeItemBtn:hover::before {
        transform: translateX(0);
    }

    .columnTitles {
        display: grid;
        grid-template-columns: 315px 50px;
        justify-items: center;
        margin-top: 1em;
    }

    .itemNameTitle {
        font-size: 16px;
        font-weight: 700;
    }

    .itemQtyTitle {
        font-size: 16px;
        font-weight: 700;
    }

    .itemNum {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        font-size: 16px;
        font-weight: 700;
    }

    .itemName {
        height: 3em;
        width: 300px;
    }

    .itemQty {
        height: 3em;
        width: 50px;
    }

    input {
        font-size: 16px;
    }

</style>