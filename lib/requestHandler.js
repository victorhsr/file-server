'use strict'
const fileProvider = require('./fileProvider');
const pageProvider = require('./pageProvider.js');
const videoProvider = require('./videoProvider.js');

const strategyPipeline = ( path, req, res ) => {

  const fileHandler = new FileHandler();
  const pageHandler = new PageHandler();
  const videoHandler = new VideoHandler();

  pageHandler.setNext( videoHandler ).setNext( fileHandler );

  try{
    pageHandler.handleRequest( path, req, res );
  }catch( err ){
    if ( err.code === 'ENOENT' ){
      res.writeHead(404, { 'content-type' : 'text/plain' } );
      res.write('404 - Not found');
      res.end();
    }else{
      console.log('Unexpected error, please restart the service and try again, if this error persists open a Issue in the GitHub');
      console.log('Error: ', err );
    }
  }
}


function RequestHandler() {
  this.next = {
    handleRequest: function( path, req, res ){
      res.end();
      console.log('No strategie for this request', req.url);
    }
  }
}

RequestHandler.prototype.setNext = function( nextHandler ){
  this.next = nextHandler;
  return nextHandler;
}

const FileHandler = function(){};
FileHandler.prototype = new RequestHandler();
FileHandler.prototype.handleRequest = function( path, req, res ){
  fileProvider( path, req, res );
}

const PageHandler = function(){};
PageHandler.prototype = new RequestHandler();
PageHandler.prototype.handleRequest = function( path, req, res ){
  if( !pageProvider( path, req, res ) )
    this.next.handleRequest( path, req, res );
}

const VideoHandler = function(){};
VideoHandler.prototype = new RequestHandler();
VideoHandler.prototype.handleRequest = function( path, req, res ){
  if( !videoProvider( path, req, res ) )
    this.next.handleRequest( path, req, res );
}

module.exports = strategyPipeline;
