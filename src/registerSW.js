import { registerSW as register } from 'virtual:pwa-register'

export function registerSW(immediate = false) {
  register({ immediate })
}