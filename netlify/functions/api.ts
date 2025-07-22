// Netlify Function for PocketTrack API
// Note: Install @netlify/functions and serverless-http packages for production use

interface NetlifyEvent {
  path: string
  httpMethod: string
  headers: Record<string, string>
  body: string | null
  queryStringParameters: Record<string, string> | null
}

interface NetlifyContext {
  functionName: string
  functionVersion: string
}

// Convert Express app to Netlify function
const handler = async (event: NetlifyEvent, context: NetlifyContext) => {
  // Handle the Express app in serverless environment
  const path = event.path.replace('/.netlify/functions/api', '') || '/'
  const method = event.httpMethod
  const headers = event.headers || {}
  const body = event.body

  // Create a mock request/response for Express
  const mockReq = {
    method,
    url: path,
    path,
    headers,
    body: body ? JSON.parse(body) : {},
    query: event.queryStringParameters || {},
  }

  const mockRes = {
    statusCode: 200,
    headers: {},
    body: '',
    status: function(code: number) {
      this.statusCode = code
      return this
    },
    json: function(data: any) {
      this.headers['content-type'] = 'application/json'
      this.body = JSON.stringify(data)
      return this
    },
    send: function(data: any) {
      this.body = typeof data === 'string' ? data : JSON.stringify(data)
      return this
    },
  }

  try {
    // This is a simplified handler - for production, use serverless-http package
    return {
      statusCode: 501,
      body: JSON.stringify({ 
        message: 'Serverless function needs serverless-http package for full Express compatibility',
        path,
        method
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}

export { handler }