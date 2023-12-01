<script>
    import {preventTabClose} from '$lib/features/preventTabClose.js';
    import {DateInput} from 'date-picker-svelte';
    import {goto} from '$app/navigation';
    import authService from '$lib/features/authService.js';
    import {ADD_ITEM} from '../../mutations/itemsMutation.js';
    import {ADD_ADDRESS} from '../../mutations/addressesMutation.js';
    import {mutation, setClient} from 'svelte-apollo';
    import {browser} from '$app/environment';
    import {ADD_QUOTATION} from "../../mutations/quotationMutation.js";
    import {ADD_ORDERED_ITEM} from "../../mutations/orderedItemMutation.js";
    import {ApolloClient, InMemoryCache} from "@apollo/client/core";


    let hasChanged = false;
    let pageTitle = 'Create Delivery Request';
    let date = new Date();
    let maxDate = new Date(date.getFullYear() + 1 + '-' + date.getMonth() + '-' + date.getDate());
    let orderItems = [];
    let user;
    let addAddressMutation
    let addItemMutation
    let addQuotationMutation
    let addOrderItemMutation
    loadPage();

    async function loadPage() {
        if (!browser) return;
        user = authService.getUser();
        const client = new ApolloClient({
            uri: 'https://bwm.happyfir.com/graphql/create_request',
            // uri: 'http://localhost:8000/graphql/create_request',
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            cache: new InMemoryCache()
        });
        setClient(client);
        if (user == null || (user.role !== 'GOLD-CLIENT' && user.role !== 'REGULAR-CLIENT')) {
            await goto('/');
        }
        //adding order after hitting submit button
        addAddressMutation = mutation(ADD_ADDRESS);
        addItemMutation = mutation(ADD_ITEM);
        addQuotationMutation = mutation(ADD_QUOTATION);
        addOrderItemMutation = mutation(ADD_ORDERED_ITEM);
    }

    function changedText() {
        hasChanged = true;
        pageTitle = '* ' + 'Create Delivery Request';
    }


    //adding order to ADD_ITEM

    async function addItem() {
        let newID = 0;
        if (orderItems.length > 0) newID = orderItems[orderItems.length - 1].itemID + 1;
        orderItems.push({itemID: newID, itemName: '', quantity: 1});
        orderItems = orderItems;

    }

    function remove(i) {
        orderItems.splice(i, 1);
        orderItems = orderItems;
    }

    function update(e) {
        if (e.target.id === 'itemName') {
            orderItems[e.target.dataset.index].itemName = e.target.value;
        } else {
            orderItems[e.target.dataset.index].quantity = e.target.value;
        }
    }

    //main transition
    async function createRequest() {
        console.log('Creating request...');
        const data = getFieldData();
        if (!data) return;
        const orderedItemToSend = []

        try {
            let ids = [];
            for (let index = 0; index < orderItems.length; index++) {
                const response = await addItemMutation({
                    variables: {
                        name: orderItems[index].itemName,
                        quantity: parseInt(orderItems[index].quantity)
                    }
                });
                orderedItemToSend.push(response.data.addItem.id)

                console.log('Some item: ' + response);
                // // Access the result from the mutation response
                // const newItem = response.data.addItem;
                // // Add the new item to the local orderItems array
                // let newID = 0;
                // if (orderItems.length > 0) {
                //     newID = orderItems[orderItems.length - 1].itemID + 1;
                // }
            }
            // if error
        } catch (error) {
            console.error('Error adding item:', error);
        }
        let shippingAddressResponse;
        let pickUpAddressResponse;
        try {
            const response1 = await addAddressMutation({
                variables: {
                    street: document.getElementById('deliveryAddress').value,
                    city: document.getElementById('deliveryCity').value,
                    state: document.getElementById('deliveryProvince').value,
                    province: document.getElementById('deliveryProvince').value,
                    country: document.getElementById('deliveryCountry').value,
                    postalCode: document.getElementById('deliveryPostalCode').value
                }
            })
            shippingAddressResponse = response1.data.addAddress.id;
            const response2 = await addAddressMutation({
                variables: {
                    street: document.getElementById('pickupAddress').value,
                    city: document.getElementById('pickupCity').value,
                    state: document.getElementById('pickupProvince').value,
                    province: document.getElementById('pickupProvince').value,
                    country: document.getElementById('pickupCountry').value,
                    postalCode: document.getElementById('pickupPostalCode').value
                }
            })
            pickUpAddressResponse = response2.data.addAddress.id;
            // Optionally, navigate to another page
            console.log('Response mutation: ' + response1);
            //await goto('/quotations');
        } catch (error) {
            console.error('Error adding address:', error);
            // Handle error as needed
        }
        let orderItemsToSendResponse;
        try { //adding orderedItems
            const response = await addOrderItemMutation({
                variables: {
                    items: orderedItemToSend
                }
            });
            orderItemsToSendResponse = response.data.addOrderedItem.id;
            // Optionally, navigate to another page
            console.log('AddOrderItemsResponse mutation: ' + response);
            //await goto('/quotations');
        } catch (error) {
            console.error('Error AddorderItems:', error);
            // Handle error as needed
        }
        try {//adding quotation
            const response123 = await addQuotationMutation({
                variables: {
                    pickUpAddress: pickUpAddressResponse,
                    shippingAddress: shippingAddressResponse,
                    distance: Math.floor(Math.random() * 3500 + 100) / 10,
                    pickUpDate: date.toJSON(),
                    orderItems: orderItemsToSendResponse
                }
            });
            // Optionally, navigate to another page
            console.log('Response mutation: ' + response123);
            alert("Success")
            await goto('/quotations');

        } catch (error) {
            console.error('Error adding quotation:', error);
            // Handle error as needed
        }
    }

    function getFieldData() {
        let buyerName = document.getElementById('buyerName').value;
        let deliveryAddress = document.getElementById('deliveryAddress').value;
        let deliveryCity = document.getElementById('deliveryCity').value;
        let deliveryProvince = document.getElementById('deliveryProvince').value;
        let deliveryCountry = document.getElementById('deliveryCountry').value;
        let deliveryPostalCode = document.getElementById('deliveryPostalCode').value;
        let sellerName = document.getElementById('sellerName').value;
        let pickupAddress = document.getElementById('pickupAddress').value;
        let pickupCity = document.getElementById('pickupCity').value;
        let pickupProvince = document.getElementById('pickupProvince').value;
        let pickupCountry = document.getElementById('pickupCountry').value;
        let pickupPostalCode = document.getElementById('pickupPostalCode').value;
        let alertText = '';
        if (!buyerName.trim()) alertText += 'Missing your name!\n';
        if (!deliveryAddress.trim()) alertText += 'Missing delivery address!\n';
        if (!deliveryCity.trim()) alertText += 'Missing delivery city!\n';
        if (!deliveryProvince.trim()) alertText += 'Missing delivery province!\n';
        if (!deliveryCountry.trim()) alertText += 'Missing delivery country!\n';
        if (!deliveryPostalCode.trim()) alertText += 'Missing delivery postal code!\n';
        if (!sellerName.trim()) alertText += "Missing seller's name!\n";
        if (!pickupAddress.trim()) alertText += 'Missing pickup address!\n';
        if (!pickupCity.trim()) alertText += 'Missing pickup city!\n';
        if (!pickupProvince.trim()) alertText += 'Missing pickup province!\n';
        if (!pickupCountry.trim()) alertText += 'Missing pickup country!\n';
        if (!pickupPostalCode.trim()) alertText += 'Missing pickup postal code!\n';
        if (date < new Date()) alertText += 'Missing pickup date!\n';
        if (orderItems.length === 0) alertText += 'Missing order item(s)!\n';
        for (let i = 0; i < orderItems.length; i++) {
            if (orderItems[i].itemName.trim().length === 0)
                alertText += 'Missing name for item #' + (i + 1) + '!\n';
            if (orderItems[i].quantity < 1) alertText += 'Invalid quantity for item #' + (i + 1) + '!\n';
        }
        if (alertText) {
            alert(alertText);
            return null;
        } else
            return {
                buyerName,
                deliveryAddress,
                deliveryCity,
                deliveryProvince,
                deliveryCountry,
                deliveryPostalCode,
                sellerName,
                pickupAddress,
                pickupCity,
                pickupProvince,
                pickupCountry,
                pickupPostalCode,
                date
            };
    }
</script>

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

{#await user then user}
    <div class="header">
        <h1 use:preventTabClose={hasChanged}>Create A Delivery Request</h1>
        <button class="payment-button" on:click={createRequest}>Submit</button>
    </div>

    <div class="informationSection">
        <div class="buyerInfo">
            <h2>Delivery address</h2>
            <input type="text" id="buyerName" placeholder="Your full name" on:keydown={changedText}/>
            <input type="text" id="deliveryAddress" placeholder="Address" on:keydown={changedText}/>
            <input type="text" id="deliveryCity" placeholder="City" on:keydown={changedText}/>
            <input
                    type="text"
                    id="deliveryProvince"
                    placeholder="State/Province"
                    on:keydown={changedText}
            />
            <input type="text" id="deliveryCountry" placeholder="Country" on:keydown={changedText}/>
            <input
                    type="text"
                    id="deliveryPostalCode"
                    placeholder="Postal code/ZIP code"
                    on:keydown={changedText}
            />
        </div>

        <div class="sellerInfo">
            <h2>Pick up address</h2>
            <input
                    type="text"
                    id="sellerName"
                    placeholder="Full name of seller"
                    on:keydown={changedText}
            />
            <input type="text" id="pickupAddress" placeholder="Address" on:keydown={changedText}/>
            <input type="text" id="pickupCity" placeholder="City" on:keydown={changedText}/>
            <input
                    type="text"
                    id="pickupProvince"
                    placeholder="State/Province"
                    on:keydown={changedText}
            />
            <input type="text" id="pickupCountry" placeholder="Country" on:keydown={changedText}/>
            <input
                    type="text"
                    id="pickupPostalCode"
                    placeholder="Postal code/ZIP code"
                    on:keydown={changedText}
            />
            <h3 class="dateTitle">Pick up date and time:</h3>
            <DateInput
                    class="datePicker"
                    min={new Date()}
                    max={maxDate}
                    bind:value={date}
                    format="yyyy-MM-dd HH:mm"
            />
        </div>
    </div>

    <h2>Order items</h2>
    <button class="payment-button addItemBtn" on:click={addItem}>+ Add</button>
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
            <input
                    class="itemName"
                    type="text"
                    id="itemName"
                    placeholder="Item name"
                    on:keydown={changedText}
                    data-index={i}
                    on:input={update}
            />
            <input
                    class="itemQty"
                    type="number"
                    id="quantity"
                    placeholder="Qty"
                    min="1"
                    value="1"
                    on:keydown={changedText}
                    data-index={i}
                    on:input={update}
            />
            <button class="payment-button removeItemBtn" on:click={() => remove(i)}>Remove</button>
        </div>
    {/each}
{/await}

<style>
    h1 {
        color: black;
    }

    .header {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        margin-bottom: 3em;
    }

    .payment-button {
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

    .payment-button::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: orange;
        transform: translateX(-100%);
        transition: all 0.3s;
        z-index: -1;
    }

    .payment-button:hover::before {
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

    input {
        color: black;
        border: none;
        border-bottom: 2px solid orange;
        font-size: 18px;
        font-weight: bold;
        background-color: transparent;
    }

    input::placeholder {
        color: black;
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
        font-size: 16px;
    }

    .removeItemBtn {
        max-width: 150px;
        height: 3.5em;
        font-size: 16px;
    }

    .columnTitles {
        display: grid;
        grid-template-columns: 320px 50px;
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
        margin-right: 10px;
    }

    .itemQty {
        height: 3em;
        width: 50px;
    }
</style>
