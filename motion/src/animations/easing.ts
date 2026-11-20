import { Easing } from 'remotion'

/**
 * Premium Apple / SaaS style motion curves
 */
export const MotionCurves = {
  // Ultra-smooth fluid decel (Apple iOS standard)
  appleEase: Easing.bezier(0.16, 1, 0.3, 1),
  // Snappy hero entrance
  heroSnap: Easing.bezier(0.05, 0.9, 0.1, 1),
  // Dramatic deceleration
  dramatic: Easing.bezier(0.19, 1, 0.22, 1),
  // Smooth symmetrical transition
  smoothInOut: Easing.bezier(0.65, 0, 0.35, 1),
  // Gentle hover / float
  gentle: Easing.bezier(0.4, 0, 0.2, 1),
  // Ease out quart
  easeOutQuart: Easing.bezier(0.165, 0.84, 0.44, 1),
  // Ease in-out cubic
  easeInOutCubic: Easing.bezier(0.645, 0.045, 0.355, 1)
}
