import { config } from '../codeceptjs.js'

export default function () {
  config.addHook(cfg => {
    if (!cfg.plugins) cfg.plugins = {}

    // Enabled globally
    cfg.plugins.retryFailedStep = cfg.plugins.retryFailedStep || { enabled: true }
    cfg.plugins.screenshotOnFail = cfg.plugins.screenshotOnFail || {}

    // Registered but not enabled — activate via `-p <name>` on the CLI or by
    // setting `enabled: true` in user config.
    cfg.plugins.pauseOn = cfg.plugins.pauseOn || {}
    cfg.plugins.browser = cfg.plugins.browser || {}
    cfg.plugins.aiTrace = cfg.plugins.aiTrace || {}
  })
}
