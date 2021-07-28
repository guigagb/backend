const bcrypt = require('bcrypt-nodejs')
const db = require('../../config/db')
const qryUsuario = require('../Query/usuario')
const { perfil: getPerfil } = require('../Query/perfil')

const mutations = {
    registrarUsuario(_, { dados }) {
        return mutations.novoUsuario(_, {
            dados: {
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha
            }
        })
    },

    async novoUsuario(_, { dados }, context) {

        context && context.validarAdmin()

        const filtro = { email: dados.email }
        const usuarioJaExiste = await qryUsuario.usuario(_, { filtro })

        if (usuarioJaExiste)
            throw new Error('Esse usuário já foi cadastrado.')

        const idsPerfis = []

        if (!dados.perfis || !dados.perfis.length) {
            dados.perfis = [{
                nome: 'comum'
            }]
        }

        for (let filtro of dados.perfis) {
            const perfil = await getPerfil(_, { filtro })
            if (perfil) idsPerfis.push(perfil.id)
        }

        delete dados.perfis

        const salt = bcrypt.genSaltSync()
        dados.senha = bcrypt.hashSync(dados.senha, salt)

        const id = (await db('usuarios').insert(dados).returning('id'))[0]

        for (let perfil_id of idsPerfis) {
            await db('usuarios_perfis').insert({ perfil_id, usuario_id: id })
        }

        return { ...dados, id }

    },
    async excluirUsuario(_, { filtro }, context) {

        context && context.validarAdmin()

        const usuario = await qryUsuario.usuario(_, { filtro })

        if (!usuario)
            throw new Error('Usuário não localizado.')

        await db('usuarios').delete().where({ id: usuario.id })

        return usuario

    },
    async alterarUsuario(_, { filtro, dados }, context) {

        context && context.validarUsuarioFiltro()

        const usuario = await qryUsuario.usuario(_, { filtro })

        if (!usuario)
            throw new Error('Usuário não localizado.')

        if (dados.senha) {
            const salt = bcrypt.genSaltSync()
            dados.senha = bcrypt.hashSync(dados.senha, salt)
        }

        await db('usuarios').update(dados).where({ id: usuario.id })

        return { ...usuario, ...dados }

    }
}

module.exports = mutations