// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //serverUrl: 'http://localhost:9090',
  serverUrl: 'http://132.230.25.79',
  //wssUrl: 'ws://localhost:9090'
  wssUrl: 'ws://132.230.25.79:9090',
  modes: [{
    id: 'sh',
    label: 'SH',
    active: true
  },
  {
    id: 'mh',
    label: 'MH',
    active: true
  },
  {
    id: 'kids',
    label: 'Kids',
    active: true
  }]
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
