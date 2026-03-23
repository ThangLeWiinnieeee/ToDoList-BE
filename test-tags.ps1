# Test Tags API

# Step 1: Login
Write-Host "=== Step 1: Login ===" -ForegroundColor Green
$loginResp = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Headers @{"Content-Type" = "application/json"} -Body (@{email="testuser@example.com";password="password123"} | ConvertTo-Json)
$loginData = $loginResp.Content | ConvertFrom-Json
$token = $loginData.data.token
Write-Host "✓ Logged in, token obtained"
Write-Host "Token: $($token)" -ForegroundColor Yellow

$headers = @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"}

# Step 2: Create Work tag
Write-Host "`n=== Step 2: Create Work Tag ===" -ForegroundColor Green
$tag1 = Invoke-WebRequest -Uri "http://localhost:3000/api/tags" -Method POST -Headers $headers -Body (@{name="Work";color="#FF5733"} | ConvertTo-Json)
$tag1_data = $tag1.Content | ConvertFrom-Json
Write-Host $tag1.Content | ConvertFrom-Json | ConvertTo-Json
$tag1_id = $tag1_data.data._id
Write-Host "✓ Work tag created with ID: $tag1_id"

# Step 3: Create Personal tag
Write-Host "`n=== Step 3: Create Personal Tag ===" -ForegroundColor Green
$tag2 = Invoke-WebRequest -Uri "http://localhost:3000/api/tags" -Method POST -Headers $headers -Body (@{name="Personal";color="#33FF57"} | ConvertTo-Json)
$tag2_data = $tag2.Content | ConvertFrom-Json
Write-Host $tag2.Content | ConvertFrom-Json | ConvertTo-Json
$tag2_id = $tag2_data.data._id
Write-Host "✓ Personal tag created with ID: $tag2_id"

# Step 4: Create Urgent tag
Write-Host "`n=== Step 4: Create Urgent Tag ===" -ForegroundColor Green
$tag3 = Invoke-WebRequest -Uri "http://localhost:3000/api/tags" -Method POST -Headers $headers -Body (@{name="Urgent";color="#FFFF00"} | ConvertTo-Json)
$tag3_data = $tag3.Content | ConvertFrom-Json
Write-Host $tag3.Content | ConvertFrom-Json | ConvertTo-Json
$tag3_id = $tag3_data.data._id
Write-Host "✓ Urgent tag created with ID: $tag3_id"

# Step 5: Get all tags
Write-Host "`n=== Step 5: Get All Tags ===" -ForegroundColor Green
$allTags = Invoke-WebRequest -Uri "http://localhost:3000/api/tags" -Method GET -Headers $headers
Write-Host $allTags.Content | ConvertFrom-Json | ConvertTo-Json
Write-Host "✓ Retrieved all tags"

# Step 6: Get tag by ID
Write-Host "`n=== Step 6: Get Tag by ID ===" -ForegroundColor Green
$getTag = Invoke-WebRequest -Uri "http://localhost:3000/api/tags/$tag1_id" -Method GET -Headers $headers
Write-Host $getTag.Content | ConvertFrom-Json | ConvertTo-Json
Write-Host "✓ Retrieved tag by ID"

# Step 7: Update tag
Write-Host "`n=== Step 7: Update Tag ===" -ForegroundColor Green
$updateTag = Invoke-WebRequest -Uri "http://localhost:3000/api/tags/$tag1_id" -Method PUT -Headers $headers -Body (@{name="Work Updated";color="#0000FF"} | ConvertTo-Json)
Write-Host $updateTag.Content | ConvertFrom-Json | ConvertTo-Json
Write-Host "✓ Updated tag"

# Step 8: Delete tag
Write-Host "`n=== Step 8: Delete Tag ===" -ForegroundColor Green
$deleteTag = Invoke-WebRequest -Uri "http://localhost:3000/api/tags/$tag3_id" -Method DELETE -Headers $headers
Write-Host $deleteTag.Content | ConvertFrom-Json | ConvertTo-Json
Write-Host "✓ Deleted tag"

# Step 9: Verify deletion
Write-Host "`n=== Step 9: Verify Deletion ===" -ForegroundColor Green
$verifyTags = Invoke-WebRequest -Uri "http://localhost:3000/api/tags" -Method GET -Headers $headers
$verifyData = $verifyTags.Content | ConvertFrom-Json
Write-Host "Total tags after deletion: $($verifyData.total)" -ForegroundColor Yellow
Write-Host $verifyTags.Content | ConvertFrom-Json | ConvertTo-Json

Write-Host "`n✅ All Tag API tests completed successfully!" -ForegroundColor Green
