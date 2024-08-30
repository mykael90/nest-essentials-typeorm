import { join } from 'path';
import { getFileToBuffer } from './get-file-to-buffer';

export const getPhoto = async () => {
  const { buffer, stream } = await getFileToBuffer(
    join(__dirname, 'photo-test.png'),
  );

  const photo: Express.Multer.File = {
    fieldname: 'photo',

    originalname: 'originalname.jpg',

    encoding: '7bit',

    mimetype: 'image/jpeg',

    size: 1024 * 50,

    stream,

    destination: '',

    filename: 'photo-100.png',

    path: 'file-path',

    buffer,
  };

  return photo;
};
