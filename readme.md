# Serverless Log Funnel

Forwards log events to another fuction defined in the same serverless deploy

### Usage

The following configuration in your `serverless.yml`
```
custom:
  logfunnel:
    targetfn: logHandler                # must match functions.value
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
  logHandler:                           # must match custom.logfunnel.targetfn
    handler: myLogHandler
```
will configure logfunnel to receive cloudwatch events from fnA and fnB

### Testing

`npm test`
