<script lang="ts">
    import { map } from 'rxjs/operators';
    import { zip, isObservable, from } from 'rxjs';
    import { onMount, afterUpdate } from 'svelte';
    import type DataPoint from '../types/DataPoint';

    import * as echarts from 'echarts/core';
    
    import {
      BarChart
    } from 'echarts/charts';


    import type {
      EChartsOption
    } from 'echarts/types/dist/option';

    import {
      TitleComponent,
      TooltipComponent,
      GridComponent
    } from 'echarts/components';

    import {
      SVGRenderer
    } from 'echarts/renderers';
    
    echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, SVGRenderer])
    export let data = [];

    let chartContainer: HTMLElement;
    let chart: echarts.ECharts;

    const option:EChartsOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        
      },
      grid: {
          bottom: 20,
      },
      xAxis: [{
          data: []
      }],
      yAxis: {},
      series: []
    };

    afterUpdate(() => {
        if (chart) chart.setOption(option);
    });
    onMount(() => {
        const observableData = isObservable(data) ? from(data) : from([data]);

        const groups = observableData.pipe(
            map((dataSet:Array<any>) => {
                const groups = {};
                dataSet.forEach((rawPoint: DataPoint) => {
                    if (rawPoint.group) { groups[rawPoint.group] = true; }
                });
                return Object.keys(groups);
            })
        );



        const keys = observableData.pipe(
            map((dataSet:Array<any>) => {
                const keys = {};
                dataSet.forEach(rawPoint => keys[rawPoint.key] = true);
                return Object.keys(keys);
            })
        );

        const subscriptions = [];
        
        const combined = zip(observableData, groups, keys);
        const dataSetDictionary = {};
        
        chart = echarts.init(chartContainer);

        subscriptions.push(combined.subscribe(([data, groups, keys]: [DataPoint[], string[], string[]]) => {
            // Each key results in a dataset.
            if (!Array.isArray(data)) {
                console.error("Data must be an array");
            }
            keys.forEach((key) => {
                const dataSet  = dataSetDictionary[key] ?? {};
                const points = [];
                let backgroundColor: string = '#ff0000';
                let label: string = 'No label';
                data.filter((p) => p.key === key).forEach(rawPoint => {
                    // Get X coordinate.
                    label = rawPoint.label;
                    backgroundColor = rawPoint.color ?? '#ff0000';
                    points.push(rawPoint.value);
                })
                dataSet.data = points;
                dataSet.type = 'bar';
                dataSet.name = label;
                dataSet.label = {
                  show: true
                };
                dataSet.itemStyle = {
                  color: backgroundColor
                };

                console.log(dataSet);
                dataSetDictionary[key] = dataSet;
            });
            option.series = Object.values(dataSetDictionary);
            if (groups.length > 1) {
                option.xAxis[0].data = groups;
            } else {
                option.xAxis[0].data = [];
            }
            
            chart.setOption(option);
            
            
        }));
            
        const resizeObserver = new ResizeObserver(() => chart.resize({height: chartContainer.clientHeight, width: chartContainer.clientWidth}));
        resizeObserver.observe(chartContainer);
        
        return () => {
          subscriptions.forEach(s => s.unsubscribe());
          resizeObserver.disconnect();
          chart.dispose();  
        }


		    
        
    });
 </script>
<div bind:this={chartContainer}></div>
<style>
  div {
      position: absolute;
      width: 100%;
      height: 100%;
  }
</style>