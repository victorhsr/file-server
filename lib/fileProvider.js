'use strict'
const fileManager = require('./fileManager.js');

const provide = ( path, req, res ) => {
  // console.log('-fileProvider-',path);
  const fileContent = fileManager.readFile( path );
  res.write( fileContent );
  res.end();
}

module.exports = provide;
