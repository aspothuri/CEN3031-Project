import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  DeleteApiResponse,
  ResourceType,
  UploadApiErrorResponse,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadMedia(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload failed'));
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteMedia(
    link: string,
    resourceType: ResourceType,
  ): Promise<{ result: string }> {
    try {
      const publicId = link.split('upload/')[1].split('.')[0];
      const result = await v2.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return result;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Cloudinary Delete Failed: ${err}`,
      );
    }
  }
}
