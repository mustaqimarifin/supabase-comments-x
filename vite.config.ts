/* eslint-disable no-console */
import { extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { optimizeCssModules as penis } from 'vite-plugin-optimize-css-modules'
import { libInjectCss as css } from 'vite-plugin-lib-inject-css'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import glob from 'glob'
import pkg from './package.json'

console.log('Expected Externals', [
  'react/jsx-runtime',
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),

])

const input = Object.fromEntries(
  glob.glob.sync('lib/**/*.{ts,tsx}', {
    ignore: ['lib/**/*.d.ts'],
  })
    .map(file => [
      relative('lib', file.slice(0, file.length - extname(file).length)),
      fileURLToPath(new URL(file, import.meta.url)),
    ]),
)

const external = [
  'react/jsx-runtime',
  ...Object.keys(pkg.devDependencies),
  ...Object.keys(pkg.peerDependencies),
  'lib'
]

export default defineConfig({
  plugins: [penis(), css(), dts()],
  build: {
    lib: {
      /* entry: {
        index: 'src/index.tsx',
        altbutton: 'src/components/AltButton/index.tsx',
        button: 'src/components/Button/index.tsx',
        typography: 'src/components/Typography/index.tsx',
        icon: 'src/components/Icon/index.tsx',
        image: 'src/components/Image/index.tsx',
        badge: 'src/components/Badge/index.tsx',
        alert: 'src/components/Alert/index.tsx',
        modal: 'src/components/Modal/index.tsx',
        dropdown: 'src/components/Dropdown/index.tsx',
        space: 'src/components/Space/index.tsx',
        loading: 'src/components/Loading/index.tsx',
      }, */
      entry: ['lib/index.tsx'],

      /*  entry: [
        'src/index.ts',
        'src/components/AltButton/index.tsx',
        'src/components/Button/index.tsx',
        'src/components/Typography/index.tsx',
        'src/components/Icon/index.tsx',
        'src/components/Image/index.tsx',
        'src/components/Badge/index.tsx',
        'src/components/Alert/index.tsx',
        'src/components/Modal/index.tsx',
        'src/components/Dropdown/index.tsx',
        'src/components/Space/index.tsx',
        'src/components/Loading/index.tsx',
      ], */
      /* 'src/components/Button/index.tsx',
        'src/components/Typography/index.tsx',
        'src/components/Icon/index.tsx',
        'src/components/Image/index.tsx',
        'src/components/Card/index.tsx',
        'src/components/Badge/index.tsx',
        'src/components/Alert/index.tsx',
        'src/components/Accordion/index.tsx',
        'src/components/Tabs/index.tsx',
        'src/components/Menu/index.tsx',
        'src/components/Modal/index.tsx',
        'src/components/Popover/index.tsx',
        'src/components/Dropdown/index.tsx',
        'src/components/ContextMenu/index.tsx',
        'src/components/Space/index.tsx',
        'src/components/Loading/index.tsx',
        'src/components/Divider/index.tsx',
        'src/components/Select/index.tsx',
        'src/components/Checkbox/index.tsx',
        'src/components/Input/index.tsx',
        'src/components/Radio/index.tsx',
        'src/components/Toggle/index.tsx',
        'src/components/Upload/index.tsx',
      ], */
      formats: ['es'],
    },
    commonjsOptions: {
      // strictRequires: true,
      // esmExternals: true,
      // requireReturnsDefault: true,
      ignoreGlobal: false,
      include: 'node_modules/**',
    },
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'lightningcss',
    rollupOptions: {
      external,
      input,
      output: [
        {
          // hoistTransitiveImports: false,
          chunkFileNames: 'chunks/[name][hash].js',
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].js',
          dir: 'dist',
          format: 'es',
        },
        
      ],
      /*  output: [
        {
          dir: 'dist',
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
        },
      ], */
      treeshake: {
        preset: 'smallest',
      },
    },
  },
})
