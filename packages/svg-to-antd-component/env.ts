import path = require('path');
import { Environment } from './typings';

export function getEnv(options: {src: string, dist:string}):Environment  {
  const src= options.src
  const dist= options.dist
  return {

    paths: {
      SVG_DIR: src,
      ICON_TEMPLATE: path.resolve(__dirname, './templates/icon.ts.template'),
      INDEX_TEMPLATE: path.resolve(__dirname, './templates/index.ts.template'),
      MANIFEST_TEMPLATE: path.resolve(
          __dirname,
          './templates/manifest.ts.template'
      ),
      ICON_OUTPUT_DIR: dist,
      THEME_FILL_OUTPUT: path.resolve(dist, './fill/*.ts'),
      THEME_OUTLINE_OUTPUT: path.resolve(dist, './outline/*.ts'),
      THEME_TWO_TONE_OUTPUT: path.resolve(dist, './twotone/*.ts'),
      INDEX_OUTPUT: path.resolve(dist, './index.ts'),
      MANIFEST_OUTPUT: path.resolve(dist, './manifest.ts'),
      DIST_TEMPLATE: path.resolve(__dirname, './templates/dist.ts.template'),
      DIST_OUTPUT: path.resolve(dist, './dist.ts'),
      TYPES_TEMPLATE: path.resolve(__dirname, './templates/types.ts'),
      TYPES_OUTPUT: path.resolve(dist, './types.ts'),
      HELPERS_TEMPLATE: path.resolve(__dirname, './templates/helpers.ts'),
      HELPERS_OUTPUT: path.resolve(dist, './helpers.ts'),
      INLINE_SVG_OUTPUT_DIR: path.resolve(dist, './inline-svg/'),
      INLINE_SVG_THEME_FILL_OUTPUT: path.resolve(
          dist,
          './inline-svg/fill/*.svg'
      ),
      INLINE_SVG_THEME_OUTLINE_OUTPUT: path.resolve(
          dist,
          './inline-svg/outline/*.svg'
      ),
      INLINE_SVG_THEME_TWO_TONE_OUTPUT: path.resolve(
          dist,
          './inline-svg/twotone/*.svg'
      )
    },
    base: path.resolve(dist, '../'),
    options: {
      // SVGO Options
      // refer from @material-ui/icons
      // https://github.com/mui-org/material-ui/blob/master/packages/material-ui-icons/builder.js#L18
      svgo: {
        floatPrecision: 2,
        plugins: [
          { cleanupAttrs: true },
          { removeDoctype: true },
          { removeXMLProcInst: true },
          { removeXMLNS: true },
          { removeComments: true },
          { removeMetadata: true },
          { removeTitle: true },
          { removeDesc: true },
          { removeUselessDefs: true },
          { removeEditorsNSData: true },
          { removeEmptyAttrs: true },
          { removeHiddenElems: true },
          { removeEmptyText: true },
          { removeEmptyContainers: true },
          { removeViewBox: false },
          { cleanupEnableBackground: true },
          { convertStyleToAttrs: true },
          { convertColors: true },
          { convertPathData: true },
          { convertTransform: true },
          { removeUnknownsAndDefaults: true },
          { removeNonInheritableGroupAttrs: true },
          { removeUselessStrokeAndFill: true },
          { removeUnusedNS: true },
          { cleanupIDs: true },
          { cleanupNumericValues: true },
          { moveElemsAttrsToGroup: true },
          { moveGroupAttrsToElems: true },
          { collapseGroups: true },
          { removeRasterImages: false },
          { mergePaths: true },
          { convertShapeToPath: true },
          { sortAttrs: true },
          { removeDimensions: true },
          { removeAttrs: { attrs: ['class'] } }
        ]
      },
      prettier: {
        parser: 'babylon',
        singleQuote: true
      }
    }
  }
};
