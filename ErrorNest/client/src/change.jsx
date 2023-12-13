// const fs = require('fs');
// const path = require('path');
// import fs from 'fs';
// import path from 'path';
const fs = require('fs');
const path = require('path');

const directoryPath = '../src/report'; // 변경하려는 파일들이 포함된 디렉토리 경로

function changeFileExtension(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('디렉토리를 읽는 중 오류가 발생했습니다:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('파일 상태를 가져오는 중 오류가 발생했습니다:', err);
                    return;
                }

                if (stats.isFile() && path.extname(filePath) === '.js') {
                    const newFilePath = path.join(directoryPath, `${path.basename(file, '.js')}.jsx`);

                    fs.rename(filePath, newFilePath, (err) => {
                        if (err) {
                            console.error('파일 이름을 변경하는 중 오류가 발생했습니다:', err);
                            return;
                        }

                        console.log(`${file} 파일의 확장자가 변경되었습니다.`);
                    });
                }
            });
        });
    });
}

changeFileExtension(directoryPath);
