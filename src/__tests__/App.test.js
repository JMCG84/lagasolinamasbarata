import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from '../App.vue'

// Mock router-view
const routerViewMock = {
  template: '<div>Mocked Router View</div>'
}

describe('App Smoke Test', () => {
  it('renders the footer with correct author name', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          'RouterView': true
        }
      }
    })
    expect(wrapper.text()).toContain('José Manuel Campos')
  })

  it('has a footer with copyright notice', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          'RouterView': true
        }
      }
    })
    expect(wrapper.find('.site-footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('2026 La Gasolinera Más Barata')
  })
})
