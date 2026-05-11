$path = (Get-ChildItem -Path 'C:\Users\chenx\.nuget\packages\uipath.web.activities' -Filter 'UiPath.Web.Activities.dll' -Recurse | Select-Object -First 1).FullName
[Reflection.Assembly]::LoadFrom($path) | Out-Null
[UiPath.Web.Activities.Http.Models.FileFormDataPart].GetConstructors() | ForEach-Object {
    Write-Host 'Constructor:'
    $_.GetParameters() | ForEach-Object {
        Write-Host "  $($_.Name) : $($_.ParameterType.Name)"
    }
}
