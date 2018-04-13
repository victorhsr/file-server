'use strict'
const fileManager = require('./fileManager.js');
const videoExt = require('./ext/videoExt.js');
const fs = require('fs');
const urlencode = require('urlencode');

const provide = ( path, req, res ) => {
  const fileExt = fileManager.getFileExtension( path );

  if ( videoExt.exts.includes( fileExt ) ) {
    sendVideo( urlencode.decode( path ), fileExt, req, res );
    console.log('Acessed video:', path);
    return true;
  }

  return false;
}

const sendVideo = ( videoPath, fileExt, req, res ) => {

	var videoProps = fs.lstatSync( videoPath );

	if( req.headers[ 'range' ] ){
		var range = req.headers.range;
		range = range.replace( 'bytes=','' ).split( '-' );

		var partialStart = parseInt( range[ 0 ], 10 );
		var partialEnd = parseInt( range[ 1 ], 10 );
		partialEnd = partialEnd ? partialEnd : videoProps.size -1;

		var chunkSize = ( partialEnd - partialStart ) + 1;

		var videoStream = fs.createReadStream( videoPath, { start: partialStart, end: partialEnd } );

		res.writeHead(206, {'Content-Type' : `video/${fileExt}`,
			'Content-Length' : chunkSize,
			'Content-Range' : 'bytes ' + partialStart + '-'
			+ partialEnd + '/' + videoProps.size,
			'Accept-Ranges' : 'bytes'});

		videoStream.pipe( res );
	}else{
		res.writeHead( 200, { 'Content-Type' : `video/${fileExt}`, 'Content-Length' : videoProps.size } );
		fs.createReadStream( videoPath ).pipe( res );
	}
}

module.exports = provide;
