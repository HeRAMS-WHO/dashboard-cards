<script lang="ts">
import type DataPoint from "src/types/DataPoint";


    export let data: Array<DataPoint> = [];

</script>

<table>
    <thead>
        <tr>
            <th>Label</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {#each data as row}
            <tr style="background-color: {row.color}">
                <td>{row.label}</td>
                <td>{row.value}</td>
            </tr>
        {/each}
    </tbody>
</table>