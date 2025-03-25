# Critterbase Pipeline

The pipeline script applies the templates from `critterbase.yaml` to the targeted namespace.
Currently this process is semi-manual, all changes need to be applied using the `pipeline.sh` script.

Note: The script will apply templates in both the targeted `namespace` AND the `tools` namespace.

Note: Environment specific configurations can be applied directly in the `pipeline.sh` script using -p flags.

## How to run pipeline:
./pipeline.sh <dev|test|prod> <tag=V1>

### Pre-requirements
- Must be logged in to [Openshift CLI](https://oauth-openshift.apps.silver.devops.gov.bc.ca/oauth/token/display)

```bash
oc login --token=<token> --server=https://api.silver.devops.gov.bc.ca:6443
```

### Dev
Execute the pipeline changes on the DEV namespace `d9ccb0-dev`

```bash
./pipeline.sh dev
```

### Test
Execute the pipeline changes on the TEST namespace `d9ccb0-test`

```bash
./pipeline.sh test
```

### Prod
Execute the pipeline changes on the PROD namespace `d9ccb0-prod`

```bash
./pipeline.sh prod
```

#### With different tag or PR number

```bash
./pipeline.sh <dev|test|prod> V2
```

