const db = require('../../config/db')
const bcrypt = require('bcrypt-nodejs')
const { getUsuarioLogado } = require('../comum/usuario')

module.exports = {

    async login(_, { dados }) {

        const usuario = await db('usuarios').where({ email: dados.email }).first()

        if (!usuario)
            throw new Error('Usuário/Senha inválido')

        const saoIguais = bcrypt.compareSync(dados.senha, usuario.senha)

        if (!saoIguais)
            throw new Error('Usuário/Senha inválido')

        return getUsuarioLogado(usuario)

    },

    async usuarios(_, { dados }, context) {

        context && context.validarAdmin()

        return await db('usuarios').select()

    },
    async usuario(_, { filtro }, context) {

        context && context.validarUsuarioFiltro()

        if (filtro.id)
            return await db('usuarios').select().where({ id: filtro.id }).first()

        if (filtro.email)
            return await db('usuarios').select().where('email', 'ilike', filtro.email).first()

    },
}