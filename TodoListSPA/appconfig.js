// Configuration of the Azure AD Application for this TodoList Single Page application
// Note that changing popUp to false will produce a completely different UX based on redirects instead of popups.
var config = {
    tenant: "[Enter_tenant_name,_e.g._contoso.onmicrosoft.com]",
    clientId: "[Enter_client_ID_as_obtained_from_Azure_Portal_for_this_SPA,_e.g._7cee0f68-5051-41f6-9e45-80463d21d65d]",
    redirectUri: "http://localhost:16969/",
    popUp: true
}

// Configuration of the Azure AD Application for the WebAPI called by this single page application (TodoListService)
var webApiConfig = {
    resourceId: "[Enter_App_ID_URI_of_TodoListService,_e.g._https://contoso.onmicrosoft.com/TodoListService]",
    resourceBaseAddress: "http://localhost:9184/",
}
