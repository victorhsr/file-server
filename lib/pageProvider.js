'use strict'
const fileManager = require('./fileManager.js');
const icons = require('./icon/icons.js');
const imageExt = require('./ext/imageExt.js');
const videoExt = require('./ext/videoExt.js');
const urlencode = require('urlencode');
const bootstrapgrid = require('./bootstrapgrid.js');

const pageIntro = `<!DOCTYPE html> <html> <head> <meta charset='utf-8'> <title></title><style>${bootstrapgrid.bootstrapgrid}</style></head>  <body style='background:#000;'> <div class='container-fluid'><div class='row'>`
const pageEnd = '</div></div></body> </html>';

const provide = ( path, req, res ) => {
    if ( fileManager.isDirectory( path ) ) {
      path = urlencode.decode(path);
      res.writeHead( 200, { 'content-type' : 'text/html' } );
      res.write( buildView( path, req ) );
      res.end();
      return true;
    }

  return false;
}

const buildView = ( path, req ) => {

  const files = fileManager.getFilesPath( path );
  const pathsData = [];
  files.map( file => {
    const pathData = buildResourceData( urlencode.decode(path), file, req );
    pathsData.push( pathData );
  });

  const foldersContent = buildFoldersContent( pathsData, req );
  const filesContent = buildFilesContent( pathsData );
  const htmlPage = pageIntro + foldersContent + filesContent + pageEnd;

  return htmlPage;
}

const buildFilesContent = ( pathsData ) => {

  const content = [];

  pathsData.map( pathData => {
    if( pathData.isFile ){
      if ( imageExt.exts.includes( pathData.ext )) {
        const file = buildDOMFile( pathData.url, pathData.name, pathData.size );
        content.push( file );

      }else if ( videoExt.exts.includes( pathData.ext ) ) {
        const file = buildDOMFile( pathData.url, pathData.name, pathData.size, icons.video );
        content.push( file );

      }else if ( pathData.ext === 'pdf' ) {
        const file = buildDOMFile( pathData.url, pathData.name, pathData.size, icons.pdf );
        content.push( file );

      }else{
        const fileIcon = `${icons.documentStart}.${pathData.ext}${icons.documentEnd}`;
        const file = buildDOMFile( pathData.url, pathData.name, pathData.size, fileIcon, true );
        content.push( file );

      }
    }
  });

  return content.reduce( ( partial, total ) => { return total += partial }, '' );
}

const buildDOMFile = ( href, name, size, icon, downloadable ) => {
  return `<div class='col-md-4 col-sm-6'>
            <a href='${href}' ${ downloadable ? `download=${urlencode.encode( name )}` : ''} style='background:#000; height:400px; margin:3px 3px 0px 3px; padding:5px; display:flex; align-items: center; justify-content: center;'>
                ${ icon ? icon : `<img src=${href} style='max-width:100%; max-height:100%;'/>`}
            </a>
            <div style='background:#000;margin:0px 3px 3px 3px;color:#fff; text-align:center'>
              <p style='margin:0px'>${name} <br/>${size}</p>
            </div>
          </div>`
}

const buildFoldersContent = ( pathsData, req ) => {
  const content = [];
  const urlParts = req.url.split('/');

  let backUrl = `http://${req.headers.host}`;
  for ( let i = 1; i < urlParts.length-1; i++ ) {
    backUrl += '/' + urlParts[ i ] ;
  }

  if( urlParts[ urlParts.length-1 ] ){
    const backFolder = buildDOMFolder( backUrl, '/..' );
    content.push( backFolder );
  }

  pathsData.map( pathData => {
    if( !pathData.isFile ){
      const domFolder = buildDOMFolder( pathData.url, pathData.name );
      content.push( domFolder );
    }
  });

  return content.reduce( ( partial, total ) => { return total += partial }, '' );
}

const buildDOMFolder = ( href, name ) => {
  return `<div class='col-md-2'>
            <a href='${href}' style=' background:#000; height:400px; margin:3px 3px 0px 3px; padding:5px; display:flex; align-items: center; justify-content: center;'>
                ${icons.folder}
            </a>
            <div style='background:#000;margin:0px 3px 3px 3px;color:#fff; text-align:center'>
              <p style='margin:0px'>${name}</p>
            </div>
          </div>`
}

const buildResourceData = ( basePath, fileName, request ) => {
  const fileFullPath = basePath + '/' + fileName;

  const fileExt = fileManager.getFileExtension( fileFullPath );
  const fileSize = fileManager.getFileSize( fileFullPath );
  const isFile = fileManager.isFile( fileFullPath );

  const urlParts = request.url.split('/');
  const baseUrl = 'http://' + request.headers.host + request.url;
  const url = baseUrl + ( baseUrl.slice( -1 ) === '/' ? '' : '/') + urlencode.encode( fileName );

  return {
    ext : fileExt,
    name : fileName,
    isFile : isFile,
    size : fileSize,
    url : url
  }
}

module.exports = provide;
