# Registering the Azure Active Directory applications for this sample using PowerShell scripts

This sample comes with PowerShell scripts which create Azure AD applications and their related objects (permissions, dependencies, secrets), and changes the configuration files in the C# and JavaScript projects. Once you run them, you only need to build the solution and you are good to test

## How to use the app creation scripts
To use the app creation scripts:
1. Open PowerShell (On Windows, press <Windows-R> and type "PowerShell" in the search window)
2. Navigate to the root directory of the project.
3. The default Execution Policy for scripts is usually `Restricted`. In order to run the PowerShell script you need to set the Execution Policy to `Unrestricted`. You can set this just for the current PowerShell process by running the command:
```PowerShell
 Set-ExecutionPolicy -Scope Process -ExecutionPolicy Unrestricted
 ```
4. If you have never done it already, in the PowerShell window, install the AzureAD PowerShell modules. For this, type:
    ```
    Install-Module AzureAD
    ```

5. Go to the `AppCreationScripts` sub-folder
    From the folder where you cloned the repo, 
    ```
    cd AppCreationScripts
    ```

6. Run the script. See below for the [four options](#Four-ways-to-run-the-script) to do that.
7. Open the Visual Studio solution, and in the solution's context menu, choose **Set Startup Projects**. 
8. select "Start" for the 3 projects

You're done. this just works!


## Four ways to run the script
### Option 1 (interactive)
 - Just run ``. .\Configue.ps1``, and you will be prompted to sign-in (email address, password, and if needed MFA). 
 - The script will be run as the signed-in user and will use the tenant in which the user is defined.

Note that the script will choose the tenant in which to create the applications, based on the user. Also to run the Cleanup script, you will need to re-sign-in.

### Option 2 (non-interactive)
When you know the credentials of the user under which identity you want to create the applications you can use the non-interactive approach. It's more adapted to DevOps. Here is an example of script you'd want to run in a PowerShell Window

    ```PowerShell
    $secpasswd = ConvertTo-SecureString "[Password here]" -AsPlainText -Force
    $mycreds = New-Object System.Management.Automation.PSCredential ("[login@tenantName here]", $secpasswd)
    . .\Cleanup.ps1 -Credential $mycreds
    . .\Configure.ps1 -Credential $mycreds
    ```
Of course, in real life, you will  also want to get the password from KeyVault

 ### Option 3 (Interactive, but create apps in a specified tenant)
  if you want to create the apps in a particular tenant, you can use the following option: 
- open the Azure portal (https://portal.azure.com)
- Select the Azure Active directory you are interested in (in the combo-box below your name on the top right of the browser window)
- Find the "Active Directory" object in this tenant
- Go to **Properties** and copy the content of the **Directory Id** property 
- Then use the full syntax to run the scripts:

    ```PowerShell
    . .\Cleanup.ps1 -Credential $mycreds -TenantId "yourTenantIdGuid"
    . .\Configure.ps1 -Credential $mycreds -TenantId "yourTenantIdGuid"
    ```

 ### Option 4 (non-interactive, and create apps in a specified tenant)
This option combines option 2 and option 3: it creates the application in a specific tenant. See option 3 for the way to get the tenant Id.

    ```PowerShell
    $secpasswd = ConvertTo-SecureString "[Password here]" -AsPlainText -Force
    $mycreds = New-Object System.Management.Automation.PSCredential ("[login@tenantName here]", $secpasswd)
    . .\Cleanup.ps1 -Credential $mycreds -TenantId "yourTenantIdGuid"
    . .\Configure.ps1 -Credential $mycreds -TenantId "yourTenantIdGuid"
    ```