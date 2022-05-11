<script lang="ts">
    import "./main.css";
    import { onMount } from 'svelte';
    import { ReplaySubject, from } from 'rxjs';
    import BaseCard from './cards/BaseCard.svelte';
  
    function randInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    let config = {
        "data": [
            {
                "key": "hospital",
                "group": "group 1",
                "label": "Hospital",
                "value": randInt(10, 100),
                "color": "#66355e"
            },
            {
                "key": "mobile",
                "group": "group 1",
                "label": "Mobile clinic",
                "value": randInt(10, 100),
                "color": "#eed6ee"
            },
            {
                "key": "clinic",
                "group": "group 1",
                "label": "Clinic",
                "value": randInt(10, 100),
                "color": "#fdd481"
            },
            {
                "key": "private",
                "group": "group 1",
                "label": "Private clinic",
                "value": randInt(10, 100),
                "color": "#70e6a1"
            },
            {
                "key": "hospital",
                "group": "group 2",
                "label": "Hospital",
                "value": randInt(10, 100),
                "color": "#66355e"
            },
            {
                "key": "gr3",
                "group": "group 3",
                "label": "Test gr3",
                "value": randInt(10, 100),
                "color": "red"
            },
            {
                "key": "gr4",
                "group": "group 4",
                "label": "Test gr4",
                "value": randInt(10, 100),
                "color": "rgba(0, 255, 0, 0.3)"
            },
            {
                "key": "mobile",
                "group": "group 2",
                "label": "Mobile clinic",
                "value": randInt(10, 100),
                "color": "#eed6ee"
            },
            {
                "key": "clinic",
                "group": "group 2",
                "label": "Clinic",
                "value": randInt(10, 100),
                "color": "#fdd481"
            },
            {
                "key": "private",
                "group": "group 2",
                "label": "Private clinic",
                "value": randInt(10, 100),
                "color": "#70e6a1"
            }
        ],
        "title": "Preset",
        "n": 123
    };

    const dataSubject = new ReplaySubject(1);
    const dataObservable = from(dataSubject);
    dataSubject.next(config.data);

    onMount(async () => {
        let counter = 0;
        const i = setInterval(() => {
            counter++;

            // Random data changer
            let index = Math.floor(Math.random() * config.data.length);
            config.data[index].value += randInt(-15, 15);

            // Random label changer
            const labelIndex = Math.floor(Math.random() * config.data.length);
            const oldLabel = config.data[labelIndex].label;
            const newLabel = oldLabel.replace(/\d+$/, "") + counter;
            
            config.data.filter(c => c.label === oldLabel).forEach(c => c.label = newLabel);
            

            
            dataSubject.next(config.data);
            
        }, 2000);
        return () => { 
            clearInterval(i);
        }
    });
  </script>
  <svelte:options tag={null} accessors/>
  <main class="mx-auto max-w-xl"></main>
  <h1>This is the parent package for the HeRAMS dashboarding components</h1>
  <div class="cards">
    <!-- <BaseCard data={config.data} title={config.title}></BaseCard> -->
    <BaseCard type="table" data={config.data} title={config.title}></BaseCard>
    <BaseCard type="bar" data={dataObservable} title={config.title}></BaseCard>
    <BaseCard type="dump" data={dataObservable} title={config.title}></BaseCard>
    <BaseCard type="echartspie" data={dataObservable} title={config.title}></BaseCard>
    <BaseCard type="echartsbar" data={dataObservable} title={config.title}></BaseCard>
    <!-- <BaseCard type="donut" data={dataObservable} title={config.title}></BaseCard>
    <BaseCard type="table" data={dataObservable} title={config.title}></BaseCard> -->
    <!-- <BaseCard type="polar" data={dataObservable} title={config.title}></BaseCard> -->

    <!-- <BaseCard type="unknown" data={config.data} title={config.title}></BaseCard> -->
</div>
  <style>
      
      h1 {
          text-align: center;
          margin: 2em;
      }

      :global(.chart-content) {
          /* min-width: 500px; */
          min-height: 500px;
          background-color: lightblue;
      }
  </style>
  