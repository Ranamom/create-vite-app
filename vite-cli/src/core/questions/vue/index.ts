import precss from './precss'
import components from './components'
import Plugins from './plugins'
import future from './feature'
import theme from './theme'
import options from '@/compile/vue/options'
import {
  componentsMap,
  lintMap,
  featureMap,
  pluginMap,
  pluginImportStatement,
  componentResolverMap,
  notComponentResolverMap
} from '@/compile/vue/vueEjsMapConstant'
import createQuestion from '@/utils/question'
async function getVueProperty() {
  const currentLibrary = componentsMap.get(options.components)
  const Eslint = featureMap.get('eslintPlugin')
  const Prettier = featureMap.get('prettier')
  const Router = featureMap.get('router')
  const Pinia = featureMap.get('pinia')
  const currentComponentResolver = componentResolverMap.get(options.components)
  const notComponentResolver = notComponentResolverMap.includes(
    options.components
  )
  Array.from(componentsMap.keys()).forEach((item) => {
    options[item] = options.components === item
  })
  resolveOptions(options, featureMap)
  resolveOptions(options, pluginMap)
  resolveOptions(options, lintMap)
  options.ui = currentLibrary
  options.constantDevDeps = featureMap.get('constantDevDeps')
  options.constantProDeps = featureMap.get('constantProDeps')
  options.ComponentResolver = currentComponentResolver
  options.notComponentResolver = notComponentResolver
  options.EslintWithPrettierScript = featureMap.get('eslintWithPrettier')
  options.Eslint = filterOptions(Eslint, options.useEslint)
  options.Prettier = filterOptions(Prettier, options.usePrettier)
  options.Router = filterOptions(Router, options.useRouter)
  options.Pinia = filterOptions(Pinia, options.usePinia)
  options.pluginList = options.plugins
    .map((item) => pluginMap.get(item))
    .reduce((total, next) => total + next, '')

  options.pluginImportStatement = options.plugins
    .map((item) => pluginImportStatement.get(item))
    .reduce((total, next) => total + next, '')
  return Promise.resolve(true)
}
export async function runVueQuestions() {
  // 新特性 新预设
  await createQuestion(future)
  // ui library
  await createQuestion(components)
  // theme
  const res = await createQuestion(theme)
  // eslint-disable-next-line no-unused-expressions
  res.useTheme &&
    // eslint-disable-next-line array-callback-return
    Plugins.choices.map((item) => {
      if (item.selected === false) {
        item.selected = true
      }
    })
  // vite plugins
  await createQuestion(Plugins)
  // 主题化默认暂时scss
  // eslint-disable-next-line no-unused-expressions
  !options.useTheme && (await createQuestion(precss))
  // options assign
  await getVueProperty()
}

export function resolveOptions(originOptions, configMap) {
  Array.from(configMap.keys()).forEach((item: any) => {
    originOptions[item] = configMap.get(item)
  })
}

export function filterOptions(optionsFilter: any, use) {
  return use ? optionsFilter : ''
}
