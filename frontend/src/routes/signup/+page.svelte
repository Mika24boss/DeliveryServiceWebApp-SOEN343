<svelte:head>
    <title>Sign-up</title>
</svelte:head>

<script>
    import {goto} from '$app/navigation';
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
    import {mutation, setClient} from "svelte-apollo";
    import {ApolloClient, InMemoryCache} from "@apollo/client/core";
    import {ADD_DELIVERY_MAN} from "../../mutations/peopleMutation/deliveryManMutation.js";
    import {ADD_CLIENT} from "../../mutations/peopleMutation/clientMutation.js";
    import {hasUpdated} from "$lib/stores/updateUser.js";

    const client = new ApolloClient({
        uri: "https://bwm.happyfir.com/graphql/people",
        cache: new InMemoryCache(),
    });

    setClient(client);
    const signUpDeliveryManMutation = mutation(ADD_DELIVERY_MAN);
    const signUpClientMutation = mutation(ADD_CLIENT);

    let name, email, password, phoneNumber;
    let role = "customer";
    let isWaiting = false;
    let hasMissingFields = false;

    async function onSubmit() {
        name = document.getElementById('name').value;
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;
        phoneNumber = document.getElementById('phone').value;

        hasMissingFields = name === "" || role === "" || email === "" || password === "" || phoneNumber === "";
        if (hasMissingFields) {
            return;
        }

        isWaiting = true;
        try {
            if (role === "employee") {
                const response = await signUpDeliveryManMutation({
                    variables: {
                        name: name,
                        emailAddress: email,
                        loginInfo: password,
                        phoneNumber: phoneNumber
                    }
                })
                localStorage.setItem('user', JSON.stringify(response.data.addDeliveryMan));
                hasUpdated.set(true);
                // Navigate to the desired page
                if (!response) {
                    setTimeout(() => {
                        alert('Error when creating your account!');
                        isWaiting = false;
                    }, 100);
                } else
                    await goto('/orders');
            } else {
                const response = await signUpClientMutation({
                    variables: {
                        name: name,
                        emailAddress: email,
                        phoneNumber: phoneNumber,
                        loginInfo: password,
                    }
                })
                localStorage.setItem('user', JSON.stringify(response.data.addClient));
                hasUpdated.set(true);
                // Navigate to the desired page
                if (!response) {
                    setTimeout(() => {
                        alert('Error when creating your account!');
                        isWaiting = false;
                    }, 100);
                } else
                    await goto('/quotations');
            }
        } catch (error) {
            console.log(error)
            alert("Error when creating your account!")
            isWaiting = false;
        }
    }

</script>

{#if isWaiting}
    <LoadingAnimation/>
{:else}
    <section>
        <div class='signup-title centerBlock' style='padding-bottom:0'>
            <p style='font-size: 30px'>Sign-Up as a ... </p>
        </div>

        <div class='centerBlock'>
            <div class='signup-form'>
                <div class='radio-input'>
                    <input type='radio' id='customer' name='user-type' value='customer' required bind:group={role}>
                    <div class="plus1">
                        <div class="plus2"></div>
                    </div>
                    <label for='customer'>Customer</label>
                    <input type='radio' id='employee' name='user-type' value='employee' required bind:group={role}>
                    <div class="plus1">
                        <div class="plus2"></div>
                    </div>
                    <label for='employee'>Employee</label>
                </div>
                <div class='inputs-form centerBlock'>
                    <div class='formGroup'><input type='text' id='name' name='Name' placeholder='Full Name' required
                                                  style='color:black'></div>
                    <div class='formGroup'><input type='text' id='email' name='Email' placeholder='Email' required
                                                  style='color:black'></div>
                    <div class='formGroup'><input type='password' id='password' name='Password' placeholder='Password'
                                                  required style='color:black'></div>
                    <div class='formGroup'><input type='tel' id='phone' name='Phone'
                                                  placeholder="Phone Number (e.g 123-456-7890)"
                                                  required
                                                  style='color:black'></div>
                </div>

                {#if hasMissingFields}
                    <div class='missingFields-box'>
                        <p>Please fill all the fields and try again.</p>
                    </div>
                {/if}

                <div class='btn-container'>
                    <button class='btn-signup centerBlock' type='submit' on:click='{onSubmit}'>Sign-Up</button>
                    <a href='/login'>
                        <button class='btn-back centerBlock'>Back</button>
                    </a>
                </div>
            </div>
        </div>
    </section>
{/if}

<style>

    section {
        width: 70%;
        height: auto;
        position: relative;
        text-align: center;
        margin: 5em auto auto;
    }

    .signup-title {
        display: block;
        position: relative;
        width: 100%;
    }

    .signup-title p {
        margin: 2px;
        font-weight: bold;
    }

    * a:link, a:visited, a:hover {
        text-decoration: none;
    }

    * a:hover {
        color: black;
        transition: 0.7s;
    }

    * a:focus {
        color: orange;
    }

    .centerBlock {
        text-align: center;
        display: block;
        margin: 10px;
        font-size: 20px;
    }

    .formGroup input, .formGroup input:focus {
        border: none;
        width: 45%;
        border-bottom: 2px solid orange;
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: bold;
        background-color: transparent;
        color: black;
    }

    .formGroup input::placeholder {
        color: black;
    }

    .btn-container {
        justify-content: center;
        display: flex;
        padding-top: 20px;

    }

    .missingFields-box > p {
        width: 40%;
        color: black;
        font-weight: bold;
        background-color: darkred;
        text-align: center;
        margin: 1em auto;
        padding: 0.5em;
    }

    .btn-signup, .btn-back {
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

    .btn-signup::before, .btn-back::before {
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

    .btn-signup:hover::before, .btn-back:hover::before {
        transform: translateX(0);
    }

    .radio-input {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .radio-input input {
        appearance: none;
        width: 2em;
        height: 2em;
        background-color: #171717;
        box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
        border-radius: 5px;
        transition: .4s ease-in-out;
        outline: darkgray solid 1px;
    }

    .radio-input input:hover {
        scale: 1.2;
        cursor: pointer;
        box-shadow: none;
    }

    .radio-input .plus1 {
        position: relative;
        top: 0.07em;
        left: -29.45px;
        width: 1.3em;
        height: 0.2em;
        background-color: orange;
        rotate: 45deg;
        scale: 0;
        border-radius: 5px;
        transition: .4s ease-in-out;
    }

    .radio-input .plus2 {
        position: relative;
        width: 1.3em;
        height: 0.2em;
        background-color: orange;
        transform: rotate(90deg);
        border-radius: 5px;
        transition: .4s ease-in-out;
    }

    .radio-input input:checked {
        box-shadow: none;
    }

    .radio-input input:checked + .plus1 {
        transform: rotate(180deg);
        scale: 1;
    }

    label {
        position: relative;
        left: -0.5em;
    }
</style>