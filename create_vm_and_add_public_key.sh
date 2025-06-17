#!/bin/bash

# Set variables
RESOURCE_GROUP="bennyVMeastus2"
LOCATION="eastus2" # cheapest for Standard_B1ls as i saw in pricing
VM_NAME="myvm"
ADMIN_USER="azureuser"

# Create resource group
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Create VM # Standard_B1ls is the cheapest.
az vm create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --image Ubuntu2204 \
  --size Standard_B1ls \
  --admin-username "$ADMIN_USER" \
  --authentication-type ssh \
  --generate-ssh-keys

# Add the public key to the VM (from ~/.ssh/id_rsa.pub)
az vm user update \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --username "$ADMIN_USER" \
  --ssh-key-value "$(cat ~/.ssh/id_rsa.pub)"

# Open SSH port 22 (if not already open)
az vm open-port --port 22 --resource-group "$RESOURCE_GROUP" --name "$VM_NAME"