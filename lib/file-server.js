'use strict'
const http = require('http');
const requestHandler = require('./requestHandler.js');

const fileServer = ( path, params ) => {
  http.createServer( function ( req, res ) {
    if( req.url === '/favicon.ico' ){
      res.end();

    }else{
      const resourcePath = path + req.url;
      requestHandler( resourcePath, req, res );
    }

  }).listen( params.port, () => {
    console.log(`file-server on localhost:${params.port} looking the path '${path}'`);
  });
}

module.exports = fileServer;
