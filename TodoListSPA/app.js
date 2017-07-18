// JavaScript source code
'use strict';

config.callback = loggedin;
var authenticationContext = new AuthenticationContext(config);


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
        authenticationContext.getUser(onLogin);
    }
}

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


function acquireTokenAndCallService() {
    authenticationContext.acquireToken(webApiConfig.resourceId, function (errorDesc, token, error)
    {
        if (error)
        {
            authenticationContext.acquireTokenPopup(webApiConfig.resourceId, null, null, onAccessToken);
        }
        else
        {
            onAccessToken(errorDesc, token, error);
        }
    })
}

function onAccessToken(errorDesc, token, error) {
    if (error) {
        showError("acquireToken", error);
    }
    if (token) {
        callServiceWithToken(token, webApiConfig.resourceBaseAddress+"api/todolist");
    }
}


function callServiceWithToken(token, endpoint) {
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