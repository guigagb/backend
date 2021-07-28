const db = require('../../config/db')

module.exports = {
    async perfis(_, { dados }, context) {

        context && context.validarAdmin()

        return await db('perfis').select()

    },
    async perfil(_, { filtro }, context) {

        context && context.validarAdmin()

        const { id, nome } = filtro

        if (id)
            return await db('perfis').select().where({ id }).first()

        else if (nome)
            return await db('perfis').select().where('nome', 'ilike', nome).first()

        else return null

    }
}