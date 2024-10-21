// External dependencies
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import {
  SymbologyType,
  OutputType,
  EncodingMode,
  createStream
} from 'symbology'

declare module 'fastify' {
  export interface FastifyReply {
    success: (data?: any, code?: number, executionTime?: number) => FastifyReply
    fail: (data?: any, code?: number, executionTime?: number) => FastifyReply
    error: (message?: string, code?: number, executionTime?: number) => FastifyReply
  }
}

export default async function (fastify: FastifyInstance) {
  fastify.get('/barcode/:format/:value', async function (request: FastifyRequest<{
    Params: {
      format: string,
      value: string
    }
  }>, reply: FastifyReply) {
    const start = performance.now()

    try {
      const { data } = await createStream(
        {
          symbology: SymbologyType.CODE128B,
          encoding: EncodingMode.GS1_MODE
        },
        request.params.value,
        OutputType.PNG
      )

      reply.header('Cache-Control', 'must-revalidate, max-age=172800, private')
        .header('Expires', new Date(new Date().getTime() + 172800000).toUTCString())
        .header('Last-Modified', new Date().toUTCString())
        .type('image/png')
        .send(data)
    } catch (err) {
      request.log.error({ error: err }, 'error while generating png')
      return reply.error('error while generating png!', 500, performance.now() - start)
    }
  })
}