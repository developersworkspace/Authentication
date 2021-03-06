// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  api: {
    uri: 'http://authentication.developersworkspace.co.za:9009/api'
  },
  clientId: '87025144872751362692',
  clientSecret: '69447957834022926586'
};
