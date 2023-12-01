<script>
    import Running from '$lib/images/running.gif';
    import Animation from '$lib/images/tom.gif';
    import Trustpilot from '$lib/images/trustpilot.png';
    import Trucks from '$lib/images/trucks.png';

</script>

<img class="trucks" src="{Trucks}" alt="Trucks transporting mangoes"/>

<span class="welcome">
			<span/>
			<span/>
			<span/>
			<span/>


<div class="page">
    <div class="left">
        <p style="font-size: 70px;">WanderingMangoes</p>
        <p style="font-size: 24px;">We meet strangers so you don't have to.</p>
        <p style="font-size: 24px;" class="description">We pick up and deliver your items anywhere.
            Simply submit a delivery request with the items to be collected, and we will come back to you with an incredibly low fee!
            Our delivery personnel take exquisite care of each delivery, and you can see an up-to-date status on our website.
        </p>


    </div>

    <div class="right">

        <div class="effort">How much effort we put in our deliveries:</div>

        <img class="running" src="{Running}" alt="Running animation not working"/>
        <img class="tom" src="{Animation}" alt="Loading animation not working"/>

    </div>
</div>
</span>

<a
        class="trustpilot"
        href="https://ca.trustpilot.com/search?query=Wandering+Mangoes"
        target="”_blank”"
>
    <img src={Trustpilot} alt="Trustpilot banner"/>
</a>

<a href="mailto: customer-support@wm.com" style="text-decoration: none;">Contact us at customer-support@wm.com!</a>

<style>

    .trucks {
        opacity: 0.5;
    }

    .page {
        padding-bottom: 1.5em;
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin: auto;
    }

    .description {
        margin-top: 1em;
        text-align: justify;
        line-height: 1.5em;
        padding: 1em;
    }

    .left {
        width: 100%;
        position: relative;
    }

    .right {
        width: 100%;
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 2fr 2fr;
        align-items: center;
        justify-items: center;
        margin-top: 3.6em;
    }

    .effort {
        font-size: 24px;
        font-weight: 500;
        grid-column: 1 / span 2;
    }

    img {
        height: 15em;
        object-fit: cover;
        border-radius: 1em;
    }

    .running {
        grid-row: 2;
        grid-column: 1;
    }

    .tom {
        grid-row: 3;
        grid-column: 2;
    }

    .trustpilot {
        margin-left: auto;
        margin-right: auto;
        position: relative;
    }

    .welcome {
        text-align: center;
        display: block;
        position: relative;
        letter-spacing: 2px;
        overflow: hidden;
        transition: 0.2s;
        user-select: none;
        border-radius: 1em;
        margin: auto auto 1.5em;
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