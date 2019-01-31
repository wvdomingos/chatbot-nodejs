/**
 * Arquivo: pizzaria/pizzaria.js
 * Data: 28/01/2019
 * Descrição: Projeto de desenvolvimento de um Chatbot
 * Autor: Wander Vilhalva Domingos
 * 
 */

require('dotenv-extended').load({
    path: "../.env"
});

const restify = require('restify');
const builder = require('botbuilder');
const moment = require('moment');

const server = restify.createServer();

//Configuração do Chatbot
let connector = new builder.ChatConnector({
    appId: "",
    appPassword: ""
})

let bot = new builder.UniversalBot(connector);

//Configuração do LUIS
let recongnizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
let intents = new builder.IntentDialog({ recognizers: [recongnizer]});

//Configuração dos 'Intents' (Intenções)

// Endpoint - Saudar
intents.matches('Saudar', (session, results) => {
    session.send('Oi! Tudo bem? Em que posso ajudar?')
});

intents.matches('Pedir', [
    (session, args, next) => {
        var pizzas = [
            "Quatro Queijos",
            "Calabresa", 
            "Frango Catupiri",
            "Portuguesa",
            "Mussarela",
            "Especial da Casa",
            "Baiana",
            "Bacno"
        ];

        let entityPizza = builder.EntityRecognizer.findEntity(args.entities, 'Pizza');

        if (entityPizza) {
            var match = builder.EntityRecognizer.findBestMatch(pizzas, entityPizza);
        }

        if (!match){
            builder.Prompts.choice(session, 'No momento só temos essas pizzas disponíveis! \n Qual que você gostaria de pedir? \n ')
        } else {
            next({ reponse: match });
        }
    },
    (session, results) => {
        if (results.response) {
            var time = moment().add(30, 'm');

            session.dialogData.time = time.format('HH:mm');
            session.send("Perfeito! Sua pizza de **%s** chegará às **%s**", results.response, session.dialogData.time );
        }else {
            session.send('Sem problemas! Se não gostarem, podem pedir numa próxima vez!');
        }
    } 
]);

// Endpoint - Cancelar
intents.matches('Cancelar', (session, results) => {
    session.send('Pedido cancelado com sucesso! \n Muito obrigado e volte sempre!')
});

// Endpoint - Verificar
intents.matches('Verificar', (session, results) => {
    session.send('Sua pizza chegará às **%s**', session.dialogData.time)
});

// Endpoint - Default
let teste = intents.onDefault(
    builder.DialogAction.send('Desculpe! Mas, não entendi o que você quis dizer.')
);

bot.dialog('/', intents);

//Configuração do Servidor via restify
server.post('/api/messages', connector.listen());

server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('Aplicação está sendo executada na porta %s', server.name, server.url );
})