import Fastify from '@groupclaes/fastify-elastic'
const config = require('./config')
import { env } from 'process'

import { FastifyInstance } from 'fastify'
import fileController from './controllers/file.controller'
import documentlistController from './controllers/documentlist.controller'
import objectlistController from './controllers/objectlist.controller'

let fastify: FastifyInstance | undefined

/** Main loop */
async function main() {
  // add jwt configuration object to config
  fastify = await Fastify({ ...config.wrapper })
  const version_prefix = (env.APP_VERSION ? '/' + env.APP_VERSION : '')
  await fastify.register(fileController, { prefix: `${version_prefix}/${config.wrapper.serviceName}/file`, logLevel: 'info' })
  await fastify.register(documentlistController, { prefix: `${version_prefix}/${config.wrapper.serviceName}/documentlist`, logLevel: 'info' })
  await fastify.register(objectlistController, { prefix: `${version_prefix}/${config.wrapper.serviceName}/objectlist`, logLevel: 'info' })
  await fastify.listen({ port: +(env['PORT'] ?? 80), host: '::' })
}

['SIGTERM', 'SIGINT'].forEach(signal => {
  process.on(signal, async () => {
    await fastify?.close()
    process.exit(0)
  })
})

main()