var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();

module.exports = class UploadFtp {
     constructor(config){
     	this.config = config
	}

	  apply(compiler) {
	  	this.init();
	  	compiler.plugin('done', function (stats) {
      		this.init()
    	});
	 
	}
	init(){

	    ftpDeploy.deploy(this.config)
	    ftpDeploy.on("uploading", function(data) {
		    console.log(data.totalFilesCount); // total file count being transferred
		    console.log(data.transferredFileCount); // number of files transferred
		    console.log(data.filename); // partial path with filename being uploaded
		});
		ftpDeploy.on("uploaded", function(data) {
		    console.log(data); // same data as uploading event
		});
		ftpDeploy.on("log", function(data) {
		    console.log(data); // same data as uploading event
		});
		ftpDeploy.on("upload-error", function(data) {
		    console.log(data.err); // data will also include filename, relativePath, and other goodies
		});
	}
}