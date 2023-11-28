<script>
    import {crossfade} from "svelte/transition";
    import {quintOut} from "svelte/easing";
    import Animation from '$lib/images/tom.gif';

    const [send] = crossfade({
        fallback(node) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            return {
                duration: 400,
                easing: quintOut,
                css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
            };
        }
    });
</script>

<img class="anim" src="{Animation}" alt="Loading animation not working" out:send="{1}"/>

<style>
    .anim {
        position: fixed;
        width: 12em;
        height: 12em;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 10;
        border-radius: 50%;
        display: block;
    }

    img {
        -webkit-mask-image: radial-gradient(closest-side, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
        mask-image: radial-gradient(closest-side, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
    }

</style>