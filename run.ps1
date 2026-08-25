# run.ps1
Write-Host "Starting API..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd api; .\venv\Scripts\activate; uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "Starting Web..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"
