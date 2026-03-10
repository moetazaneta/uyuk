import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      plugins: [
        tailwindcss(),
        Icons({ compiler: 'jsx', jsx: 'react' }),
        tsconfigPaths(),
      ],
    })
  },
}

export default config
