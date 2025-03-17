## How to run pipeline:

```bash
oc delete deployments,services -l tag=temp
oc process -f api.deployment.yaml -p NAMESPACE_SUFFIX=dev | oc create -f -
```
