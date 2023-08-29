# Prerequisites
- Have an EKS cluster with Fargate profile enabled for "default" namespace
- Deploy Metrics server in the cluster
- Deploy AWS Load Balancer Controller in the cluster

```
eksctl create iamserviceaccount \   
  --cluster=mortgage-calculator-fargate \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::132677568001:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve

helm repo add eks https://aws.github.io/eks-charts

helm repo update eks

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=mortgage-calculator-fargate \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set vpcId=vpc-0561ff889014951e4

kubectl get deployment -n kube-system aws-load-balancer-controller

# Deploy the application
IMAGE_URL=<ecr-image-url> envsubst < deployment.yml | kubectl apply -f -
```

