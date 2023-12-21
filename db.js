"use strict";
module.exports = {
    // Add confidential clients[]
    confidentialClients: [{
            clientId: 'codecademy',
            clientSecret: 'codec@demy',
            grants: [
                'client_credentials',
                'authorization_code'
            ],
            redirectUris: ['https://ednei.com.br/oauth']
        }],
    // Add tokens[]
    tokens: [],
    codeAuthorization: []
};
//data base
