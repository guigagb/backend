const db = require('../../config/db')
const qryPerfil = require('../Query/perfil')

module.exports = {
    async novoPerfil(_, { dados }, context) {

        context && context.validarAdmin()

        const filtro = { nome: dados.nome }
        const perfilJaExiste = await qryPerfil.perfil(_, { filtro })

        if (perfilJaExiste)
            throw new Error('Esse perfil já foi cadastrado.')

        const id = (await db('perfis').insert(dados).returning('id'))[0]

        return { ...dados, id }

    },

    async excluirPerfil(_, { filtro }, context) {

        context && context.validarAdmin()

        const perfil = await qryPerfil.perfil(_, { filtro })

        if (perfil == undefined)
            throw new Error('Perfil não localizado.')

        await db('perfis').delete().where({ id: perfil.id })

        return perfil

    },

    async alterarPerfil(_, { filtro, dados }, context) {

        context && context.validarAdmin()

        const perfil = await qryPerfil.perfil(_, { filtro })

        if (perfil == undefined)
            throw new Error('Perfil não localizado.')

        await db('perfis').update(dados).where({ id: perfil.id })

        return { ...perfil, ...dados }

    }
}