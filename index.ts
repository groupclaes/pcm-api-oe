import server from './src'
const cfg = require('./config')

const main = async function () {
  const fastify = await server(cfg);

  ['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, async () => {
      fastify?.log.fatal('process was killed due to magic')
      await fastify?.close()
      process.exit(0)
    })
  })
}

main()