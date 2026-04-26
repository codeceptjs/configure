import codeceptjs from 'codeceptjs'

if (!codeceptjs?.config?.addHook) {
  throw new Error('CodeceptJS >= 4.0.0 is required to use config hooks. For older versions, install @codeceptjs/configure@^1.')
}

export default codeceptjs
export const config = codeceptjs.config
export const container = codeceptjs.container
export const event = codeceptjs.event
export const output = codeceptjs.output
