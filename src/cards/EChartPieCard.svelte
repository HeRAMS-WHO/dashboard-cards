<script lang="ts">
    import * as echarts from 'echarts';
    import { map } from 'rxjs/operators';
    import { zip, isObservable, from } from 'rxjs';
    import { onMount, afterUpdate } from 'svelte';
    import type DataPoint from '../types/DataPoint';

    
    type EChartsOption = echarts.EChartsOption;
    export let data = [];

    let chartContainer: HTMLDivElement;
    let chart: echarts.ECharts;
    const option:EChartsOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        
      },
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
              dataSet.forEach(rawPoint => {
                if (rawPoint.group !== null) {
                  groups[rawPoint.group] = true
                }
              });
              return Object.keys(groups);
          })
      );

      const subscriptions = [];

      const combined = zip(observableData, groups);
      const dataSetDictionary = {};

      chart = echarts.init(chartContainer);

      const DEFAULT_GROUP_KEY = 'default';
      subscriptions.push(combined.subscribe(([data, groups]: [Array<DataPoint>, string[]]) => {
          // Each key results in a dataset.
          if (!Array.isArray(data)) {
              console.error("Data must be an array");
          }
          
          if (groups.length === 0) {
            const dataSet  = dataSetDictionary[DEFAULT_GROUP_KEY] ?? {};
                const points = [];
                let backgroundColor: string = '#ff0000';
                data.forEach((rawPoint: DataPoint) => {
                    // Get X coordinate.
                    backgroundColor = rawPoint.color ?? '#ff0000';
                    points.push({
                      value: rawPoint.value,
                      name: rawPoint.label,
                      itemStyle: {
                        color: backgroundColor
                      }
                    });
                })
                dataSet.data = points;
                dataSet.type = 'pie';
                dataSet.label = {
                  show: false
                };
                dataSet.itemStyle = {
                  color: backgroundColor
                };

                dataSetDictionary[DEFAULT_GROUP_KEY] = dataSet;
            } else {
            // Decide on the grid size.
            /**
             * When the grid looks like this
             * | x | x | x | x |
             * | x | x | x | x |
             * 
             * The width 4 makes 8 spaces:
             * | x | x | x | x |
             * 1   2   2   2   1
             * The centers are located at the odd multiples: 1, 3, 5 and 7.
             * 
             */
            const portrait = false;
            let width: number;
            let height: number;
            if (portrait) {
              width = Math.ceil(Math.sqrt(groups.length));
              height = Math.ceil(groups.length / width);
            } else {
              height = Math.ceil(Math.sqrt(groups.length));
              width = Math.ceil(groups.length / height);
            }
            

            const left = (index:number) => {
              const xPos = index % width + 1;
              const result = (xPos * 2 - 1) * 100 / (2 * width);
              console.log("xPos for index", index, "res:", xPos, result, "width", width);
              return result;
            };
            const top = (index:number) => {
              const yPos = Math.floor((index) / width) + 1;
              const result = (yPos) * 100 / (1 + height);
              console.log("YPos for index", index, "res:", yPos, result, "width", width);
              return result;
            };

            
            // Create array of positions.
            // const positions = groups.
            

            groups.forEach((group, i) => {
                const dataSet  = dataSetDictionary[group] ?? {};
                const points = [];
                let backgroundColor: string = '#ff0000';
                data.filter(p => p.group === group).forEach(rawPoint => {
                    // Get X coordinate.
                    group = rawPoint.group;
                    backgroundColor = rawPoint.color ?? '#ff0000';
                    points.push({
                      value: rawPoint.value,
                      name: rawPoint.label,
                      itemStyle: {
                        color: backgroundColor
                      }
                    });
                })
                dataSet.data = points;
                dataSet.type = 'pie';
                dataSet.radius = '30%';
                dataSet.center = [left(i) + '%', top(i) + '%'];
                dataSet.name = group;
                dataSet.label = {
                  show: false
                };
                dataSet.itemStyle = {
                  color: backgroundColor
                };
                
                dataSetDictionary[group] = dataSet;
            });
            
          }
          option.series = Object.values(dataSetDictionary);
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
