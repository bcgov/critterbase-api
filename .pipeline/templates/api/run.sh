#!/bin/bash

TARGET_NAMESPACE=d9ccb0-$1
TOOLS_NAMESPACE=d9ccb0-tools

if [[ "$1" != "dev" && "$1" != "test" && "$1" != "prod" ]]; then
  echo "Invalid Openshift namespace. Please use 'dev', 'test', or 'prod'."
  exit 1
fi


# Delete all objects by tag for the `target` namespace
echo -e "\nDeleting all objects with tag=$1 in namespace $TARGET_NAMESPACE...\n"
oc delete deployments,services,routes -l tag=$1 -n $TARGET_NAMESPACE

# Delete all objects by tag for the `tools` namespace
echo -e "\nDeleting all objects with tag=$1 in namespace $TOOLS_NAMESPACE...\n"
oc delete deployments,services,routes -l tag=$1 -n $TOOLS_NAMESPACE

# Create the environment objects
# Note: These are seperated by environment to allow for different configurations
# Note: `TEMPLATE_TAG` is used to identify the objects created together
echo -e "\nCreating objects for tag=$1 in namespace $TARGET_NAMESPACE and $TOOLS_NAMESPACE...\n"

if [[ "$1" == "dev" ]]; then
  oc process -f critterbase.yaml \
    -p TEMPLATE_TAG=$1 \
    -p NAMESPACE_ENVIRONMENT=$1 \
    | oc create -n $TARGET_NAMESPACE -f -
  exit 0
fi

if [[ "$1" == "test" ]]; then
  oc process -f critterbase.yaml \
    -p TEMPLATE_TAG=$1 \
    -p NAMESPACE_ENVIRONMENT=$1 \
    | oc create -n $TARGET_NAMESPACE -f -
  exit 0
fi

if [[ "$1" == "prod" ]]; then
  oc process -f critterbase.yaml \
    -p TEMPLATE_TAG=$1 \
    -p NAMESPACE_ENVIRONMENT=$1 \
    | oc create -n $TARGET_NAMESPACE -f -
  exit 0
fi

exit 1
