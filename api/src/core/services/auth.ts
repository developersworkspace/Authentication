// Imports
import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';
import * as base64 from 'base-64';
import * as utf8 from 'utf8';
import * as clientOAuth2 from 'client-oauth2';

// Imports repositories
import { CredentialsRepository } from './../repositories/credentials';

export class AuthService {

    constructor(private baseUri: string, private jwtSecret: string, private jwtIssuer: string, private oauthConfig: any, private credentialsRepository: CredentialsRepository) { }

    authorize(clientId: string, username: string): string {
        let token = jwt.sign({ username: username }, this.jwtSecret, {
            expiresIn: 3600,
            audience: clientId,
            issuer: this.jwtIssuer,
            jwtid: uuid.v4()
        });

        return token;
    }

    verify(token: string): Boolean {
        try {
            let decoded = jwt.verify(token, this.jwtSecret, {
                issuer: this.jwtIssuer
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    decodeToken(token: string): any {
        try {
            let decoded = jwt.verify(token, this.jwtSecret, {
                issuer: this.jwtIssuer
            });
            return decoded;
        } catch (err) {
            return null;
        }
    }

    authenticate(clientId: string, username: string, password: string): Promise<Boolean> {
        return this.credentialsRepository.validate(clientId, username, password);
    }

    createClientAuths(clientId: string, redirectUri: string): any {

        let encodedState = this.encodeState(clientId, redirectUri);

        let githubAuth = new clientOAuth2({
            clientId: this.oauthConfig.github.clientId,
            clientSecret: this.oauthConfig.github.clientSecret,
            accessTokenUri: 'https://github.com/login/oauth/access_token',
            authorizationUri: 'https://github.com/login/oauth/authorize',
            redirectUri: this.baseUri + '/api/auth/github/callback',
            scopes: ['user:email'],
            state: encodedState
        }, null);

        let googleAuth = new clientOAuth2({
            clientId: this.oauthConfig.google.clientId,
            clientSecret: this.oauthConfig.google.clientSecret,
            accessTokenUri: 'https://www.googleapis.com/oauth2/v4/token',
            authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
            redirectUri: this.baseUri + '/api/auth/google/callback',
            scopes: ['https://www.googleapis.com/auth/userinfo.email'],
            state: encodedState
        }, null);

        return {
            githubAuth: githubAuth,
            googleAuth: googleAuth
        };
    }

    decodeState(state: string): any {

        let bytes = base64.decode(state);
        let text = utf8.decode(bytes);
        let splittedText = text.split('|');

        return {
            clientId: splittedText[0],
            redirectUri: splittedText[1]
        };
    }

    encodeState(clientId: string, redirectUri: string): string {

        if (redirectUri == null) {
            return null;
        }

        let bytes = utf8.encode(clientId + '|' + redirectUri);
        let encodedState = base64.encode(bytes);

        return encodedState;
    }
}