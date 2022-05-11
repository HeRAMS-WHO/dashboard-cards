# Dashboard visualisation cards

A collection of cards used in HeRAMS dashboarding. 
Based on Svelte this is compiled to a pure ESM module.

# Usage

Import the module and instiantiate the chart on an existing element:
```js
  import DashboardCard from '/dashboard-cards/dashboard-cards.es.js';

  const target = document.getElementById('my-chart');
  // Optionally use a shadow root
  const root = useShadowRoot ? target.attachShadow({mode: 'open'}) : target;

  // Data can be an array, but may also be an observable; if it is observable the visualization will update whenever a new value is emitted from the observable
  const data = [
    {
        "key": "clinic",
        "group": null,
        "label": "Clinic",
        "value": 152,
        "color": "#79a698"
    },
    {
        "key": "mobile",
        "group": null,
        "label": "Mobile clinic",
        "value": 304,
        "color": "#b2db88"
    },
    {
        "key": "private",
        "group": null,
        "label": "Private clinic",
        "value": 752,
        "color": "#e80198"
    },
    {
        "key": "hospital",
        "group": null,
        "label": "Hospital",
        "value": 302,
        "color": "#a8c469"
    }
  ];

  const card = new DashboardCard({
      target: root,
      props: {
          type: "bar",
          n: 15,
          typeSelector: true,
          title: "Chart title",
          data: data
      }
  });
  
```