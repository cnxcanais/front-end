import { deleteFile } from '@/http/controllers/files/delete-file'
import { saveFile } from '@/http/controllers/files/save-file'
import { FastifyInstance } from 'fastify'
import { fetchFiles } from './fetch-files'
import { findFile } from './find-file'
import { updateFileInformation } from './update-file-information'

export async function filesRoutes(app: FastifyInstance) {
  app.post('/file', saveFile)
  app.get('/file/account/:account_id', fetchFiles)
  app.get('/file/:fileId', findFile)
  app.delete('/file/:fileId', deleteFile)
  app.put('/file/:fileId', updateFileInformation)
}
