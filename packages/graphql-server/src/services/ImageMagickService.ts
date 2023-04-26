import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';

// magick source.jpg -strip -interlace Plane -gaussian-blur 0.05 -quality 85% result.jpg

interface Action {
  readonly command: string;
  readonly parameters: (string | number)[];
}

interface ImageMagickServiceOptions {
  /**
   * ImageMagick bin location\
   * Default: `magick`
   */
  bin?: string;
}

type Colorspace =
  | 'CMY'
  | 'HCLp'
  | 'HSV'
  | 'LCHab'
  | 'Luv'
  | 'RGB'
  | 'xyY'
  | 'YDbDr'
  | 'Undefined'
  | 'HCL'
  | 'HSL'
  | 'Lab'
  | 'Log'
  | 'Rec709YCbCr'
  | 'Transparent'
  | 'YCC'
  | 'YUV'
  | 'Gray'
  | 'HSI'
  | 'Jzazbz'
  | 'LMS'
  | 'Rec601YCbCr'
  | 'sRGB'
  | 'YCbCr'
  | 'YPbPr'
  | 'CMYK'
  | 'HSB'
  | 'HWB'
  | 'LCHuv'
  | 'OHTA'
  | 'scRGB'
  | 'XYZ'
  | 'YIQ';

type Gravity =
  | 'None'
  | 'Center'
  | 'East'
  | 'Forget'
  | 'NorthEast'
  | 'North'
  | 'NorthWest'
  | 'SouthEast'
  | 'South'
  | 'SouthWest'
  | 'West';

type ImageFormat = 'png' | 'jpeg' | 'webp';

interface JPEGOutOptions {
  readonly quality: number;
  readonly strip: boolean;
  readonly interlace: 'none' | 'line' | 'plane' | 'partition' | 'JPEG' | 'GIF' | 'PNG';
}
interface PNGOutOptions {
  readonly quality: number;
  readonly strip: boolean;
}
interface WEBPOutOptions {
  readonly quality: number;
  readonly strip: boolean;
}

interface OutFormatOptions {
  readonly jpeg: JPEGOutOptions;
  readonly png: PNGOutOptions;
  readonly webp: WEBPOutOptions;
}
/**
 * Uage: const magick = new ImageMagickService('sourcefile.jpeg')\
 *                     .resize(200)\
 *                     .toBuffer()\
 *                     .then(buffer => fs.writeFileSync('out.jpeg', buffer));\
 *
 * Uage: const magick = new ImageMagickService()\
 *                     .format('jpeg')\
 *                     .resize(200)\
 *                     .toBuffer()\
 *                     .then(buffer => fs.writeFileSync('out.jpeg', buffer));\
 */
class ImageMagickService {
  #sourceFilename: string;
  #outputFilename: string;
  #bin = 'magick';
  #outFormat: ImageFormat = null;
  #pool: Action[] = [];
  #supportedFormats: ImageFormat[] = ['png', 'jpeg', 'webp'];
  #outFormatOptions: OutFormatOptions = {
    jpeg: {
      quality: 70,
      strip: true,
      interlace: 'plane',
    },
    png: {
      quality: 80,
      strip: true,
    },
    webp: {
      quality: 70,
      strip: true,
    },
  };

  public constructor(a?: string | ImageMagickServiceOptions, b?: ImageMagickServiceOptions) {
    const options = typeof a === 'object' ? a : typeof b === 'object' ? b : {};
    const sourcefilename = typeof a === 'string' ? a : null;

    if (typeof options?.bin === 'string') {
      this.#bin = options.bin;
    }

    if (sourcefilename) {
      this.source(sourcefilename);
    }

    return this;
  }

  public source(sourceFilename: string): this {
    this.#sourceFilename = sourceFilename;
    this.#outputFilename = ImageMagickService.getTmpFilename();

    if (!fs.existsSync(this.#sourceFilename)) {
      throw new Error(`Source file «${this.#sourceFilename}» does not exist`);
    }

    return this;
  }

  public static getTmpFilename() {
    const filename = path.resolve(
      fs.realpathSync(os.tmpdir()),
      'imagemagick-node',
      `${crypto.randomBytes(16).toString('hex')}.tmp`,
    );

    if (!fs.existsSync(path.dirname(filename))) {
      fs.mkdirSync(path.dirname(filename), { recursive: true });
    }

    return filename;
  }

  /**
   * Grayscale image.
   */
  public autoOrient(): this {
    this.pushAction({
      command: '-auto-orient',
      parameters: [],
    });

    return this;
  }

  /**
   * Grayscale image.
   */
  public grayscale(): this {
    this.pushAction({
      command: '-colorspace',
      parameters: ['Gray'],
    });

    return this;
  }

  /**
   * Strip metadata.
   */
  public strip(): this {
    this.pushAction({
      command: '-strip',
      parameters: [],
    });

    return this;
  }
  public colorspace(value: Colorspace): this {
    this.pushAction({
      command: '-colorspace',
      parameters: [value],
    });

    return this;
  }
  public colors(value: number): this {
    this.pushAction({
      command: '-colors',
      parameters: [value],
    });

    return this;
  }

  public contain(w: number, h: number, position?: Gravity): this {
    if (w > 10000000 || w < -10000000) {
      throw new Error('The w - a value between -10000000 and 10000000');
    }
    if (h > 10000000 || h < -10000000) {
      throw new Error('The h - a value between -10000000 and 10000000');
    }

    this.pushAction({
      command: '-resize',
      parameters: [`${w}x${h}`],
    });

    this.pushAction({
      command: '-gravity',
      parameters: [position || 'Center'],
    });

    this.pushAction({
      command: '-extent',
      parameters: [`${w}x${h}`],
    });

    return this;
  }

  public cover(w: number, h: number, position?: Gravity): this {
    if (w > 10000000 || w < -10000000) {
      throw new Error('The w - a value between -10000000 and 10000000');
    }
    if (h > 10000000 || h < -10000000) {
      throw new Error('The h - a value between -10000000 and 10000000');
    }

    this.pushAction({
      command: '-resize',
      parameters: [`${w}x${h}^`],
    });

    this.pushAction({
      command: '-gravity',
      parameters: [position || 'Center'],
    });

    this.pushAction({
      command: '-extent',
      parameters: [`${w}x${h}`],
    });

    return this;
  }

  /**
   * Gaussian blur.
   * Use **sigma** of `-1.0` for fast blur.\
   * **sigma** - a value between `0.3` and `1000` representing the
   * sigma of the Gaussian mask, where `sigma = 1 + radius / 2`
   */
  public gaussianBlur(radius: number, sigma: number): this {
    if (sigma < 0.3 || sigma > 1000) {
      throw new Error('The sigma - a value between 0.3 and 1000');
    }

    this.pushAction({
      command: '-gaussian-blur',
      parameters: [`${radius}x${sigma}`],
    });

    return this;
  }

  /**
   * blur
   */
  public blur(radius: number, sigma: number): this {
    if (sigma < 0.3 || sigma > 1000) {
      throw new Error('The sigma - a value between 0.3 and 1000');
    }

    this.pushAction({
      command: '-blur',
      parameters: [`${radius}x${sigma}`],
    });

    return this;
  }

  /**
   * Image crop\
   * **x, y, w and h** - a values between `-10000000` and `10000000`
   */
  public async crop(x: number, y: number, w: number, h: number): Promise<this> {
    if (x > 10000000 || x < -10000000) {
      throw new Error('The x - a value between -10000000 and 10000000');
    }
    if (y > 10000000 || y < -10000000) {
      throw new Error('The y - a value between -10000000 and 10000000');
    }
    if (w > 10000000 || w < -10000000) {
      throw new Error('The w - a value between -10000000 and 10000000');
    }
    if (h > 10000000 || h < -10000000) {
      throw new Error('The h - a value between -10000000 and 10000000');
    }

    this.pushAction({
      command: '-crop',
      parameters: [`${w}x${h}+${x}+${y}`],
    });

    return this;
  }

  // private gcd(a: number, b: number | null): number {
  //   return b === 0 ? a : this.gcd(b, a % b);
  // }

  public resize(w?: number | null, h?: number | null): this {
    if (typeof w === 'number' && (w > 10000000 || w < -10000000)) {
      throw new Error('The w - a value between -10000000 and 10000000');
    }

    if (typeof h === 'number' && (h > 10000000 || h < -10000000)) {
      throw new Error('The h - a value between -10000000 and 10000000');
    }

    if (typeof w !== 'number' && typeof h !== 'number') {
      throw new Error('You should provide width and/or height for this operation');
    }

    let size = '';

    switch (true) {
      case typeof w === 'number' && typeof h === 'number':
        size = `${w}x${h}!`;
        break;
      case typeof w === 'number' && typeof h !== 'number':
        size = `${w}`;
        break;
      case typeof w !== 'number' && typeof h === 'number':
        size = `x${h}`;
        break;
      default:
        break;
    }

    this.pushAction({
      command: '-resize',
      parameters: [size],
    });

    return this;
  }

  public format(
    format: ImageFormat,
    outFormatOptions?: Partial<JPEGOutOptions | PNGOutOptions | WEBPOutOptions>,
  ): this {
    if (!this.isValidImageFormat(format)) {
      throw new Error('The image format can be one of: jpeg; png; webp');
    }
    this.#outFormat = format;

    if (typeof outFormatOptions === 'object') {
      const modifiedOptions = {
        ...this.#outFormatOptions[format],
        ...outFormatOptions,
      };

      this.#outFormatOptions = {
        ...this.#outFormatOptions,
        [format]: {
          ...modifiedOptions,
        },
      };
    }

    // validate options
    const { jpeg, png, webp } = this.#outFormatOptions;

    // jpeg options
    if (jpeg.quality > 100 || jpeg.quality < 0) {
      throw new Error('The quality - a value between 0 and 100');
    }

    // png options
    if (png.quality > 100 || png.quality < 0) {
      throw new Error('The quality - a value between 0 and 100');
    }

    // webp options
    if (webp.quality > 100 || webp.quality < 0) {
      throw new Error('The quality - a value between 0 and 100');
    }

    this.#outputFilename = `${this.#outputFilename}.${format}`;

    return this;
  }

  public async toBuffer(): Promise<Buffer> {
    await this.execActions();

    const buffer = fs.readFileSync(this.#outputFilename);
    fs.rmSync(this.#outputFilename);

    return buffer;
  }

  private isValidImageFormat(format: ImageFormat | string) {
    return this.#supportedFormats.includes(format as ImageFormat);
  }

  public async getImageInfo(): Promise<{ width: number; height: number; format: ImageFormat }> {
    return new Promise((resolve, reject) => {
      const errorsBuffer: Buffer[] = [];
      const dataBuffer: Buffer[] = [];
      const proc = spawn(this.#bin, ['identify', '-format', '%w:%h:%m', this.#sourceFilename]);

      proc.stdout.on('data', chunk => {
        dataBuffer.push(chunk);
      });

      proc.stderr.on('data', chunk => {
        errorsBuffer.push(chunk);
      });

      proc.on('error', err => {
        reject(err);
      });

      proc.on('close', code => {
        if (code !== 0) {
          reject(new Error(Buffer.concat(errorsBuffer).toString()));
        } else {
          const matches = Buffer.concat(dataBuffer)
            .toString()
            .match(/^([0-9]+):([0-9]+):([A-Z]+)$/);

          if (matches && matches.length >= 4) {
            resolve({
              width: parseInt(matches[1], 10),
              height: parseInt(matches[2], 10),
              format: matches[3].toLowerCase() as ImageFormat,
            });

            return;
          }

          reject(new Error('Failed to get image info'));
        }
      });
    });
  }

  private execActions(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const errorsBuffer: Buffer[] = [];

      const args: string[] = [this.#sourceFilename];

      this.#pool.forEach(({ command, parameters }) => {
        args.push(command);
        parameters.forEach(param => {
          args.push(String(param));
        });
      });

      if (this.#outFormat) {
        Object.entries(this.#outFormatOptions[this.#outFormat]).forEach(([key, value]) => {
          const param = this.camelToKebab(key);
          if (typeof value === 'boolean' && Boolean(value)) {
            args.push(`-${param}`);
          }

          if (typeof value !== 'boolean') {
            args.push(`-${param}`);
            args.push(`${value}`);
          }
        });
      }

      args.push(this.#outputFilename);

      const proc = spawn(this.#bin, args);
      // console.debug(`${this.#bin}  ${args.join(' ')}`);

      proc.on('error', err => {
        reject(err);
      });

      proc.stderr.on('data', chunk => {
        errorsBuffer.push(chunk);
      });

      proc.on('close', code => {
        this.#pool = [];

        if (code !== 0) {
          reject(new Error(Buffer.concat(errorsBuffer).toString()));
        } else {
          resolve();
        }
      });
    });
  }

  private pushAction(action: Action): this {
    const { command, parameters } = action;
    this.#pool.push({
      command,
      parameters: [...(parameters || [])],
    });

    return this;
  }

  private camelToKebab(str: string): string {
    return str
      .split('')
      .map((letter, idx) =>
        letter.toUpperCase() === letter ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}` : letter,
      )
      .join('');
  }
}

export default ImageMagickService;
