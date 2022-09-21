const path = require('path');
const {format} = require("util");
const stream = require('stream');
const {Storage} = require('@google-cloud/storage');
const FileResponse = require("../helpers/responses/file.response");
const config = require("../../middlewares/helpers/enums/config.enum");
const serviceKey = path.join(__dirname, '../../config/google-cloud-key.json');
const storage = new Storage({keyFilename: serviceKey, projectId: 'job-hunt-363209'});
const bucket = storage.bucket('redeemed');
const signatures = {
  JVBERi0: "application/pdf",
  R0lGODdh: "image/gif",
  R0lGODlh: "image/gif",
  iVBORw0KGgo: "image/png",
  "/9j/": "image/jpg"
};


const UploadService = {
	detectMimeType: base64 => {
		for (const signature in signatures) {
			if (base64.indexOf(signature) === 0) {
				return signatures[signature];
			}
		}
	},
	
	fetchFileSignedUrl: async (fileName) => {
		const options = {
			version: 'v4',
			action: 'read',
			expires: Date.now() + 60 * 60 * 1000,
		};
		const [url] = await bucket.file(fileName).getSignedUrl(options);
		return url;
	},
	
	uploadImage: file => {
		const {originalname, buffer} = file;
		const blob = bucket.file(originalname.replace(/ /g, "_"));
		const blobStream = blob.createWriteStream({resumable: false});
		
		blobStream.on('finish', () => {
			const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
			const response = FileResponse.uploadFileSuccess(publicUrl);
			resolve(response);
		}).on('error', () => {
			const errResponse = FileResponse.uploadFileError();
			resolve(errResponse);
		}).end(buffer);
	},
	
	uploadBase64String: (document, name, type) => new Promise(resolve => {
		const {base64File, fileName} = document;
		const mimeType = UploadService.detectMimeType(base64File);
		const bufferStream = new stream.PassThrough();
		bufferStream.end(Buffer.from(base64File, 'base64'));
		
		const cloudDirectory = type === config.FILE_DOCUMENT ? "documents" : type === config.FILE_IMAGE ? "profile" : null;
		const fileCloudName = `${name}__${fileName}`;
		const file = bucket.file(`${cloudDirectory}/${fileCloudName}`);
		bufferStream.pipe(file.createWriteStream({metadata: {contentType: mimeType, metadata: {custom: 'metadata'}}}
		)).on('error', () => {
			const errResponse = FileResponse.uploadFileError();
			resolve(errResponse);
		}).on('finish', () => {
			const publicUrl = format(`${cloudDirectory}/${fileCloudName}`);
			const response = FileResponse.uploadFileSuccess(publicUrl);
			resolve(response);
		})
	}),
}

module.exports = UploadService;
