#!/bin/bash

TARGET_NAMESPACE=d9ccb0-$1
TOOLS_NAMESPACE=d9ccb0-tools
TEMPLATE_TAG=$2

if [[ "$1" != "dev" && "$1" != "test" && "$1" != "prod" ]]; then
  echo "Invalid Openshift namespace. Please use 'dev', 'test', or 'prod'."
  exit 1
fi

if [[ -z "$2" ]]; then
  echo "Invalid template tag. Please provide a valid tag or identifier (PR number)."
  exit 1
fi

# WARNING: Do not delete the `volumes` objects as they are used for persistent storage

# # Delete all objects by tag for the `target` namespace
# echo -e "\nDeleting all objects with tag=$1 in namespace $TARGET_NAMESPACE...\n"
# oc delete deployments,services,routes -l tag=$TEMPLATE_TAG -n $TARGET_NAMESPACE
#
# # Delete all objects by tag for the `tools` namespace
# echo -e "\nDeleting all objects with tag=$1 in namespace $TOOLS_NAMESPACE...\n"
# oc delete deployments,services,routes,buildconfigs,imagestreams -l tag=$TEMPLATE_TAG -n $TOOLS_NAMESPACE

# Create the environment objects
# Note: These are seperated by environment to allow for different configurations
# Note: `TEMPLATE_TAG` is used to identify the objects created together
echo -e "\nCreating objects for tag=$1 in namespace $TARGET_NAMESPACE and $TOOLS_NAMESPACE...\n"

if [[ "$1" == "dev" ]]; then
  oc process -f critterbase.yaml \
    -p TEMPLATE_TAG=$TEMPLATE_TAG \
    -p NAMESPACE_ENVIRONMENT=$1 \
    | oc apply -f -
  exit 0
fi

if [[ "$1" == "test" ]]; then
  oc process -f critterbase.yaml \
    -p TEMPLATE_TAG=$TEMPLATE_TAG \
    -p NAMESPACE_ENVIRONMENT=$1 \
    | oc apply -f -
  exit 0
fi

if [[ "$1" == "prod" ]]; then
  oc process -f critterbase.yaml \
    -p TEMPLATE_TAG=$TEMPLATE_TAG \
    -p NAMESPACE_ENVIRONMENT=$1 \
    | oc apply -f -
  exit 0
fi

exit 1
