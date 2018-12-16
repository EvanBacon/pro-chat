//
//  EXImageManipulator.m
//  Exponent
//
//  Created by Alicja Warchał on 30.11.2017.
//  Copyright © 2017 650 Industries. All rights reserved.
//

#import "EXImageManipulator.h"
#import "EXFileSystem.h"
#import "EXImageUtils.h"
#import <React/RCTLog.h>
#import <Photos/Photos.h>
#import "EXModuleRegistryBinding.h"
#import <EXFileSystemInterface/EXFileSystemInterface.h>

@implementation EXImageManipulator

RCT_EXPORT_MODULE(ExponentImageManipulator);

@synthesize bridge = _bridge;

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(manipulate:(NSString *)uri
                  actions:(NSArray *)actions
                  saveOptions:(NSDictionary *)saveOptions
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSURL *url = [NSURL URLWithString:uri];
  NSString *path = [url.path stringByStandardizingPath];
  id<EXFileSystemInterface> fileSystem = [self.bridge.scopedModules.moduleRegistry getModuleImplementingProtocol:@protocol(EXFileSystemInterface)];
  if (!fileSystem) {
    reject(@"E_MISSING_MODULE", @"No FileSystem module.", nil);
    return;
  }
  if (!([fileSystem permissionsForURI:url] & EXFileSystemPermissionRead)) {
    reject(@"E_FILESYSTEM_PERMISSIONS", [NSString stringWithFormat:@"File '%@' isn't readable.", uri], nil);
    return;
  }

  if ([[url scheme] isEqualToString:@"assets-library"]) {
    PHFetchResult<PHAsset *> *fetchResult = [PHAsset fetchAssetsWithALAssetURLs:@[url] options:nil];
    if (fetchResult.count > 0) {
      PHAsset *asset = fetchResult[0];
      CGSize size = CGSizeMake([asset pixelWidth], [asset pixelHeight]);
      PHImageRequestOptions *options = [PHImageRequestOptions new];
      [options setResizeMode:PHImageRequestOptionsResizeModeExact];
      [options setNetworkAccessAllowed:YES];
      [options setSynchronous:NO];
      [options setDeliveryMode:PHImageRequestOptionsDeliveryModeHighQualityFormat];

      [[PHImageManager defaultManager] requestImageForAsset:asset targetSize:size contentMode:PHImageContentModeAspectFit options:options resultHandler:^(UIImage * _Nullable image, NSDictionary * _Nullable info) {
        if (!image) {
          reject(@"E_IMAGE_MANIPULATION_FAILED", [NSString stringWithFormat:@"The file isn't convertable to image. Given path: `%@`.", path], nil);
          return;
        }
        image = [self fixOrientation:image];
        [self manipulateImage:image actions:actions saveOptions:saveOptions resolver:resolve rejecter:reject];
      }];
      return;
    } else {
      reject(@"E_IMAGE_MANIPULATION_FAILED", [NSString stringWithFormat:@"The file does not exist. Given path: `%@`.", path], nil);
      return;
    }
  } else {
    if (![[NSFileManager defaultManager] fileExistsAtPath:path]) {
      reject(@"E_IMAGE_MANIPULATION_FAILED", [NSString stringWithFormat:@"The file does not exist. Given path: `%@`.", path], nil);
      return;
    }

    UIImage *image = [[UIImage alloc] initWithContentsOfFile:path];
    if (image == nil) {
      reject(@"E_CANNOT_OPEN", @"Could not open provided image", nil);
      return;
    }

    image = [self fixOrientation:image];
    [self manipulateImage:image actions:actions saveOptions:saveOptions resolver:resolve rejecter:reject];
    return;
  }
}

-(UIImage *)fixOrientation:(UIImage *)image
{
  if (image.imageOrientation == UIImageOrientationUp) {
    return image;
  }
  
  CGAffineTransform transform = CGAffineTransformIdentity;
  switch (image.imageOrientation) {
    case UIImageOrientationDown:
    case UIImageOrientationDownMirrored:
      transform = CGAffineTransformTranslate(transform, image.size.width, image.size.height);
      transform = CGAffineTransformRotate(transform, M_PI);
      break;
      
    case UIImageOrientationLeft:
    case UIImageOrientationLeftMirrored:
      transform = CGAffineTransformTranslate(transform, image.size.width, 0);
      transform = CGAffineTransformRotate(transform, M_PI_2);
      break;
      
    case UIImageOrientationRight:
    case UIImageOrientationRightMirrored:
      transform = CGAffineTransformTranslate(transform, 0, image.size.height);
      transform = CGAffineTransformRotate(transform, -M_PI_2);
      break;
    
    default:
      break;
  }
  
  switch (image.imageOrientation) {
    case UIImageOrientationUpMirrored:
    case UIImageOrientationDownMirrored:
      transform = CGAffineTransformTranslate(transform, image.size.width, 0);
      transform = CGAffineTransformScale(transform, -1, 1);
      break;
      
    case UIImageOrientationLeftMirrored:
    case UIImageOrientationRightMirrored:
      transform = CGAffineTransformTranslate(transform, image.size.height, 0);
      transform = CGAffineTransformScale(transform, -1, 1);
      break;
   
    default:
      break;
  }
  
  CGContextRef ctx = CGBitmapContextCreate(NULL, image.size.width, image.size.height, CGImageGetBitsPerComponent(image.CGImage), 0, CGImageGetColorSpace(image.CGImage), CGImageGetBitmapInfo(image.CGImage));
  CGContextConcatCTM(ctx, transform);
  switch (image.imageOrientation) {
    case UIImageOrientationLeft:
    case UIImageOrientationLeftMirrored:
    case UIImageOrientationRight:
    case UIImageOrientationRightMirrored:
      CGContextDrawImage(ctx, CGRectMake(0, 0, image.size.height, image.size.width), image.CGImage);
      break;
      
    default:
      CGContextDrawImage(ctx, CGRectMake(0, 0, image.size.width, image.size.height), image.CGImage);
      break;
  }
  
  CGImageRef cgimg = CGBitmapContextCreateImage(ctx);
  UIImage *img = [UIImage imageWithCGImage:cgimg];
  CGContextRelease(ctx);
  CGImageRelease(cgimg);
  return img;
}

-(void)manipulateImage:(UIImage *)image
               actions:(NSArray *)actions
           saveOptions:(NSDictionary *)saveOptions
              resolver:(RCTPromiseResolveBlock)resolve
              rejecter:(RCTPromiseRejectBlock)reject
{
  for (NSDictionary *options in actions) {
    if (options[@"resize"]) {
      float imageWidth = image.size.width;
      float imageHeight = image.size.height;
      float imageRatio = imageWidth / imageHeight;
      
      NSInteger requestedWidth = 0;
      NSInteger requestedHeight = 0;
      NSDictionary *resize = options[@"resize"];
      if (resize[@"width"]) {
        requestedWidth = [(NSNumber *)resize[@"width"] integerValue];
        requestedHeight = requestedWidth/imageRatio;
      }
      if (resize[@"height"]) {
        requestedHeight = [(NSNumber *)resize[@"height"] integerValue];
        requestedWidth = requestedWidth == 0 ? imageRatio * requestedHeight : requestedWidth;
      }
      
      CGSize requestedSize = CGSizeMake(requestedWidth, requestedHeight);
      UIGraphicsBeginImageContextWithOptions(requestedSize, NO, 1.0);
        [image drawInRect:CGRectMake(0, 0, requestedWidth, requestedHeight)];
        image = UIGraphicsGetImageFromCurrentImageContext();
      UIGraphicsEndImageContext();
    } else if (options[@"rotate"]) {
      float rads = [(NSNumber *)options[@"rotate"] integerValue] * M_PI/180;
      CGSize size = image.size;
      UIView *rotatedViewBox = [[UIView alloc] initWithFrame:CGRectMake(0,0,size.width, size.height)];
      CGAffineTransform t = CGAffineTransformMakeRotation(rads);
      rotatedViewBox.transform = t;
      CGSize rotatedSize = rotatedViewBox.frame.size;
      
      UIGraphicsBeginImageContext(rotatedSize);
        CGContextRef bitmap = UIGraphicsGetCurrentContext();
        CGContextTranslateCTM(bitmap, rotatedSize.width/2, rotatedSize.height/2);
        CGContextRotateCTM(bitmap, rads);
        CGContextScaleCTM(bitmap, 1.0, -1.0);
        CGContextDrawImage(bitmap, CGRectMake(-size.width / 2, -size.height / 2, size.width, size.height), image.CGImage);

        image = UIGraphicsGetImageFromCurrentImageContext();
      UIGraphicsEndImageContext();
    } else if (options[@"flip"]) {
      NSDictionary *flip = options[@"flip"];
      UIImageView *tempImageView = [[UIImageView alloc] initWithImage:image];
      
      UIGraphicsBeginImageContext(tempImageView.frame.size);
        CGContextRef context = UIGraphicsGetCurrentContext();
        CGAffineTransform transform;
        if (flip[@"vertical"]) {
          transform = CGAffineTransformMake(1, 0, 0, -1, 0, tempImageView.frame.size.height);
          CGContextConcatCTM(context, transform);
        } else if (flip[@"horizontal"]) {
          transform = CGAffineTransformMake(-1, 0, 0, 1, tempImageView.frame.size.width, 0);
          CGContextConcatCTM(context, transform);
        }
      
        [tempImageView.layer renderInContext:context];
        image = UIGraphicsGetImageFromCurrentImageContext();
      UIGraphicsEndImageContext();
    } else if (options[@"crop"]) {
      NSDictionary *cropData = options[@"crop"];
      if (cropData[@"originX"] == nil || cropData[@"originY"] == nil || cropData[@"width"] == nil || cropData[@"height"]== nil) {
        reject(@"E_INVALID_CROP_DATA", @"Invalid crop options has been passed. Please make sure the object contains originX, originY, width and height.", nil);
        return;
      }

      float originX = [(NSNumber *)cropData[@"originX"] floatValue];
      float originY = [(NSNumber *)cropData[@"originY"] floatValue];
      float requestedWidth = [(NSNumber *)cropData[@"width"] floatValue];
      float requestedHeight = [(NSNumber *)cropData[@"height"] floatValue];

      if (originX > image.size.width || originY > image.size.height || requestedWidth > image.size.width || requestedHeight > image.size.height) {
        reject(@"E_INVALID_CROP_DATA", @"Invalid crop options has been passed. Please make sure the requested crop rectangle is inside source image.", nil);
        return;
      }
      CGRect cropDimensions = CGRectMake(originX, originY, requestedWidth, requestedHeight);
      image = [EXImageUtils cropImage:image toRect:cropDimensions];
    }
  }

  float compressionValue = 1.0;
  if (saveOptions[@"compress"] != nil) {
    compressionValue = [(NSNumber *)saveOptions[@"compress"] floatValue];
  }

  NSData *imageData = nil;
  NSString *format = saveOptions[@"format"];
  NSString *extension;
  if (format == nil) {
    format = @"jpeg";
  }
  if ([format isEqualToString:@"jpeg"]) {
    imageData = UIImageJPEGRepresentation(image, compressionValue);
    extension = @".jpg";
  } else if ([format isEqualToString:@"png"]) {
    imageData = UIImagePNGRepresentation(image);
    extension = @".png";
  } else {
    RCTLogWarn(@"Unsupported format: %@, using JPEG instead.", format);
    imageData = UIImageJPEGRepresentation(image, compressionValue);
    extension = @".jpg";
  }

  id<EXFileSystemInterface> fileSystem = [self.bridge.scopedModules.moduleRegistry getModuleImplementingProtocol:@protocol(EXFileSystemInterface)];
  NSString *directory = [fileSystem.cachesDirectory stringByAppendingPathComponent:@"ImageManipulator"];
  [fileSystem ensureDirExistsWithPath:directory];
  NSString *fileName = [[[NSUUID UUID] UUIDString] stringByAppendingString:extension];
  NSString *newPath = [directory stringByAppendingPathComponent:fileName];
  [imageData writeToFile:newPath atomically:YES];
  NSURL *fileURL = [NSURL fileURLWithPath:newPath];
  NSString *filePath = [fileURL absoluteString];
  NSMutableDictionary *response = [[NSMutableDictionary alloc] init];
  response[@"uri"] = filePath;
  response[@"width"] = @(CGImageGetWidth(image.CGImage));
  response[@"height"] = @(CGImageGetHeight(image.CGImage));
  if (saveOptions[@"base64"] && [saveOptions[@"base64"] boolValue]) {
    response[@"base64"] = [imageData base64EncodedStringWithOptions:0];
  }
  resolve(response);
}

@end
