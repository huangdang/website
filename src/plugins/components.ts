/**
 * 绑定公用自定义组件
 * @param app
 */
export default function commonComponent(app: ReturnType<typeof createApp>) {
  const components:any = import.meta.glob('/src/components/*.vue', { eager: true })

  const includeNames = [
    'AppContainer',
    'AppSelect',
    'AppTreeSelect',
    'AppAutocomplete',
    'AppCheckbox',
    'AppRadio',
    'AppUpload'
  ]

  Object.keys(components).forEach((key: string) => {
    const component = components[key].default || components[key]
    if (includeNames.includes(component.name)) {
      app.component(component.name, component)
    }
  })
}