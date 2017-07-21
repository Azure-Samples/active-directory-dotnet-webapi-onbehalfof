'use strict';

config.callback = loggedin;
var authenticationContext = new AuthenticationContext(config);

if (authenticationContext.isCallback(window.location.hash)) {
    authenticationContext.handleWindowCallback();
}
else {
    var user = authenticationContext.getCachedUser();
    if (user && window.parent === window && !window.opener) {

        // Show the user info.
        var userInfoElement = document.getElementById("userInfo");
        userInfoElement.parentElement.classList.remove("hidden");
        userInfoElement.innerHTML = JSON.stringify(user, null, 4);

        // Show the Sign-Out button
        document.getElementById("signOutButton").classList.remove("hidden");

        // Call the protected API to show the content of the todo list
        acquireTokenAndCallService();
    }
}

function displayTodoList() {
    authenticationContext.login();
}

function signOut() {
    authenticationContext.logOut();
}

function loggedin(errorDescription, idToken, error) {
    if (error) {
        showError(errorDescription, error);
    }
    else {
        if (config.popUp) {
            authenticationContext.getUser(onLogin);
        }
    }
}

/**
 * Function called when the user is logged-in
 * @param {string} error - Error from the STS
 * @param {any} user - Data about the logged-in user
 */
function onLogin(error, user) {
    if (user) {
        // Show the information about the user
        var userInfoElement = document.getElementById("userInfo");
        userInfoElement.parentElement.classList.remove("hidden");
        userInfoElement.innerHTML = JSON.stringify(user, null, 4);

        // Show the Sign-Out button
        document.getElementById("signOutButton").classList.remove("hidden");

        // Call the protected API to show the content of the todo list
        acquireTokenAndCallService();
    }
    if (error) {
        showError("login", error);
    }
}

/**
 * Acquire an access token and call the Web API
 */
function acquireTokenAndCallService() {
    authenticationContext.acquireToken(webApiConfig.resourceId, function (errorDesc, token, error) {
        if (error) {
            if (config.popUp) {
                authenticationContext.acquireTokenPopup(webApiConfig.resourceId, null, null, onAccessToken);
            }
            else {
                authenticationContext.acquireTokenRedirect(webApiConfig.resourceId, null, null);
            }
        }
        else {
            onAccessToken(errorDesc, token, error);
        }
    })
}

/**
 * Function called when the access token is available
 * @param {string} errorDesc - Error message
 * @param {string} token - Access token to use in the Web API
 * @param {string} error - Error code from the STS
 */
function onAccessToken(errorDesc, token, error) {
    if (error) {
        showError("acquireToken", error);
    }
    if (token) {
        callServiceWithToken(token, webApiConfig.resourceBaseAddress + "api/todolist");
    }
}


/**
 * Show an error message in the page
 * @param {string} token - Access token for the web API
 * @param {string} endpoint - endpoint to the Web API to call
 */
function callServiceWithToken(token, endpoint) {
    // Header won't work in IE, but you could replace it with a call to AJAX JQuery for instance.
    var headers = new Headers();
    var bearer = "Bearer " + token;
    headers.append("Authorization", bearer);
    var options = {
        method: "GET",
        headers: headers
    };

    // Note that fetch API is not available in all browsers
    fetch(endpoint, options)
        .then(function (response) {
            var contentType = response.headers.get("content-type");
            if (response.status === 200 && contentType && contentType.indexOf("application/json") !== -1) {
                response.json()
                    .then(function (data) {
                        // Display response in the page
                        showAPIResponse(data, token);
                    })
                    .catch(function (error) {
                        showError(endpoint, error);
                    });
            } else {
                response.json()
                    .then(function (data) {
                        // Display response in the page
                        showError(endpoint, data);
                    })
                    .catch(function (error) {
                        showError(endpoint, error);
                    });
            }
        })
        .catch(function (error) {
            showError(endpoint, error);
        });
}

/**
 * Display the response from the Web API (as JSON)
 * @param {any} data - the JSon data
 * @param {any} token - the access token
 */
function showAPIResponse(data, token) {
    var responseElement = document.getElementById("apiResponse");
    responseElement.parentElement.classList.remove("hidden");
    console.log(data);
    responseElement.innerHTML = JSON.stringify(data, null, 4);
}

/**
 * Show an error message in the page
 * @param {any} endpoint - the endpoint used for the error message
 * @param {any} error - the error string
 */
function showError(endpoint, error) {
    var errorElement = document.getElementById("errorMessage");
    console.error(error);
    var formattedError = JSON.stringify(error, null, 4);
    if (formattedError.length < 3) {
        formattedError = error;
    }
    errorElement.innerHTML = "Error calling " + endpoint + ": " + formattedError;
}