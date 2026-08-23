# run.ps1
Write-Host "Starting API..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd api; .\venv\Scripts\activate; uvicorn main:app --reload --port 8000"

Write-Host "Starting Web..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"
