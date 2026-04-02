# Read Firebase config from .env.local (never hardcode API keys)
$envFile = Join-Path $PSScriptRoot '..\.env.local'
if (-not (Test-Path $envFile)) {
  Write-Output "[ERROR] .env.local not found at $envFile. Create it with VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID."
  exit 1
}
$envLines = Get-Content $envFile
$apiKey = ($envLines | Where-Object { $_ -match '^VITE_FIREBASE_API_KEY=' }) -replace '^VITE_FIREBASE_API_KEY=',''
$projectId = ($envLines | Where-Object { $_ -match '^VITE_FIREBASE_PROJECT_ID=' }) -replace '^VITE_FIREBASE_PROJECT_ID=',''

if (-not $apiKey -or -not $projectId) {
  Write-Output "[ERROR] VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID not found in .env.local"
  exit 1
}

$rand = Get-Random
$email = "copilot.test+$rand@example.com"
$password = "TestPass123!"
$companyName = "Empresa Teste Copilot"
Write-Output "[TEST] Creating test user $email..."
$signUpBody = @{email=$email; password=$password; returnSecureToken=$true} | ConvertTo-Json
try {
  $resp = Invoke-RestMethod -Uri "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$apiKey" -Method POST -ContentType 'application/json' -Body $signUpBody -ErrorAction Stop
  $idToken = $resp.idToken
  $localId = $resp.localId
  Write-Output "[TEST] Signed up user: $localId"
} catch {
  Write-Output "[ERROR] Sign-up failed: $($_.Exception.Message)"
  exit 1
}

Write-Output "[TEST] Creating employer document in Firestore..."
$employerDoc = @{ fields = @{ id = @{ stringValue = $localId }; companyName = @{ stringValue = $companyName }; email = @{ stringValue = $email } } } | ConvertTo-Json -Depth 10
$empUrl = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/employers?documentId=$localId"
try {
  Invoke-RestMethod -Uri $empUrl -Method POST -Body $employerDoc -ContentType 'application/json' -Headers @{ Authorization = "Bearer $idToken" } -ErrorAction Stop
  Write-Output "[TEST] Employer document created."
} catch {
  Write-Output "[ERROR] Failed creating employer document: $($_.Exception.Message)"
  exit 1
}

Write-Output "[TEST] Creating a job document..."
$createdAt = (Get-Date).ToString("o")
$jobDoc = @{ fields = @{ title = @{ stringValue = "Vaga Teste Copilot" }; employerId = @{ stringValue = $localId }; location = @{ stringValue = "Remoto" }; createdAt = @{ timestampValue = $createdAt } } } | ConvertTo-Json -Depth 10
$jobUrl = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/jobs"
try {
  $jobResp = Invoke-RestMethod -Uri $jobUrl -Method POST -Body $jobDoc -ContentType 'application/json' -Headers @{ Authorization = "Bearer $idToken" } -ErrorAction Stop
  Write-Output "[TEST] Job created: $($jobResp.name)"
} catch {
  Write-Output "[ERROR] Failed creating job: $($_.Exception.Message)"
  exit 1
}

Write-Output "[TEST] Listing jobs via Firestore REST..."
try {
  $listResp = Invoke-RestMethod -Uri "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/jobs" -Method GET -Headers @{ Authorization = "Bearer $idToken" } -ErrorAction Stop
  Write-Output "[TEST] Jobs list:"
  $listResp | ConvertTo-Json -Depth 5 | Write-Output
} catch {
  Write-Output "[ERROR] Failed listing jobs: $($_.Exception.Message)"
  exit 1
}

Write-Output "[TEST] Done."
