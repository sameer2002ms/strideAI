# ==========================================
# StrideAI Azure Deployment Script
# ==========================================

$ErrorActionPreference = "Stop"

# ------------------------------------------
# Configuration
# ------------------------------------------

$ACR_NAME = "strideacr1"
$IMAGE_NAME = "strideai-backend"

$RESOURCE_GROUP = "strideai-rg"

$BACKEND_APP = "strideai-backend"
$WORKER_APP = "strideai-worker"
$BEAT_APP = "strideai-celery-beat"


# ==========================================
# Step 1: Get Current Git Commit Hash
# ==========================================

Write-Host ""
Write-Host "========================================="
Write-Host "Getting Git Commit Version..."
Write-Host "========================================="

$IMAGE_TAG = git rev-parse --short HEAD

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to get Git commit hash."
    Write-Host "Make sure this project is a Git repository."
    exit 1
}

$IMAGE_TAG = $IMAGE_TAG.Trim()

$FULL_IMAGE = "$ACR_NAME.azurecr.io/$IMAGE_NAME`:$IMAGE_TAG"

Write-Host ""
Write-Host "Git Commit : $IMAGE_TAG"
Write-Host "Docker Image: $FULL_IMAGE"


# ==========================================
# Step 2: Login to Azure Container Registry
# ==========================================

Write-Host ""
Write-Host "========================================="
Write-Host "Logging into Azure Container Registry..."
Write-Host "========================================="

az acr login --name $ACR_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host "ACR login failed."
    exit 1
}

Write-Host "ACR login successful."


# ==========================================
# Step 3: Build Docker Image
# ==========================================

Write-Host ""
Write-Host "========================================="
Write-Host "Building Docker Image..."
Write-Host "========================================="

docker build -t $FULL_IMAGE .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed."
    exit 1
}

Write-Host "Docker image built successfully."


# ==========================================
# Step 4: Push Image to ACR
# ==========================================

Write-Host ""
Write-Host "========================================="
Write-Host "Pushing Image to Azure Container Registry..."
Write-Host "========================================="

docker push $FULL_IMAGE

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker push failed."
    exit 1
}

Write-Host "Docker image pushed successfully."


# ==========================================
# Step 5: Update Backend Container App
# ==========================================

Write-Host ""
Write-Host "========================================="
Write-Host "Updating Backend..."
Write-Host "========================================="

az containerapp update `
    --name $BACKEND_APP `
    --resource-group $RESOURCE_GROUP `
    --image $FULL_IMAGE

if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend deployment failed."
    exit 1
}

Write-Host "Backend updated successfully."


# ==========================================
# Step 6: Update Celery Worker
# ==========================================

Write-Host ""
Write-Host "========================================="
Write-Host "Updating Celery Worker..."
Write-Host "========================================="

az containerapp update `
    --name $WORKER_APP `
    --resource-group $RESOURCE_GROUP `
    --image $FULL_IMAGE

if ($LASTEXITCODE -ne 0) {
    Write-Host "Celery Worker deployment failed."
    exit 1
}

Write-Host "Celery Worker updated successfully."


# ==========================================
# Step 7: Update Celery Beat
# ==========================================

Write-Host ""
Write-Host "========================================="
Write-Host "Updating Celery Beat..."
Write-Host "========================================="

az containerapp update `
    --name $BEAT_APP `
    --resource-group $RESOURCE_GROUP `
    --image $FULL_IMAGE

if ($LASTEXITCODE -ne 0) {
    Write-Host "Celery Beat deployment failed."
    exit 1
}

Write-Host "Celery Beat updated successfully."


# ==========================================
# Deployment Complete
# ==========================================

Write-Host ""
Write-Host "========================================="
Write-Host "StrideAI Deployment Completed!"
Write-Host "========================================="
Write-Host ""
Write-Host "Deployed Git Commit : $IMAGE_TAG"
Write-Host "Deployed Docker Image: $FULL_IMAGE"
Write-Host ""
Write-Host "Updated Services:"
Write-Host "  Backend       : $BACKEND_APP"
Write-Host "  Celery Worker : $WORKER_APP"
Write-Host "  Celery Beat   : $BEAT_APP"
Write-Host ""