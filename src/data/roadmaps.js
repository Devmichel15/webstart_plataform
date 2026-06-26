import { createRoadmap } from './schemas.js'
import { trails, getTrailById, getModuleData, getModuleLessons, getTrailWithModules } from './trails.js'

export { getModuleData, getModuleLessons }

export const courses = trails

export function getCourseById(id) {
  return getTrailById(id)
}

export function getCourseWithModules(courseId) {
  return getTrailWithModules(courseId)
}

export const roadmaps = [
  createRoadmap({
    id: 'web',
    title: 'Jornada WebStart',
    description: 'Sua jornada linear para se tornar um desenvolvedor web completo.',
    icon: 'map',
    color: 'brand',
    order: 0,
    courses: trails.sort((a, b) => a.order - b.order).map((t) => t.id),
  }),
]

export function getRoadmapById(id) {
  return roadmaps.find((r) => r.id === id) || null
}

export function getCoursesByRoadmap(roadmapId) {
  return trails.sort((a, b) => a.order - b.order)
}
