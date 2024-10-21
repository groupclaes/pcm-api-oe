// External dependencies
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { SymbologyType, createStream } from 'symbology'

declare module 'fastify' {
  export interface FastifyReply {
    success: (data?: any, code?: number, executionTime?: number) => FastifyReply
    fail: (data?: any, code?: number, executionTime?: number) => FastifyReply
    error: (message?: string, code?: number, executionTime?: number) => FastifyReply
  }
}

export default async function (fastify: FastifyInstance) {
  fastify.get('/tools/barcode/:format/:value', async function (request: FastifyRequest<{
    Params: {
      format: string,
      value: string
    }
  }>, reply: FastifyReply) {
    const start = performance.now()

    const { data } = await createStream({
      symbology: SymbologyType.CODE128B
    }, request.params.value)


    reply.header('Cache-Control', 'must-revalidate, max-age=172800, private')
      .header('Expires', new Date(new Date().getTime() + 172800000).toUTCString())
      .header('Last-Modified', new Date().toUTCString())
      .type('image/png')
      .send(data)
  })
}