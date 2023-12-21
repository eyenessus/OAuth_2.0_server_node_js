"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let db = require('./db.js');
const getAccessToken = (accessToken) => {
    let tokens = db.tokens.filter((savedToken) => {
        return savedToken.accessToken === accessToken;
    });
    return tokens[0];
};
const getClient = (clientId, clientSecret) => {
    let confidentialClients = db.confidentialClients.filter((client) => {
        return client.clientId === clientId || client.clientSecret === clientSecret;
    });
    return confidentialClients[0];
};
const saveToken = (token, client, user) => {
    token.client = {
        id: client.clientId
    };
    token.user = {
        username: user
    };
    db.tokens.push(token);
    return token;
};
const getUserFromClient = (client) => {
    console.log('calll getUserFromClient');
    return client.clientId;
};
// list of valid scopes
const VALID_SCOPES = ['read', 'write'];
function validateScope(user, client, scope) {
    if (!scope.split(' ').every(s => VALID_SCOPES.indexOf(s) >= 0)) {
        return false;
    }
    return scope;
}
function verifyScope(token, scope) {
    if (!token.scope) {
        return false;
    }
    let requestedScopes = scope.split(' ');
    let authorizedScopes = token.scope.split(' ');
    return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
}
function saveAuthorizationCode(code, client, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorizationCode = {
            authorizationCode: code.authorizationCode,
            expiresAt: code.expiresAt,
            redirectUri: code.redirectUri,
            scope: code.scope,
            clientId: client.clientId,
            userId: user._id
        };
        return authorizationCode;
    });
}
module.exports = {
    getClient: getClient,
    saveToken: saveToken,
    getUserFromClient: getUserFromClient,
    getAccessToken: getAccessToken,
    validateScope: validateScope,
    verifyScope: verifyScope,
    saveAuthorizationCode: saveAuthorizationCode
};
