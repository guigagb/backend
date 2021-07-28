require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')
const { importSchema } = require('graphql-import')
const resolvers = require('./resolvers')
const context = require('./config/context')

const schemaPath = './schema/index.graphql'
const server = new ApolloServer({
    typeDefs: importSchema(schemaPath),
    resolvers,
    context
})

server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`Executando em ${url} - ${process.env.NODE_ENV}`)
})