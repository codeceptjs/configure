import { config } from '../codeceptjs.js'

export default function () {
  config.addHook(cfg => {
    if (!cfg.plugins) cfg.plugins = {}

    cfg.plugins.retryFailedStep = cfg.plugins.retryFailedStep || { enabled: true }
    cfg.plugins.eachElement = cfg.plugins.eachElement || { enabled: true }
    cfg.plugins.pauseOnFail = cfg.plugins.pauseOnFail || {}
    cfg.plugins.screenshotOnFail = cfg.plugins.screenshotOnFail || {}
  })
}
