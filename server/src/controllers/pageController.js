const { 
  createPageService,
  createPagesService
 } = require('../services/pageService')
 const HTTP_STATUS = require('../constants/httpConstants')
 const logger = require('../logger/logger')

class PageController {
async createPage(req, res, next) {
  const { title, content, link, order } = req.body
  const { lessonId } = req.params
  try {
    await createPageService(title, content, lessonId, order)
    res.status(HTTP_STATUS.OK).json({ message: 'Page created succesfully' })
  } catch (error) {
    logger.error(`Pagecreation error - ${error.message}`)
    next(error)
  }
}

async createMultiplePages(req, res, next) {
  const { pages } = req.body
  const { lessonId } = req.params
  try {
    await createPagesService(pages, lessonId)
    res.status(HTTP_STATUS.OK).json({ message: 'Page created succesfully' })
  } catch (error) {
    logger.error(`Pagecreation error - ${error.message}`)
    next(error)
  }
}
}

module.exports = new PageController()