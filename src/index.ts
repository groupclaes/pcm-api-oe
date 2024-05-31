import Fastify from '@groupclaes/fastify-elastic'
import { env } from 'process'

import { FastifyInstance } from 'fastify'
import fileController from './controllers/file.controller'
import documentlistController from './controllers/documentlist.controller'
import objectlistController from './controllers/objectlist.controller'

const LOGLEVEL = 'warn'

/** Main loop */
export default async function (config: any): Promise<FastifyInstance | undefined> {
  if (!config.wrapper.mssql && config.mssql) config.wrapper.mssql = config.mssql
  if (!config.wrapper.fastify.requestLogging) config.wrapper.fastify.requestLogging = true
  const fastify = await Fastify({ ...config.wrapper, securityHeaders: { csp: `default-src 'self' 'unsafe-inline' pcm.groupclaes.be` } })
  const version_prefix = (env.APP_VERSION ? '/' + env.APP_VERSION : '')
  await fastify.register(fileController, { prefix: `${version_prefix}/${config.wrapper.serviceName}/file`, logLevel: LOGLEVEL })
  await fastify.register(documentlistController, { prefix: `${version_prefix}/${config.wrapper.serviceName}/documentlist`, logLevel: LOGLEVEL })
  await fastify.register(objectlistController, { prefix: `${version_prefix}/${config.wrapper.serviceName}/objectlist`, logLevel: LOGLEVEL })
  await fastify.listen({ port: +(env['PORT'] ?? 80), host: '::' })
  return fastify
  // https://pcm.groupclaes.be/v4/oe/file/759aba77-bffa-4b6f-bd09-deeb5ba5b28a?show
}