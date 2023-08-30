
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const url = new URL(request.url);
  
    if (request.method === 'GET') {
      const id = url.pathname.split('/').pop();
      if (id != '') {
        // Handle GET /{id}
        let body = await BLOCKY.get(id);
        if (!body) {
          const res = await fetch('https://ekasa.financnasprava.sk/mdu/api/v1/opd/receipt/find', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiptId: id })
          })
          body = await res.text()
          await BLOCKY.put(id, body)
        }
        return new Response(body, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400', // 24 hours
          },
        });
      }
  
      // Handle GET /
      const listResult = await BLOCKY.list();
      const list = [];
      for await (const { name } of listResult.keys) {
        list.push(name);
      }
      return new Response(list.join('\n'), {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  
    // Handle PUT /{id}
    if (request.method === 'PUT') {
      const id = url.pathname.split('/').pop();
      if (id == '') {
        return new Response('No', { status: 400 });
      }
      const body = await request.text();
      await BLOCKY.put(id, body);
      return new Response('Stored', { status: 201 });
    }
    
      // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400', // 24 hours
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  }
  