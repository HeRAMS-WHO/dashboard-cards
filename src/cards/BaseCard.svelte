<script lang="ts">
    import Table from "./Table.svelte";
    import Dump from "./Dump.svelte";
    import EChartPieCard from "./EChartPieCard.svelte";
    import EChartBarCard from "./EChartBarCard.svelte";
    export let type = "dump";
    export let data = {};

    export let n: number = 0;
    export let typeSelector:boolean = true;
    export let title:string = "Card header";

    const cardTypes = {
        table: Table,
        dump: Dump,
        bar: EChartBarCard,
        echartspie: EChartPieCard,
        echartsbar: EChartBarCard
    }

    $:component = cardTypes[type] ?? Dump;
</script>
<svelte:options tag={null} accessors/>
    <section class="card">
        <header>{title}</header>
        {#if typeSelector}
            <select bind:value={type}>{#each Object.keys(cardTypes) as cardType}
                <option value={cardType}>{cardType}</option>
                
            {/each}</select>    
        {/if}
        
        <div class="chart-content">
        <svelte:component this={component} {data}/>
        </div>
        <footer>{#if n}<span class="count">{n}</span>{/if}</footer>
    </section>
<style>
    .chart-content {
        position: relative;
    }
</style>