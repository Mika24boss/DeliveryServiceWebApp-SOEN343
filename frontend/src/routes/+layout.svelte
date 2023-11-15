<script>
    import Header from '../lib/components/Header.svelte';
    import './styles.css';
    import "@fontsource/barlow";
</script>

<div class="app">
    <Header/>

    <main>
        <slot/>
    </main>

</div>

<style>
    :global(:root) {
        --primary-color: rgb(230, 121, 13, 1);
        --primary-color2: rgba(199, 116, 0, 1);
        --secondary-color: rgba(232, 167, 13, 1);
    }

    *{
        font-family: 'Inter',serif;
        color: black;
    }

    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1em;
        width: 80%;
        margin: 3em auto 0;
        box-sizing: border-box;
    }

</style>
