import mv from 'mv';

export const moveFile = (srcFilePath: string, destFilePath: string) => {
	return new Promise<void>((resolve, reject) => {
		mv(srcFilePath, destFilePath, function (err: Error) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};
