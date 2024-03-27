const msgList = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
  }
  module.exports = (res, statusCode, msg) => {
    try {
      return msg ? res.status(statusCode).json({ result: msg }) : res.status(statusCode).json({ result: msgList[statusCode] })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ result: msgList['500'] })
    }
  }