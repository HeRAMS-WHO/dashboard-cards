<script lang="ts">
    import { isObservable, from } from "rxjs";

    export let data = {};
    const observableData = isObservable(data) ? from(data) : from([data]);
</script>
<pre>{ JSON.stringify($observableData, null, 4) }</pre>

<style>
    pre {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: auto;

  }
</style>