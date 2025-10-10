# Networking Troubleshooting Guide

**Last Updated:** 2025-10-10  
**Version:** 1.0.0  
**Difficulty:** Intermediate to Advanced  
**Estimated Time:** 20-45 minutes

## Overview
This guide covers networking issues specific to OKE deployments, including LoadBalancer provisioning, pod-to-pod communication, OCIR image pulls, and external access problems. Each issue includes diagnostic steps and proven solutions.

## Common Networking Issues

### 1. LoadBalancer Not Getting External IP

#### Symptoms:
- Service shows `<pending>` for external IP
- `kubectl get svc` shows no external IP assigned
- Application not accessible from internet

#### Root Causes:
1. **OCI LoadBalancer service not available**
2. **Insufficient permissions for LoadBalancer creation**
3. **Network security list blocking traffic**
4. **Subnet not configured for LoadBalancer**

#### Diagnostic Steps:

```bash
# Check service status
kubectl get svc fibonacci-app -o wide

# Check service events
kubectl describe svc fibonacci-app

# Check LoadBalancer in OCI Console
oci lb load-balancer list --compartment-id $TENANCY_OCID --query 'data[*].{Name:"display-name", State:"lifecycle-state", IP:"ip-addresses[0]."ip-address""}'
```

#### Solutions:

**A. Check LoadBalancer Permissions:**
```bash
# Verify LoadBalancer can be created
oci lb load-balancer list --compartment-id $TENANCY_OCID --query 'data[*].id' --raw-output | head -1
```

**B. Use NodePort as Alternative:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: fibonacci-app-nodeport
spec:
  type: NodePort
  selector:
    app: fibonacci-app
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080
```

**C. Check Security List Rules:**
```bash
# Add HTTP/HTTPS rules
oci network security-list update --security-list-id $SECURITY_LIST_ID --ingress-security-rules '[
  {"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":80,"max":80}}},
  {"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":443,"max":443}}}
]'
```

### 2. Pod-to-Pod Communication Failures

#### Symptoms:
- Pods can't communicate with each other
- Service discovery not working
- DNS resolution failures

#### Root Causes:
1. **Network policies blocking traffic**
2. **CNI (Container Network Interface) issues**
3. **DNS configuration problems**
4. **Security list rules too restrictive**

#### Diagnostic Steps:

```bash
# Test pod-to-pod communication
kubectl run test-pod --image=busybox --rm -it -- nslookup kubernetes.default

# Check DNS resolution
kubectl exec -it $POD_NAME -- nslookup fibonacci-app

# Check network policies
kubectl get networkpolicies
kubectl describe networkpolicy fibonacci-app-network-policy
```

#### Solutions:

**A. Check Network Policies:**
```bash
# Temporarily disable network policies
kubectl delete networkpolicy fibonacci-app-network-policy

# Test communication
kubectl exec -it $POD_NAME -- wget -O- http://fibonacci-app:8080

# Re-enable with corrected rules
kubectl apply -f k8s/network-policy.yaml
```

**B. Fix DNS Issues:**
```bash
# Check CoreDNS pods
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Check DNS configuration
kubectl get configmap -n kube-system coredns -o yaml
```

### 3. OCIR Image Pull Errors

#### Symptoms:
- Pods stuck in `ImagePullBackOff`
- Error: "pull access denied" or "unauthorized"
- Images not downloading from OCIR

#### Root Causes:
1. **Invalid OCIR credentials**
2. **Missing image pull secrets**
3. **OCIR authentication token expired**
4. **Network connectivity to OCIR**

#### Diagnostic Steps:

```bash
# Check pod status
kubectl get pods
kubectl describe pod $POD_NAME

# Check image pull secrets
kubectl get secrets
kubectl describe secret ocir-secret

# Test OCIR connectivity
kubectl run test-pull --image=us-chicago-1.ocir.io/<namespace>/fibonacci-app:v2025.09.10 --rm -it -- /bin/sh
```

#### Solutions:

**A. Update OCIR Credentials:**
```bash
# Create new auth token in OCI Console
# Update secret
kubectl create secret docker-registry ocir-secret \
  --docker-server=us-chicago-1.ocir.io \
  --docker-username=<OCIR_NAMESPACE>/<your-username> \
  --docker-password=$NEW_AUTH_TOKEN \
  --docker-email=<your-email> \
  --dry-run=client -o yaml | kubectl apply -f -
```

**B. Use OCI Vault for Secrets:**
```bash
# Setup vault integration
./scripts/setup-vault-secrets.sh

# Verify secret sync
kubectl get externalsecret ocir-secret
```

### 4. External Access Issues

#### Symptoms:
- Application not accessible from browser
- Timeout errors when accessing LoadBalancer IP
- SSL/TLS certificate issues

#### Root Causes:
1. **Security list blocking external traffic**
2. **Application not listening on correct port**
3. **LoadBalancer health check failures**
4. **DNS resolution issues**

#### Diagnostic Steps:

```bash
# Test external connectivity
curl -v http://$LOADBALANCER_IP

# Check application logs
kubectl logs -l app=fibonacci-app --tail=50

# Test from within cluster
kubectl run test-curl --image=curlimages/curl --rm -it -- curl -v http://fibonacci-app:8080
```

#### Solutions:

**A. Fix Security List Rules:**
```bash
# Add comprehensive HTTP/HTTPS rules
oci network security-list update --security-list-id $SECURITY_LIST_ID --ingress-security-rules '[
  {"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":80,"max":80}}},
  {"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":443,"max":443}}},
  {"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":30000,"max":32767}}}
]'
```

**B. Check Application Health:**
```bash
# Verify application is responding
kubectl exec -it $POD_NAME -- curl localhost:8080

# Check readiness probe
kubectl describe pod $POD_NAME | grep -A 5 "Readiness"
```

## Network Policy Troubleshooting

### Common Network Policy Issues:

**1. Too Restrictive Policies:**
```yaml
# Problem: Blocking all traffic
spec:
  policyTypes:
  - Ingress
  - Egress
  # Missing ingress/egress rules = deny all

# Solution: Add specific rules
spec:
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: fibonacci-app
    ports:
    - protocol: TCP
      port: 8080
```

**2. Incorrect Selectors:**
```yaml
# Problem: Wrong pod selector
spec:
  podSelector:
    matchLabels:
      app: wrong-app-name

# Solution: Correct selector
spec:
  podSelector:
    matchLabels:
      app: fibonacci-app
```

**3. Missing DNS Rules:**
```yaml
# Problem: No DNS egress rule
spec:
  egress: []

# Solution: Add DNS rule
spec:
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53
```

## Quick Network Diagnostics

### Test Connectivity:
```bash
# Test pod-to-service
kubectl exec -it $POD_NAME -- wget -O- http://fibonacci-app:8080

# Test external access
curl -v http://$LOADBALANCER_IP

# Test DNS resolution
kubectl exec -it $POD_NAME -- nslookup fibonacci-app
```

### Check Network Configuration:
```bash
# List all network policies
kubectl get networkpolicies

# Check service endpoints
kubectl get endpoints fibonacci-app

# Check LoadBalancer status
kubectl get svc fibonacci-app -o yaml
```

### Monitor Network Traffic:
```bash
# Check pod network interfaces
kubectl exec -it $POD_NAME -- ip addr

# Check routing table
kubectl exec -it $POD_NAME -- ip route

# Test connectivity to specific hosts
kubectl exec -it $POD_NAME -- ping google.com
```

## Emergency Network Fixes

### Complete Network Reset:
```bash
# 1. Delete all network policies
kubectl delete networkpolicies --all

# 2. Restart CoreDNS
kubectl rollout restart deployment/coredns -n kube-system

# 3. Restart application pods
kubectl rollout restart deployment/fibonacci-app

# 4. Re-apply network policies
kubectl apply -f k8s/network-policy.yaml
```

### LoadBalancer Reset:
```bash
# 1. Delete service
kubectl delete svc fibonacci-app

# 2. Wait for LoadBalancer cleanup
sleep 60

# 3. Recreate service
kubectl apply -f k8s/deployment.yaml
```

## Prevention

### Best Practices:
1. **Test network policies** in development first
2. **Use gradual rollout** for network changes
3. **Monitor application logs** during deployments
4. **Keep security lists minimal** but functional
5. **Document network architecture** for troubleshooting

### Network Monitoring:
```bash
# Monitor service status
watch kubectl get svc,pods

# Monitor network policies
kubectl get networkpolicies -o wide

# Check LoadBalancer health
oci lb load-balancer-health get --load-balancer-id $LB_ID
```
