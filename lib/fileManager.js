'use strict'
const fs = require('fs');
const path = require('path');
const urlencode = require('urlencode');

const getFileExtension = ( file ) => { return path.extname( file ).replace('.',''); }
const getFilesPath = ( rootPath ) => { return fs.readdirSync( rootPath )};
const getFileSize = ( path ) => {
  const fileStats =  fs.statSync( path );

  return formatSize( fileStats.size );
};

const isDirectory = ( path ) => {
  path = urlencode.decode( path );
  const fileStats =  fs.statSync( path );

  return fileStats.isDirectory();
}

const isFile = ( path ) => {
  const fileStats =  fs.statSync( path );

  return fileStats.isFile();
}

const formatSize = ( size ) => {
  if( size <= 0 ) return '0 bytes';

  const units = [ 'B', 'kB', 'MB', 'GB', 'TB' ];
  const digitGroups = Math.trunc( Math.log10( size ) / Math.log10( 1024 ) );
  const formattedSize = ( size / Math.pow( 1024, digitGroups ).toFixed( 2 ) ).toFixed( 2 ) + ' ' + units[ digitGroups ];

  return formattedSize;
}

const readFile = ( path ) => {
  path = urlencode.decode( path );
  return fs.readFileSync( path );
}

exports.isDirectory = isDirectory;
exports.isFile = isFile;
exports.getFileExtension = getFileExtension;
exports.getFilesPath = getFilesPath;
exports.getFileSize = getFileSize;
exports.readFile = readFile;
