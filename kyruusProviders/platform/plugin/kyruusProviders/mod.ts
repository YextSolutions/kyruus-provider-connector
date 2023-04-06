declare const clientId: string;
declare const clientSecret: string;
declare const customer: string;

const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams ({
        'grant_type': 'client_credentials',
        'client_id': `${clientId}`,
        'client_secret': `${clientSecret}`
    })
}

//fetch URL for Kyruus
let providerUrl = `https://api.kyruus.com/v9/${customer}/providers?per_page=50&sort=name&availability_fields=-ALL&exclude_from_analytics=true`;

//fetchProviders
export const fetchProviders = async (inputString) => {
    //fetch access token
    var tokenRequest = await fetch ('https://api.kyruus.com/oauth2/token', requestOptions).then(response => response.json());
    var accessToken = tokenRequest.access_token;

    var requestOptionsNew = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }
    
    //fetch providers info
    const inputJson = JSON.parse(inputString);
    const pageToken = inputJson.pageToken;
  
    let urlParams = new URLSearchParams(providerUrl.slice(providerUrl.indexOf('?')));
    let currentPage = urlParams.get('page');
  
    // Reset the providerUrl variable to its original value before appending the pageToken parameter
    let updatedProviderUrl = providerUrl.split('&page=')[0];
  
    if (pageToken && currentPage !== pageToken) {
      // Append the pageToken parameter to the updatedProviderUrl
      updatedProviderUrl = `${updatedProviderUrl}&page=${pageToken}`;
    }
  
    const providers = await fetch(updatedProviderUrl, requestOptionsNew).then((response) =>
      response.json()
    );
  
    if (providers._metadata.provider_count === 0) {
      const response = { data: [] };
      const stringify = JSON.stringify(response);
      return stringify;
    } else {
      const response = { data: providers };
      if (pageToken) {
        response['nextPageToken'] = parseInt(pageToken) + 1;
      } else {
        response['nextPageToken'] = 2;
      }
      const stringify = JSON.stringify(response);
      return stringify;
    }
  };