# Deploy ECS Service

Find the Container Image that was created by the previous step

Execute the following stack that will create an ECS service from the container image that is provided. 
Note: Replace the `<ImageUrl>` with actual container image you wish to deploy 


```sam deploy --template-file service.yml --stack-name mortgage-calc-ecs-service --resolve-s3 --capabilities CAPABILITY_IAM --parameter-overrides ParameterKey=ImageUrl,ParameterValue=<ImageUrl>```

### Delete the stack
```sam delete --stack-name mortgage-calc-ecs-service```
