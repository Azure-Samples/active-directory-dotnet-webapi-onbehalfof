# Variables for the registration of the AAD applications

# Registeration for the TodoListService web API
# ----------------------------------------
	# friendly name for the application, for example 'TodoListService' 
	# Apllication Type is 'Web Application and/or Web API' (private application). 
	# For the sign-on URL, is the base URL for the sample, which is by default https://localhost:44321. 
	# App ID URI, is https://<your_tenant_name>/TodoListService
	$todoListServiceWebApiName = "TodoListService-OBO"
	$todoListServiceWebApiIsPublicClient = $false
	$todoListServiceWebApiBaseUrl= "http://localhost:9184/"
    $todoListServiceWebApiAppIdURI = "https://$tenantName/$todoListServiceWebApiName"

# Registeration for the TodoListClient .NET app
# ---------------------------------------------
	# friendly name for the application, for example 'TodoListClient-DotNet' 
	# Apllication Type is 'Native' (that is public application). 
	# For the redirect URL, this is https://TodoListClient (not be used in this sample, but it needs to be defined nonetheless)
	# App ID URI, is https://<your_tenant_name>/TodoListService
	# "TodoListService" is a requested resource for this application (Required Permissions)
	$todoListClientName = "TodoListClient-DotNet-OBO"
	$todoListClientIsPublicClient = $true
	$todoListClientRedirectUri= "https://TodoListClient"


# Registeration for the TodoListClient JavaScript app
# ---------------------------------------------
	# friendly name for the application, for example 'TodoListSPA-OBO' 
	# Apllication Type is 'Web app / API' (that is private application). 
	# For the redirect URL, this is http://localhost:16969/
	# App ID URI, is https://<your_tenant_name>/TodoListSPA-OBO
	# "TodoListService" is a requested resource for this application (Required Permissions)
	$todoListSPAClientName = "TodoListSPA-OBO"
	$todoListSPAClientIsPublicClient = $false
	$todoListSPAClientRedirectUri= "http://localhost:16969/"
	$todoListSPAClientAppIdURI = "https://$tenantName/$todoListSPAClientName"
