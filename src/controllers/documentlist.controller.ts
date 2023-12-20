import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  export interface FastifyReply {
    success: (data?: any, code?: number, executionTime?: number) => FastifyReply
    fail: (data?: any, code?: number, executionTime?: number) => FastifyReply
    error: (message?: string, code?: number, executionTime?: number) => FastifyReply
  }
}

export default async function (fastify: FastifyInstance) {
  /**
   * @route GET /{APP_VERSION}/oe/documentslist/{directory_id}/{datelastmodified?}
  */
  fastify.get('/:directory_id/:datelastmodified?', async function (request: FastifyRequest<{
    Params: {
      directory_id: number
      datelastmodified?: string
    }
  }>, reply: FastifyReply) {
    try {
      let directory_id: number = +request.params.directory_id
      let datelastmodified: string | undefined = request.params.datelastmodified

      return reply
        .status(204)
        .send({
          directory_id,
          datelastmodified
        })
    } catch (err) {
      return reply
        .status(500)
        .send(err)
    }
  })

  /**
   * @route /{APP_VERSION}/oe/documentslist/{company}/{object_type}/{document_type}/{datelastmodified?}
   */
  fastify.get(':company/:object_type/:document_type/:datelastmodified?', async function (request: FastifyRequest<{
    Params: {
      company: string
      object_type: string
      document_type: string
      datelastmodified?: string
    }
  }>, reply: FastifyReply) {
    try {
      let company: string = request.params.company.toLowerCase()
      let object_type: string = request.params.object_type.toLowerCase()
      let document_type: string = request.params.document_type.toLowerCase()
      let datelastmodified: string | undefined = request.params.datelastmodified

      return reply
        .status(204)
        .send({
          company,
          object_type,
          document_type,
          datelastmodified
        })
    } catch (err) {
      return reply
        .status(500)
        .send(err)
    }
  })
}