#!/bin/bash

###############################################################################
#
# Critterbase Openshift Pipeline Script
#
# Purpose: Create OpenShift objects in a specific Critterbase namespace
#
# How to run: ./pipeline.sh <dev|test|prod> <tag=V1>
# Note: The second argument is optional and defaults to V1
#
###############################################################################

# dev, test or prod
NAMESPACE_ENVIRONMENT=$1

# The target namespace to deploy the objects to
TARGET_NAMESPACE=d9ccb0-$NAMESPACE_ENVIRONMENT

# The tools namespace to deploy the objects to
TOOLS_NAMESPACE=d9ccb0-tools

# Note: This value is used to identify the objects created by this script / template
# In future, this value can be used to delete versioned objects by label
# or to help allow PR based deployments
TEMPLATE_TAG=${2:-V1}

# Check if the namespace is valid
if [[ "$1" != "dev" && "$1" != "test" && "$1" != "prod" ]]; then
  echo "Invalid Openshift namespace. Please use 'dev', 'test', or 'prod'."
  exit 1
fi

# Create the targeted namespace objects
#
# Note: These are seperated by environment to allow for different namespace configurations
echo -e "\nCreating objects for tag=$TEMPLATE_TAG in namespace $TARGET_NAMESPACE and $TOOLS_NAMESPACE...\n"

if [[ "$1" == "dev" ]]; then
  oc process -f critterbase.yaml \
    -p TEMPLATE_TAG=$TEMPLATE_TAG \
    -p NAMESPACE_ENVIRONMENT=$NAMESPACE_ENVIRONMENT \
    -p KEYCLOAK_HOST=https://dev.loginproxy.gov.bc.ca/auth \
    -p DB_PVC_SIZE='500Mi' \
    | oc apply -f -

  exit 0
fi

if [[ "$1" == "test" ]]; then
  oc process -f critterbase.yaml \
    -p TEMPLATE_TAG=$TEMPLATE_TAG \
    -p NAMESPACE_ENVIRONMENT=$NAMESPACE_ENVIRONMENT \
    -p KEYCLOAK_HOST=https://test.loginproxy.gov.bc.ca/auth \
    -p DB_PVC_SIZE='500Mi' \
    | oc apply -f -

  exit 0
fi

if [[ "$1" == "prod" ]]; then
  oc process -f critterbase.yaml \
    -p TEMPLATE_TAG=$TEMPLATE_TAG \
    -p NAMESPACE_ENVIRONMENT=$NAMESPACE_ENVIRONMENT \
    -p KEYCLOAK_HOST=https://loginproxy.gov.bc.ca/auth \
    -p DB_PVC_SIZE='5Gi' \
    | oc apply -f -

  # Create the backup build objects
  oc process -f backup/backup-build.yaml | oc apply -f -

  # Create the backup deployment objects
  oc process -f backup/backup-deploy.yaml | oc apply -f -

  exit 0
fi

exit 1
