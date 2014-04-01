//----------------------------------------------------------------------------------------------
//    Copyright 2014 Microsoft Corporation
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
//----------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

// The following using statements were added for this sample.
using System.Collections.Concurrent;
using TodoListService.Models;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Globalization;
using System.Configuration;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Web;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace TodoListService.Controllers
{
    [Authorize]
    public class TodoListController : ApiController
    {
        //
        // The Client ID is used by the application to uniquely identify itself to Azure AD.
        // The App Key is a credential used by the application to authenticate to Azure AD.
        // The Tenant is the name of the Azure AD tenant in which this application is registered.
        // The AAD Instance is the instance of Azure, for example public Azure or Azure China.
        // The Authority is the sign-in URL of the tenant.
        //
        private static string aadInstance = ConfigurationManager.AppSettings["ida:AADInstance"];
        private static string tenant = ConfigurationManager.AppSettings["ida:Tenant"];
        private static string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
        private static string appKey = ConfigurationManager.AppSettings["ida:AppKey"];

        //
        // To authenticate to the Graph API, the app needs to know the Grah API's App ID URI.
        // To contact the Me endpoint on the Graph API we need the URL as well.
        //
        private static string graphResourceId = ConfigurationManager.AppSettings["ida:GraphResourceId"];
        private static string graphUserUrl = ConfigurationManager.AppSettings["ida:GraphUserUrl"];
        private const string TenantIdClaimType = "http://schemas.microsoft.com/identity/claims/tenantid";

        //
        // To Do items list for all users.  Since the list is stored in memory, it will go away if the service is cycled.
        //
        static ConcurrentBag<TodoItem> todoBag = new ConcurrentBag<TodoItem>();

        // GET api/todolist
        public IEnumerable<TodoItem> Get()
        {
            //
            // The Scope claim tells you what permissions the client application has in the service.
            // In this case we look for a scope value of user_impersonation, or full access to the service as the user.
            //
            if (ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/scope").Value != "user_impersonation")
            {
                throw new HttpResponseException(new HttpResponseMessage { StatusCode = HttpStatusCode.Unauthorized, ReasonPhrase = "The Scope claim does not contain 'user_impersonation' or scope claim not found" });
            }

            // A user's To Do list is keyed off of the NameIdentifier claim, which contains an immutable, unique identifier for the user.
            Claim subject = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier);

            return from todo in todoBag
                   where todo.Owner == subject.Value
                   select todo;
        }

        // POST api/todolist
        public async Task Post(TodoItem todo)
        {
            if (ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/scope").Value != "user_impersonation")
            {
                throw new HttpResponseException(new HttpResponseMessage { StatusCode = HttpStatusCode.Unauthorized, ReasonPhrase = "The Scope claim does not contain 'user_impersonation' or scope claim not found" });
            }

            //
            // Call the Graph API On Behalf Of the user who called the To Do list web API.
            //
            string augmentedTitle = null;
            UserProfile profile = new UserProfile();
            profile = await CallGraphAPIOnBehalfOfUser();
            if (profile != null)
            {
                augmentedTitle = String.Format("{0}, First Name: {1}, Last Name: {2}", todo.Title, profile.GivenName, profile.Surname);
            }
            else
            {
                augmentedTitle = todo.Title;
            }

            if (null != todo && !string.IsNullOrWhiteSpace(todo.Title))
            {
                todoBag.Add(new TodoItem { Title = augmentedTitle, Owner = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value });
            }
        }

        public static async Task<UserProfile> CallGraphAPIOnBehalfOfUser()
        {
            UserProfile profile = null;
            string accessToken = null;
            AuthenticationResult result = null;

            //
            // Use ADAL to get a token On Behalf Of the current user.  To do this we will need:
            //      The Resource ID of the service we want to call.
            //      The current user's access token, from the current request's authorization header.
            //      The credentials of this application.
            //
            ClientCredential clientCred = new ClientCredential(clientId, appKey);
            string authHeader = HttpContext.Current.Request.Headers["Authorization"];
            // The header is of the form "bearer <accesstoken>", so extract to the right of the whitespace to find the access token.
            string userAccessToken = authHeader.Substring(authHeader.LastIndexOf(' ')).Trim();
            UserAssertion userAssertion = new UserAssertion(userAccessToken);

            string authority = String.Format(CultureInfo.InvariantCulture, aadInstance, tenant);
            AuthenticationContext authContext = new AuthenticationContext(authority);
            try
            {
                result = authContext.AcquireToken(graphResourceId, userAssertion, clientCred);
                accessToken = result.AccessToken;
            }
            catch
            {
                // An unexpected error occurred.  Return a null profile.
                return (null);
            }

            //
            // Call the Graph API and retrieve the user's profile.
            //
            string requestUrl = String.Format(
                CultureInfo.InvariantCulture,
                graphUserUrl,
                HttpUtility.UrlEncode(tenant));
            HttpClient client = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            HttpResponseMessage response = await client.SendAsync(request);

            //
            // Return the user's profile.
            //
            if (response.IsSuccessStatusCode)
            {
                string responseString = await response.Content.ReadAsStringAsync();
                profile = JsonConvert.DeserializeObject<UserProfile>(responseString);
                return (profile);
            }

            // An unexpected error occurred calling the Graph API.  Return a null profile.
            return (null);
        }
    }
}
