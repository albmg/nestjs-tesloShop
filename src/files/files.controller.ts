import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', { 
    // reference, no execute
    fileFilter: fileFilter
    }) )
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ){
    if ( !file ) {
      throw new BadRequestException('Make sure file is an image')
    }
    console.log({ fileInController: file })    
    return { 
      fileName: file.originalname 
    };
  }  
}