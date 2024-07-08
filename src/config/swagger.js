const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'BookStore Management API',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);

module.exports = openapiSpecification;
