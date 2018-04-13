#!/usr/bin/env node

'use strict';
const fileServer = require('../lib/file-server.js');

const params = {
  port : 8080
}

fileServer( process.cwd(), params );
