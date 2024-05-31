// External dependencies
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { env } from 'process'
import Document from '../repositories/document.repository'

declare module 'fastify' {
  export interface FastifyReply {
    success: (data?: any, code?: number, executionTime?: number) => FastifyReply
    fail: (data?: any, code?: number, executionTime?: number) => FastifyReply
    error: (message?: string, code?: number, executionTime?: number) => FastifyReply
  }
}

export default async function (fastify: FastifyInstance) {
  /**
   * Get all attribute entries from DB
   * @route GET /{APP_VERSION}/oe/objectlist/{company}/{objectType}/{objectId}
  */
  fastify.get('/:company/:object_type/:object_id', async function (request: FastifyRequest<{
    Params: {
      company: string
      object_type: string
      object_id: number
    }
  }>, reply: FastifyReply) {
    const start = performance.now()
    try {
      const repository = new Document(request.log)
      // const token = request.token || { sub: null }

      let company: string = request.params['company'].toLowerCase()
      let object_type: string = request.params['object_type'].toLowerCase()
      let object_id: number = +request.params['object_id']

      const list1 = repository.getObjectListOE(company, object_type, object_id)
      const list2 = repository.getObjectListOE('alg', object_type, object_id)

      const responses = await Promise.all([list1, list2])

      if (responses[1].verified) {
        if (responses[1].result && responses[1].result.length > 0 && responses[0].result) {
          responses[0].result = responses[0].result.concat(responses[1].result)
        }
      }

      if (responses[0].result && responses[0].verified) {
        responses[0].result.filter(e => e.type === 'foto')
          .forEach(e => {
            responses[0].result?.push({
              ...e,
              type: 'display-image',
              // thumbnails are the only exception and should always be retrieved using product-images endpoint
              downloadUrl: `https://pcm.groupclaes.be/${env['APP_VERSION']}/product-images/${e.guid}?s=thumb`
            })
          })


        return reply.success(
          responses[0].result.map(e => ({
            title: e.alt,
            filename: e.name,
            objectType: object_type,
            documentType: e.type,
            objectIds: [
              object_id
            ],
            size: e.size,
            languages: e.languages ? e.languages.map((x: any) => x.name) : [],
            downloadUrl: resolveDownloadUrl(e, company, object_type, object_id)
          })), 200, performance.now() - start)
      }
      request.log.warn('Session has expired!')
      return reply.error('Session has expired!', 401, performance.now() - start)
    } catch (err) {
      request.log.error({ err }, 'failed to get object list!')
      return reply.error('failed to get object list!')
    }
  })
}

const resolveDownloadUrl = (document: { name: string, alt: string, guid: string, comp: string, extension: string, type: string, size: number, lastChanged: Date, languages: { name: string }[] }, company: string, objectType: string, objectId: number) => {
  if (document.type === 'datasheet') {
    return `https://pcm.groupclaes.be/${env['APP_VERSION']}/oe/file/${company}/${objectType}/${document.type}/${objectId}/${document.languages[0].name}`
  }
  return `https://pcm.groupclaes.be/${env['APP_VERSION']}/oe/file/${document.guid}`
}