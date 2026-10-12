/**
 * GET /info → merges two small helpers for easy unit testing.
 * Returns: { name, version, node, uptime }
 */
import { Router } from 'express'
import { getPackageInfo, getRuntimeInfo } from '../../utils/appInfo.js'

const router = Router()

router.get('/info', (_req, res) => {
  const packageInfo = getPackageInfo()
  const runtimeInfo = getRuntimeInfo()

  const info = {
    name: packageInfo.name,
    version: packageInfo.version,
    node: runtimeInfo.node,
    uptime: runtimeInfo.uptime
  }

  res.status(200).json(info)
})

export default router
