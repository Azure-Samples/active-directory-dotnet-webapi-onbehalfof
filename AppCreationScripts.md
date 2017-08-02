---
services: active-directory
platforms: dotnet,JavaScript
author: jmprieur
---

# Registering the Azure Active Directory applications for this sample using PowerShell scripts

This sample comes with PowerShell scripts which create Azure AD applications and their related objects (permissions, dependencies, secrets), and changes the configuration files in the C# and JavaScript projects. Once you run them, you only need to build the solution and you are good to test

To use them:

1. Open PowerShell 
2. Go to the AppCreationScripts sub-folder
From the folder where you cloned the repo, 
```
cd AppCreationScripts
```

3. from this folder, run the following PowerShell snippet (after replacing yourPassword, youLogin and yourTenant)
```PowerShell
secpasswd = ConvertTo-SecureString "yourPassword" -AsPlainText -Force
$mycreds = New-Object System.Management.Automation.PSCredential (“yourlogin@yourtenant.onmicrosoft.com”, $secpasswd)
. .\Cleanup.ps1 -Credential $mycreds
. .\Configure.ps1 -Credential $mycreds
```


**Note that**
 if the user you want to create the Azure AD apps with  exists (as a guest for instance) in several Azure AD tenant you will need to also find the tenant Id of the tenant you are interested. 
for this:
- open the Azure portal (https://portal.azure.com)
- Select the Azure Active directory you are interested in (in the combo-box below your name on the top right of the browser window)
- Find the "Active Directory" object in this tenant
- Go to **Properties** and copy the content of the **Directory Id** property 
- Then use the full syntax to run the scripts:
```PowerShell
. .\Cleanup.ps1 -Credential $mycreds -TenantId "yourTenantIdGuid"
. .\Configure.ps1 -Credential $mycreds -TenantId "yourTenantIdGuid"
```

3. Open the Visual Studio solution, and in the solution's context menu, choose "Set Startup Projects". 
4. select "Start" for the 3 projects
You're done. this just works!
