# Serverless Log Funnel

Forwards log events to another fuction defined in the same serverless deploy

### Usage

The following configuration in your `serverless.yml`
```
custom:
  logfunnel:
    targetfn: logHandler                # required
    enabled: true/false                 # optional, defaults to true
    filter:  '{ $.something = stuff }'  # optional, defaults to no filter and everything is forwarded

functions:
  fnA:
    handler: foo
  fnB:
    handler: bar
    logHandler:
      enabled: true/false               # optional, defaults to custom.logfunnel.enabled
      filter: '{ $.something = stuff }' # optional, defaults to custom.logfunnel.filter
  logHandler:                           # required, custom.logfunnel.targetfn should match this
    handler: myLogHandler
```
will configure `logHandler` to receive cloudwatch events from `fnA` and `fnB`

`custom.logfunnel.targetfn.someFunctionName` is required and must match `functions.someFunctionName`

### Testing

`npm test`
