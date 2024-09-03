import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path )

    // res.status(403).json({
    //   ok: false,
    //   path: path
    // })
    //return res;
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', { 
    // reference, no execute
    fileFilter: fileFilter,
    //limits: { fileSize: 1000 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
    }) )
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ){
    if ( !file ) {
      throw new BadRequestException('Make sure file is an image')
    }

    const secureUrl = `${ file.filename }`
    //console.log({ fileInController: file })    
    return { 
      //fileName: file.originalname 
      secureUrl
    };
  }  
}