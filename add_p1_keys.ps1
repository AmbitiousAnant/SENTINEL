$vars = @(
    "TWILIO_ACCOUNT_SID", 
    "TWILIO_AUTH_TOKEN", 
    "TWILIO_WHATSAPP_NUMBER", 
    "SUPPORT_CONTACT_NUMBER", 
    "RIME_API_KEY"
)

foreach ($var in $vars) {
    $val = Read-Host "Enter $var (typing hidden)" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($val)
    $key = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    if ($key) {
        Add-Content -Path ".env" -Value "$var=$key"
        Write-Host "Saved $var."
    }
}
