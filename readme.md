The following configuration in your `serverless.yml`
```
custom:
  logfunnel:
    targetfn: logfunnel

functions:
  fnA:
    handler: foo
  fnB:
    handler: bar
  logfunnel:
    handler: funnel
```
will configure logfunnel to receive cloudwatch events from fnA and fnB
