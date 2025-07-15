import colors from 'colors'
import server from './server'

const port = Number(process.env.PORT) || 4000

server.listen(port, '0.0.0.0', () => {
  console.log(colors.magenta.italic.bold('Servidor funcionando en el puerto:'), port)
})
