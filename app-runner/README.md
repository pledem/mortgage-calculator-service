# Deploy Mortgage Calculator on AWS App Runner

1. Update the value of `ImageIdentifier` parameter in `input.json` with the value of Mortgage Calculator image URL in ECR.  

2. Run the following command to deploy the image on App Runner service.

```bash
#!/bin/bash
aws apprunner create-service \
--cli-input-json file://input.json
```

## Clean up

```bash
#!/bin/bash
export SERVICE_ARN=$(aws apprunner list-services --query 'ServiceSummaryList[?ServiceName==`mortgage-calculator`].ServiceArn'|jq '.[]')

aws apprunner delete-service --cli-input-json '{"ServiceArn":'$SERVICE_ARN'}'  
```
