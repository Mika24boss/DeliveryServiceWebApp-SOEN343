<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<script>
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import authService from '$lib/features/authService.js';
    import {ApolloClient, InMemoryCache} from "@apollo/client/core";
    import {mutation, setClient} from "svelte-apollo";
    import {browser} from "$app/environment";
    import {GET_QUOTATION} from "../../../../mutations/quotationMutation.js";
    import {ADD_PAYMENT} from "../../../../mutations/paymentMutatiion.js";
    import {ADD_ORDER} from "../../../../mutations/ordersMutation.js";


    let subtotal;
    let taxes;
    let total;
    const quotationID = $page.url.pathname.split('/').pop();
    let pageTitle = "Payment | Quotation #" + quotationID;
    let user;
    var isWaiting = true;
    let orderMutation, quotationMutation, quotationInfo, paymentMutation, paymentInfo
    loadPage()

    async function loadPage() {
        if (!browser) return;
        user = authService.getUser();
        const client = new ApolloClient({
            uri: 'https://bwm.happyfir.com/graphql/quotations',
            // uri: 'http://localhost:8000/graphql/create_request',
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            cache: new InMemoryCache()
        });
        setClient(client);
        quotationMutation = mutation(GET_QUOTATION)
        if (user == null || (user.role !== 'GOLD-CLIENT' && user.role !== 'REGULAR-CLIENT')) {
            await goto('/');
        }
        isWaiting = false
        try {
            const response = await quotationMutation({
                variables: {
                    id: quotationID
                }
            })
            quotationInfo = response.data.quotation
            subtotal = quotationInfo.price
            taxes = subtotal * 0.15;
            total = subtotal + taxes;
            console.log(quotationInfo)
        } catch (e) {
            throw Error("Quotation not found")
        }
    }

    async function makePayment() {
        console.log(quotationInfo)
        const client = new ApolloClient({
            uri: 'https://bwm.happyfir.com/graphql/payments',
            // uri: 'http://localhost:8000/graphql/payments',
            cache: new InMemoryCache()
        });
        // console.log(client)
        setClient(client);
        paymentMutation = mutation(ADD_PAYMENT)
        try {
            const response = await paymentMutation({
                variables: {
                    methodOfPayment: "CREDIT",
                    dateOfPayment: new Date().toJSON(),
                    amount: parseInt(subtotal)
                }
            })
            paymentInfo = response.data.addPayment.id
            console.log(paymentInfo)
        } catch (e) {
            throw Error("Fail to create Payment")
        }


        const client2 = new ApolloClient({
            // uri: 'https://bwm.happyfir.com/graphql/orders',
            uri: 'http://localhost:8000/graphql/orders',
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            cache: new InMemoryCache()
        });
        setClient(client2);
        console.log(client2)
        orderMutation = mutation(ADD_ORDER)
        console.log(quotationInfo.orderItems)
        console.log(paymentInfo)
        console.log(quotationInfo.pickUpDate)

        try {
            const response = await orderMutation({
                variables: {
                    orderItems: quotationInfo.orderItems,
                    payment: paymentInfo,
                    pickUpDate: quotationInfo.pickUpDate
                }
            })
            console.log(response)
        } catch (e) {
            throw Error("Order failed")
        }
        alert("Order created!");
        await goto('/quotations');

    }

    // ///////////////////////////javascript api//////////////////////////////////
    // const xhttpr = new XMLHttpRequest();
    // xhttpr.open('GET', 'https://sandbox.api.visa.com/pav/v1/cardvalidation', true);
    //
    // xhttpr.send();
    //
    // xhttpr.onload = ()=> {
    //     if (xhttpr.status === 200) {
    //         const response = JSON.parse(xhttpr.response);
    //         // Process the response data here
    //     } else {
    //         // Handle error
    //     }
    // };
    //
    //
    // const username = 'usmannawaz2879@gmail.com';
    // const password = '#Usman1234';
    // const key = 'C:\\Users\\Dell\\Desktop\\343_Web\\WanderingMangoes-soen343project2023\\Certificates\\key_f1c10f40-62d8-45d2-9591-e80b5da6b6f0.pem';
    // const cert = 'C:\\Users\\Dell\\Desktop\\343_Web\\WanderingMangoes-soen343project2023\\Certificates\\client_cert_f1c10f40-62d8-45d2-9591-e80b5da6b6f0.pem';
    // const buffer = new ArrayBuffer();
    // // var reader = new FileReader();
    //
    // const payload = {
    //     "systemsTraceAuditNumber": "743720",
    //     "cardCvv2Value": "022",
    //     "primaryAccountNumber": "4957030420210462",
    //     "retrievalReferenceNumber": "015221743720",
    //     "cardExpiryDate": "2040-10",
    // };
    //
    // const Options = {
    //     uri: "https://sandbox.api.visa.com/…",
    //     key: "MIIEpAIBAAKCAQEA1QQD2sseIg98KmVK1UzRBTYIsWMR3xkehCYx+J0d92RmAFy/4M+qo3xwByIL8j6JbHlNnvyLHlP+DceKo9OTVuDbqmv4jrLYJAaUwwhDBxcttmU1Iq1sC1AUzlBpPEy6DDwEBfGCVu4TY+0wkAsS7vNJd9Rcqtp1R4ApEVDLOOpFR9qs2J3dj7xU83yy/px9j53yQJ2iqS9T66fXygZa5MB1zm0p22FZqAe06U9BGe2udZCn3TX3Q2DLNNJ//5ludtwzRGxDFSVBc8JRpEtMpTWbXfHu2MwPjlNy49bWySTIbpCWqL3Ocj31zbW9ni/M92nZ9UHry5QTsJBWin5LnQIDAQABAoIBABSZuM22Cwn8OWPYO+546VX5rcmJ7TaINV1OXFLQzw8X1I2AasYRD02UQTlPX5xj0+J7sLgJcGLUeKNYgt3pHjyurk/C9VzHiwOg504dRG4xHaigDQ13fBVz/y8cs7CzMuLwAuuYOaSyjYmCbMnhaElXmelOzk9vpRvvFwmnqJ+uSyVWdXhMkEYn3RGwjMGJVfQtrebf2ckk0jwUQ4XSc60qf0JWo8We2HgJS0oP/RQfYZmwuspykOnUxnrzvZgyoafiL7KvjYBwRYT5L8eZ+bZnYuYxzgEsspMHavFycgnbKxiQAkOsdBDimEIuLRuXu4pZ1WeOs+LTaP92bvIi+sECgYEA8r4QPxCsdN1J2zYtqg5MT3aV5CfuXT403oQC7njGSRWFSgoizj6VKDZ3U13pgujYUyNix8hkI22M+y74XjlOzznJYEWw+SG6n+1+p1NMsGQGjb9B3xWX1cCcEa/05X2OC0bFX2m4hTnyH0I/JcrmMDH1T0W6dTG5iDbXbgqVoJkCgYEA4KZSrSosW2tvCIAXRuU+Bkqlk+5Ipo8k+bC7dz+4sr5r3Z3C4YocpiOJn16C8K0lmu81C6gIDvO6weWcZFeHibrHESmTnfcPlzb88zsxc0hUPciBMxsRLSG7BBswFIEZU2wCrhcVxrO0kR8JFKTNuheOPZAZs8W/P1fRC7KksaUCgYAVZrBj/wJVY1UpoIMyJQSRVPEuJl8blWpv28+uWrOQqfcQaghbiqT34KVwki0OP50i51HEL2S0wunVE3UOSZsrJfsdI8fQjyq3AudRtURjoM37HUufcXXrgInB/XNn8EPftqOcH+QGyu8P1nVezZ6xzRXFoW4o+vNSkRM5PnGmsQKBgQCsx59M6ePFyEJUklfUwhnLMvxYY2tjFzNEC2aTl+HRL928TEsHtnbEXQ7LESC6RSFoIVR2C51vCov390YqcpufFZVnoMeVNeC616MC2+LznIyWHDEqgkXapVe2F8cJ7iTxYWBKTx0Df1GAUBNm2j4UQ2u186+g8ZVe/YadbZ93tQKBgQDwUVAfCrIvDDbZme79y4jk6dFnTH3hZllQFvh1H2oBUDBb2slrWaZefpzdNbCeKe3fxFTJEKngXQVojfJT9f+l0w9xp6ncassgkOMoYsk+KU2VB3jgyeyO1AnMFzfp+kvAmqLQfOzs9e8XkdOLQfgWwBnQm5tY3gza3ovN47RoNQ==",
    //     cert: "MIIEATCCAumgAwIBAgIIUs6Vw3xQMCswDQYJKoZIhvcNAQELBQAwMTEOMAwGA1UEAwwFVkRQQ0ExEjAQBgNVBAoMCVZEUFZJU0FDQTELMAkGA1UEBhMCVVMwHhcNMjMxMTMwMDUwNjUwWhcNMjUwNzIxMDQyNzM3WjCBzjEbMBkGCSqGSIb3DQEJARYMdmRwQHZpc2EuY29tMTQwMgYKCZImiZPyLGQBAQwkZjFjMTBmNDAtNjJkOC00NWQyLTk1OTEtZTgwYjVkYTZiNmYwMS0wKwYDVQQDDCQxZTEwMGU1Zi05ZDEzLTQzMDItODA4ZC04YjBlOWQ1NDE4MGExDDAKBgNVBAsMA1ZEUDENMAsGA1UECgwEVklTQTETMBEGA1UEBwwKRm9zdGVyQ2l0eTELMAkGA1UECAwCQ0ExCzAJBgNVBAYTAlVTMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1QQD2sseIg98KmVK1UzRBTYIsWMR3xkehCYx+J0d92RmAFy/4M+qo3xwByIL8j6JbHlNnvyLHlP+DceKo9OTVuDbqmv4jrLYJAaUwwhDBxcttmU1Iq1sC1AUzlBpPEy6DDwEBfGCVu4TY+0wkAsS7vNJd9Rcqtp1R4ApEVDLOOpFR9qs2J3dj7xU83yy/px9j53yQJ2iqS9T66fXygZa5MB1zm0p22FZqAe06U9BGe2udZCn3TX3Q2DLNNJ//5ludtwzRGxDFSVBc8JRpEtMpTWbXfHu2MwPjlNy49bWySTIbpCWqL3Ocj31zbW9ni/M92nZ9UHry5QTsJBWin5LnQIDAQABo38wfTAMBgNVHRMBAf8EAjAAMB8GA1UdIwQYMBaAFK/dbragS5x5uRYIYuYjMRCnguuhMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDBDAdBgNVHQ4EFgQU1vOdmHQQSslB7epWb0moeg9c070wDgYDVR0PAQH/BAQDAgXgMA0GCSqGSIb3DQEBCwUAA4IBAQCKEHbGkKiRFG48M+DaRO4cO9pTKqsGq+uZ/KACKoth3x1Hipm3XID8McHI229qMoBCFo6XbRjt28CmZccAK+gYkwBhQE1w2xpAQdr3zJ7DN51AlM//Cwk2C6OqTX+eODEAulK7/An/dLKEShL6ZjyvU9nYpOnUH7SPMfkYRRGcJFiRM6iz7xXpfbP2OsdzMptGrlxrt1CiLPEu2DRNZfZMqatOWo1Vgcw0Td1bIEH8AfOzjc5ZX9JbiOAfO1sQdn4hYKWRQZnWcS7E2lH+wCRU82jK2HJ4vR3bkIfb5Jf9YuYc2n4BP1ocsArO1Rf4lW1RflWIYV/vKbVl/TQYIfof",
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //         'Authorization': 'Basic ' + btoa(new ArrayBuffer().toString(username + ':' + password))
    //     },
    //     body: payload
    // };
    //
    // onMount(async () => {
    //     user = authService.getUser();
    //     if (user == null || (user.role !== 'GOLD-CLIENT' && user.role !== 'REGULAR-CLIENT')) {
    //         await goto('/');
    //     }
    // });

    // async function makePayment() {
    //
    //     const xhttpr = new XMLHttpRequest();
    //     await xhttpr.open('POST', 'https://sandbox.api.visa.com/pav/v1/cardvalidation', true);
    //
    //     xhttpr.onreadystatechange = () => {
    //         // Call a function when the state changes.
    //         if (xhttpr.readyState === XMLHttpRequest.DONE && xhttpr.status === 200) {
    //             // Request finished. Do processing here.
    //             alert("Order created!");
    //             console.log(xhttpr.response());
    //         }
    //     };
    //
    //     xhttpr.send(Options);
    // }
    //
    // function getFieldData() {
    //     let cardNum = document.getElementById('cardNum').value;
    //     let acquirerCountryCode = document.getElementById('acquirerCountryCode').value;
    //     let acquiringBin = document.getElementById('acquiringBin').value;
    //     let expiryDate = document.getElementById('expiryDate').value;
    //     let cvc = document.getElementById('cvc').value;
    //     let streetAddress = document.getElementById('streetAddress').value;
    //     let postalcode = document.getElementById('zipCode').value;
    //     let alertText = '';
    //     if (!cardNum.trim()) alertText += 'Missing your name!\n';
    //     if (!acquirerCountryCode.trim()) alertText += 'Missing delivery address!\n';
    //     if (!expiryDate.trim()) alertText += 'Missing delivery province!\n';
    //     if (!streetAddress.trim()) alertText += 'Missing delivery country!\n';
    //     if (!postalcode.trim()) alertText += 'Missing delivery postal code!\n';
    //     if (!cvc.trim()) alertText += "Missing seller's name!\n";
    //     if (alertText) {
    //         alert(alertText);
    //         return null;
    //     } else
    //         return {
    //             cardNum,
    //             acquirerCountryCode,
    //             acquiringBin,
    //             expiryDate,
    //             cvc,
    //             streetAddress,
    //             postalcode,
    //
    //         };
    // }


</script>
{#if isWaiting}

{:else}
    <h1>Payment for quotation</h1>
    <h2>Enter payment details:</h2>
    <div class="payment-page">
        <div class="payment-section">
            <div class="payment-details column">
                <div class='formGroup'><input type="text" id="cardNum" placeholder="Card number" required></div>
                <div class='formGroup'><input type="text" id="expiryDate" placeholder="MM/YY" required></div>
                <div class='formGroup'><input type="text" id="cvc" placeholder="CVC" required></div>
                <div class='formGroup'><input type="text" id="streetAddress" placeholder="Street Address" required>
                </div>
                <div class='formGroup'><input type="text" id="acquiringBin"
                                              placeholder="Apt, unit, suite, etc. (optional)"
                                              required></div>
                <div class='formGroup'><input type="text" id="country" placeholder="Country" required></div>
                <div class='formGroup'><input type="text" id="city" placeholder="City" required></div>
                <div class='formGroup'><input type="text" id="state" placeholder="State" required></div>
                <div class='formGroup'><input type="text" id="zipCode" placeholder="Zip code" required></div>
            </div>
            <div class="order-summary column">
                <div class='subtotal'>Subtotal: {subtotal}</div>
                <div class='Taxes'>Taxes: {taxes}</div>
                <div class='total'>Total: {total}</div>
            </div>
        </div>
        <div class='btn-container'>
            <button class="btn-signin centerBlock" type="submit" on:click="{makePayment}">Pay</button>
        </div>
    </div>
{/if}

<style>

    * {
        box-sizing: border-box;
    }

    .payment-section {
        width: 100%;
        margin-top: 2%;
        display: flex;
        justify-content: center;
    }

    .order-summary {
        text-align: left;
        vertical-align: middle;
    }

    .payment-details {
        position: relative;
        align-self: center;
    }

    .formGroup {
        text-align: right;
        width: 100%;
    }

    .formGroup input, .formGroup input:focus {
        border: none;
        width: 50%;
        border-bottom: 2px solid orange;
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: bold;
        background-color: transparent;
    }

    .formGroup input::placeholder {
        color: black;
    }

    .column {
        width: 60%;
        padding: 10px;
    }

    .payment-section:after {
        content: "";
        display: table;
        clear: both;
    }

    .centerBlock {
        text-align: center;
        display: block;
        margin: 10px;
    }

    .btn-signin {
        width: 20em;
        height: 5em;
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
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .btn-signin::before {
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

    .btn-signin:hover::before {
        transform: translateX(0);
    }
</style>