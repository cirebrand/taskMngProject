import React from "react"

export const useMountlessEffect = (
  effect: React.EffectCallback,
  dependencies: any[]
) => {
  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (mounted.current) {
      const unmount = effect()
      return () => unmount && unmount()
    } else {
      mounted.current = true
    }
  }, dependencies)

  React.useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])
}
