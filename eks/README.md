# Prerequisites
- Have an EKS cluster with Fargate profile enabled for "default" namespace
- Deploy Metrics server in the cluster
- Deploy AWS Load Balancer Controller in the cluster

## Deploy and configure EKS cluster with Fargate profile

```bash
#!/bin/bash

# Create EKS cluster with a Fargate profile and no other nodes
eksctl create cluster \
 --name mortgage-calculator-fargate \
 --region us-east-1 \
 --with-oidc \
 --version "1.27" \
 --fargate \
 --without-nodegroup \
 --full-ecr-access \
 --alb-ingress-access \
 --zones us-east-1a,us-east-1b

# Install metrics server in the EKS cluster required for horizontal pod autoscaling (HPA)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Download IAM policy for AWS Load Balancer Controller
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.5.4/docs/install/iam_policy.json

# Create AWS role using the downloaded IAM policy JSON file
aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json

# Create IAM Role for Service Account (IRSA) to assign the IAM role to AWS Load Balancer Controller pods
eksctl create iamserviceaccount \   
  --cluster=mortgage-calculator-fargate \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::132677568001:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve

# Configure helm repository
helm repo add eks https://aws.github.io/eks-charts
helm repo update eks

# Install helm chart for AWS Load Balancer Controller 
# `vpcId` value for the targeted VPC running the EKS cluster
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=mortgage-calculator-fargate \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set vpcId=vpc-0561ff889014951e4

# Verify AWS Load Balancer Controller deployment
kubectl get deployment -n kube-system aws-load-balancer-controller
```

## Deploy the application

Replace `<ecr-image-url>` in the following command before execution.

```bash
IMAGE_URL=<ecr-image-url> envsubst < deployment.yml | kubectl apply -f -
```

## Route 53 DNS Update

Replace values of `HOSTED_ZONE_ID`, `DOMAIN_NAME` and `TARGET` in the following commands and run them.

```bash
export HOSTED_ZONE_ID=Z06846812KADYEFZ6CQIE
export DOMAIN_NAME="mc.eks.panditlabs.online"
export TARGET="parthpg-fargate-alb-993381465.us-east-1.elb.amazonaws.com"

aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch '{
    "Comment": "Fargate with EKS demo change",
    "Changes": [{
      "Action"              : "UPSERT",
      "ResourceRecordSet"   : {
        "Name"              : "'$DOMAIN_NAME'",
        "Type"              : "CNAME",
        "TTL"               : 120,
        "ResourceRecords"   : [{
            "Value"         : "'$TARGET'"
        }]
      }
    }]
  }'
```

## Test the application

After DNS record update, wait for a minute and open the application using the following URL:

<http://mc.eks.panditlabs.online/rate?loan_principal=300000&amortization_period=15&payment_schedule=monthly&apy=6>

## Clean up

```bash
#!/bin/bash
kubectl delete -f deployment.yml
```