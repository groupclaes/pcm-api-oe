import sql from 'mssql'
import db from '../db'
import { FastifyBaseLogger } from 'fastify'

const DB_NAME = 'PCM'

export default class Document {
  schema: string = '[document].'
  _logger: FastifyBaseLogger

  constructor(logger: FastifyBaseLogger) { this._logger = logger }

  async findOne(filters) {
    const r = new sql.Request(await db.get(DB_NAME))
    r.input('id', sql.Int, filters.id)
    r.input('guid', sql.UniqueIdentifier, filters.guid)
    r.input('company', sql.Char, filters.company)
    r.input('company_oe', sql.Char, filters.companyOe)
    r.input('object_type', sql.VarChar, filters.objectType)
    r.input('document_type', sql.VarChar, filters.documentType)
    r.input('object_id', sql.BigInt, filters.objectId)
    r.input('culture', sql.VarChar, filters.culture)

    let result = await r.execute(`${this.schema}usp_findOne`)

    if (result.recordset && result.recordset.length === 1) {
      return result.recordset[0]
    } else if (result.recordset && result.recordset.length > 1) {
      this._logger.error('Wrong number of records, return first result')
      return result.recordset[0]
    }
    return undefined
  }

  async getObjectListOE(company: string, object_type: string, object_id: number, user_id?: number): Promise<DBResultSet> {
    const r = new sql.Request(await db.get(DB_NAME))
    r.input('company', sql.VarChar, company)
    r.input('object_type', sql.VarChar, object_type)
    r.input('object_id', sql.BigInt, object_id)
    r.input('user_id', sql.Int, user_id)

    const result = await r.execute(`${this.schema}usp_getObjectTypeListOE`)

    const { error, verified } = result.recordset[0]

    if (!error) {
      return {
        error,
        verified,
        result: result.recordsets[1][0] || []
      }
    } else {
      return { error, verified }
    }
  }
}

export interface DBResultSet {
  error: string
  verified: boolean
  result?: any[]
}
