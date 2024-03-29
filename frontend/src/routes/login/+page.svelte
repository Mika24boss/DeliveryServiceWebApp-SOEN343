<script>
    import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
    import {ApolloClient, InMemoryCache} from '@apollo/client/core';
    import {mutation, setClient} from 'svelte-apollo';
    import {LOGIN} from '../../mutations/peopleMutation/personMutation.js';
    import {goto} from '$app/navigation';
    import {hasUpdated} from '$lib/stores/updateUser.js';

    const client = new ApolloClient({
        uri: 'https://bwm.happyfir.com/graphql/people',
        cache: new InMemoryCache()
    });

    setClient(client);
    const signInMutation = mutation(LOGIN);
    let email, password;
    let hasInvalidCredentials = false;
    let isWaiting = false;

    // const [login, {loading, error}] = mutation(LOGIN);
    async function onSubmit() {
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;
        try {
            const response = await signInMutation({
                variables: {
                    emailAddress: email,
                    password: password
                }
            });

            localStorage.setItem('user', JSON.stringify(response.data.login));
            hasUpdated.set(true);
            let role = response.data.login.role;
            // Navigate to the desired page
            if (!response) {
                setTimeout(() => (isWaiting = false), 100);
                hasInvalidCredentials = true;
            } else if (role === 'ADMIN') {
                await goto('/requests');
            } else if (role === 'REGULAR-CLIENT' || role === 'GOLD-CLIENT') {
                await goto('/quotations');
            } else if (role === 'DELIVERY-MAN' || role === 'PICKUP-MAN') {
                await goto('/orders');
            }
        } catch (error) {
            hasInvalidCredentials = true;
        }
    }
</script>

<svelte:head>
    <title>Login</title>
    <meta content="Delivery service website" name="description"/>
</svelte:head>

{#if isWaiting}
    <LoadingAnimation/>
{:else}
    <section>
		<span class="welcome centerBlock">
			<span/>
			<span/>
			<span/>
			<span/>
			<p style="font-size: 30px;">Welcome to WanderingMangoes!</p>
			<p style="font-size: 20px;">We meet strangers so you don't have to.</p>
		</span>
        <form class="centerBlock">
            <div class="formGroup">
                <input type="text" id="email" placeholder="Email" required style="color:black"/>
            </div>
            <div class="formGroup">
                <input type="password" id="password" placeholder="Password" required style="color:black"/>
            </div>
            <div class="btn-container">
                <button class="btn-signin centerBlock" type="submit" on:click={onSubmit}>Sign-In</button>
            </div>

            {#if hasInvalidCredentials}
                <div class="invalidCredentials-box">
                    <p>Incorrect email or password! Please try again.</p>
                </div>
            {/if}

            <a class="signup centerBlock" href="/signup">Don't have an account? Click here to Sign-Up</a>
        </form>

    </section>
{/if}

<style>
    section {
        width: 70%;
        height: auto;
        position: relative;
        text-align: center;
        margin: 3em auto auto;
    }

    * a:link,
    a:visited {
        text-decoration: none;
    }

    * a:hover {
        color: white;
        transition: 0.7s;
    }

    * a:focus {
        color: orange;
    }

    img {
        object-fit: cover;
        max-width: 250px;
        border-radius: 1em;
    }

    .signup {
        font-size: 15px;
        color: black;
    }

    .centerBlock {
        text-align: center;
        display: block;
        margin: 10px;
    }

    .formGroup input,
    .formGroup input:focus {
        border: none;
        width: 45%;
        border-bottom: 2px solid orange;
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: bold;
        background-color: transparent;
    }

    .formGroup input::placeholder {
        color: black;
    }

    .centerBlock input {
        color: black;
        padding: 0.5em;
    }

    .invalidCredentials-box > p {
        width: 40%;
        color: black;
        font-weight: bold;
        background-color: darkred;
        text-align: center;
        margin: 1em auto;
        padding: 0.5em;
    }

    .btn-signin {
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

    .btn-signin::before {
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

    .btn-signin:hover::before {
        transform: translateX(0);
    }

    .welcome {
        position: relative;
        letter-spacing: 2px;
        overflow: hidden;
        transition: 0.2s;
        width: 500px;
        margin: 0 auto 3em;
        user-select: none;
        border-radius: 1em;
    }

    .welcome * {
        color: black;
    }

    .welcome:hover {
        box-shadow: 0 0 10px #ffffff, 0 0 25px darkred, 0 0 50px orange;
        transition-delay: 0.6s;
        cursor: default;
    }

    .welcome span {
        position: absolute;
    }

    .welcome span:nth-child(1) {
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, orange);
    }

    .welcome:hover span:nth-child(1) {
        left: 100%;
        transition: 0.7s;
    }

    .welcome span:nth-child(3) {
        bottom: 0;
        right: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, darkorange);
    }

    .welcome:hover span:nth-child(3) {
        right: 100%;
        transition: 0.7s;
        transition-delay: 0.35s;
    }

    .welcome span:nth-child(2) {
        top: -100%;
        right: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(180deg, transparent, orange);
    }

    .welcome:hover span:nth-child(2) {
        top: 100%;
        transition: 0.7s;
        transition-delay: 0.17s;
    }

    .welcome span:nth-child(4) {
        bottom: -100%;
        left: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(360deg, transparent, darkorange);
    }

    .welcome:hover span:nth-child(4) {
        bottom: 100%;
        transition: 0.7s;
        transition-delay: 0.52s;
    }
</style>
