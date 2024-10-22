// External dependencies
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import {
  SymbologyType,
  OutputType,
  EncodingMode,
  createStream
} from 'symbology'
// https://symbology.dev/docs/api.html

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
    }, Querystring: {
      height?: number
    }
  }>, reply: FastifyReply) {
    const start = performance.now()

    try {
      let height = +(request.query.height ?? 70)
      let { data } = await createStream(
        {
          symbology: SymbologyType.CODE128,
          showHumanReadableText: false,
          height
        },
        request.params.value,
        OutputType.PNG
      )

      if (data) {
        data = data.replace('data:image/png;base64,', '')

        const b64 = Buffer.from(data, 'base64')
        return reply.header('Cache-Control', 'must-revalidate, max-age=172800, private')
          .header('Expires', new Date(new Date().getTime() + 172800000).toUTCString())
          .header('Last-Modified', new Date().toUTCString())
          .type('image/png')
          .send(b64)
      }
      return reply.fail({ data: 'no payload' })
    } catch (err) {
      request.log.error({ error: err }, 'error while generating png')
      return reply.error('error while generating png!', 500, performance.now() - start)
    }
  })
}