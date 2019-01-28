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