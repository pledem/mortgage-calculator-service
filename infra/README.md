# README #

### What does this folder do? ###

* Prerequisites for running this lab. 
* Provision  VPC with two public subnets and an ECS cluster.

### How do I get set up? ###

1. Create VPC and ECS Cluster

`sam deploy --template-file parent.yml --stack-name mortgage-calculator-lab --resolve-s3 --capabilities CAPABILITY_IAM`

2. Reference eks/README.md for EKS Cluster setup

### How do I delete the stack ? ###

`sam delete --stack-name mortgage-calculator-lab` 


