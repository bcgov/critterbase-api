#!/bin/bash

TARGET_NAMESPACE=d9ccb0-$1
TOOLS_NAMESPACE=d9ccb0-tools

# Note: This value is used to identify the objects created by this script / template
# In future, this value can be used to delete versioned objects by label
# or to help allow PR based deployments
TEMPLATE_TAG=${2:-V1}

if [[ "$1" != "dev" && "$1" != "test" && "$1" != "prod" ]]; then
  echo "Invalid Openshift namespace. Please use 'dev', 'test', or 'prod'."
  exit 1
fi

# Create the environment objects
# Note: These are seperated by environment to allow for different configurations
# Note: `TEMPLATE_TAG` is used to identify the objects created together
echo -e "\nCreating objects for tag=$TEMPLATE_TAG in namespace $TARGET_NAMESPACE and $TOOLS_NAMESPACE...\n"

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
