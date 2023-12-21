import { NextFunction, Request, Response } from "express";
import { Request as oauthreq, Response as oauthres } from "oauth2-server";
const express = require('express');
const path = require('path');
const OAuth2Server = require('oauth2-server');
let db = require('./db.js');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const optionOAuthConfig = {
    model: require('./model'),
    allowBearerTokensInQueryString: true,
    accessTokenLifetime: 4 * 60 * 60
}
const oAuth = new OAuth2Server(optionOAuthConfig)

const authenticateHandle = (req: Request, res: Response, next: NextFunction) => {
    let request = new oauthreq(req)
    let response = new oauthres(res)
    oAuth.authenticate(request, response)
        .then((token: string) => {
            console.log('Token valido')
            next();
        }).catch((error) => {
            res.send(error)
        })
}


function token(req: Request, res: Response, next: NextFunction) {
    let request = new oauthreq(req)
    let response = new oauthres(res)
    oAuth.token(request, response)
        .then((code) => {
            console.log('token', code)
            res.send(code)
        }).catch((error) => {
            res.send('erro ' + error)
        });
}


// Função para simular a autorização
async function authorize(req, res, next) {
    const request = new oauthreq(req);
    const response = new oauthres(res);

    try {
        // Verifica se o usuário está autenticado
        if (!req.body.client_id) {
            // Redireciona o usuário para a página de login
            return res.redirect('/login');
        }

        // Processa a autorização
        const server = oAuth;
        //   const options = { authenticateHandler: { handle: () => req.user } };
        const options = {
            authenticateHandler: {
                handle: function (req, res) {
                    return db.confidentialClients.filter(function (client) {
                        return client.clientId === req.body.client_id
                    })
                }
            }
        }
        const code = await server.authorize(request, response, options)
        res.json(code);
    } catch (error) {
        // Trata erros de autorização
        return res.status(error.code || 500).json(error);
    }
}

// var options = {
//     handle:()=> req.user,
//     authenticateHandler:()=>{
//         req.user
//     }
// }


// function autorization (req,res,options,callback){
//     req.query.allowed = true;
//     var aut = await oAuth.autorize(req,res,options){

//     }
// }




// app.use(express.json());
// app.use(express.urlencoded({extended: true}));


app.get("/authorize", authorize);

app.post('/auth', token)

app.get('/secret', authenticateHandle, (req: Request, res: Response) => {
    res.send('Welcome to the secret area.');
})









app.listen(3000, () => {
    console.log('listening on')
})