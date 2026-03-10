import tailwindcss from '@tailwindcss/vite'
import type { StorybookConfig } from '@storybook/react-vite'
import Icons from 'unplugin-icons/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        tailwindcss(),
        Icons({ compiler: 'jsx', jsx: 'react' }),
        tsconfigPaths(),
      ],
    })
  },
}

export default config
