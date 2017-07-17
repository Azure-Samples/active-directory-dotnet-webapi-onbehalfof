# Variables for the registration of the AAD applications

# Registeration for the TodoListService web API
# ----------------------------------------
	# friendly name for the application, for example 'TodoListService' 
	# Apllication Type is 'Web Application and/or Web API' (private application). 
	# For the sign-on URL, is the base URL for the sample, which is by default https://localhost:44321. 
	# App ID URI, is https://<your_tenant_name>/TodoListService
	$todoListServiceWebApiName = "TodoListService"
	$todoListServiceWebApiIsPublicClient = $false
	$todoListServiceWebApiBaseUrl= "https://localhost:44321"
    $todoListServiceWebApiAppIdURI = "https://$tenantName/$todoListServiceWebApiName"

# Registeration for the TodoListClien app
# ---------------------------------------
	# friendly name for the application, for example 'TodoListClient-DotNet' 
	# Apllication Type is 'Native' (that is public application). 
	# For the redirect URL, this is https://TodoListClient (not be used in this sample, but it needs to be defined nonetheless)
	# App ID URI, is https://<your_tenant_name>/TodoListService
	# "DTodoListService" is a requested resource for this application (Required Permissions)
	$todoListClientName = "TodoListClient-DotNet"
	$todoListClientIsPublicClient = $true
	$todoListClientRedirectUri= "https://TodoListClient"
