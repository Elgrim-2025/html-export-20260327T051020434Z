import sharp from 'file:///C:/Users/panop/AppData/Local/npm-cache/_npx/d9fd33f22c0f2465/node_modules/sharp/lib/index.js'
import fs from 'fs/promises'
import path from 'path'
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONSTANTS = {thumbnailHeight: 200, luminanceHeight: 240}

const imagePath = path.join(__dirname, 'assets', 'sdf.png')
const outputFolder = path.join(__dirname, 'assets', 'image-targets')
const name = 'sdf'

const image = sharp(imagePath)
const meta = await image.metadata()

const isLandscape = meta.width >= meta.height
const cropWidth = isLandscape ? meta.width : meta.width
const cropHeight = isLandscape ? meta.height : meta.height

const crop = {
  top: 0,
  left: 0,
  width: cropWidth,
  height: cropHeight,
  isRotated: false,
  originalWidth: meta.width,
  originalHeight: meta.height,
}

const resources = {
  originalImage: `${name}_original.png`,
  croppedImage: `${name}_cropped.png`,
  thumbnailImage: `${name}_thumbnail.png`,
  luminanceImage: `${name}_luminance.png`,
}

const data = {
  imagePath: `assets/image-targets/${resources.luminanceImage}`,
  metadata: null,
  name,
  type: 'PLANAR',
  properties: crop,
  resources,
  created: Date.now(),
  updated: Date.now(),
}

await fs.mkdir(outputFolder, {recursive: true})

const croppedImage = image.clone().extract(crop)

await Promise.all([
  image.toFile(path.join(outputFolder, resources.originalImage)),
  croppedImage.clone().resize({height: CONSTANTS.thumbnailHeight}).toFile(path.join(outputFolder, resources.thumbnailImage)),
  croppedImage.clone().resize({height: CONSTANTS.luminanceHeight}).grayscale().toFile(path.join(outputFolder, resources.luminanceImage)),
  croppedImage.clone().toFile(path.join(outputFolder, resources.croppedImage)),
  fs.writeFile(path.join(outputFolder, `${name}.json`), JSON.stringify(data, null, 2) + '\n'),
])

console.log('Done! Generated files:')
console.log(' -', path.join(outputFolder, `${name}.json`))
console.log(' -', path.join(outputFolder, resources.luminanceImage))
console.log(' -', path.join(outputFolder, resources.croppedImage))
