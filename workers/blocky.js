
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const url = new URL(request.url);
  
    if (request.method === 'GET') {
      const id = url.pathname.split('/').pop();
      if (id != '') {
        // Handle GET /{id}
        const body = await BLOCKY.get(id);
        return new Response(body, {
          headers: { 'Content-Type': 'application/json' },
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
    
    return new Response('Not Found', { status: 404 });
  }
  