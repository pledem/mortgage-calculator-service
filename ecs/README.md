sam deploy --template-file service.yml --stack-name mortgage-calc-ecs-service --resolve-s3 --capabilities CAPABILITY_IAM --parameter-overrides ParameterKey=ImageUrl,ParameterValue=132677568001.dkr.ecr.us-east-1.amazonaws.com/mortgagecalculatorlambda88b19bac/expressfunction9fcbc1barepo:expressfunction-c68ba8eb4fac-v1

