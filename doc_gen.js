var acquit = require('acquit');

var codeType = process.argv[2];
var filetoParse = process.argv[3]
var content = require('fs').readFileSync(filetoParse).toString();
var blocks = acquit.parse(content);


var headerRaw = String(/([\S\s]*)\n.*?require/.exec(content)[1]);

var headerComments = headerRaw.substring(headerRaw.indexOf('*') + 1, 
    headerRaw.lastIndexOf('*'));

var mdOutput = headerComments.trim();

for (var i = 0; i < blocks.length; ++i) {
  var describe = blocks[i];
  mdOutput += '*h1. ' + describe.contents + '\n\n';
  mdOutput += describe.comments[0] ?
    acquit.trimEachLine(describe.comments[0]) + '\n\n' :
    '';

  for (var j = 0; j < describe.blocks.length; ++j) {
    var it = describe.blocks[j];
    mdOutput += '**h5. It ' + it.contents + '\n\n';
    mdOutput += it.comments[0] ?
      acquit.trimEachLine(it.comments[0]) + '\n\n' :
      '';
    mdOutput += '```'+codeType+'\n';
    mdOutput += '    ' + it.code + '\n';
    mdOutput += '```\n\n';
  }
}

require('fs').writeFileSync(filetoParse + '.readme', mdOutput);
