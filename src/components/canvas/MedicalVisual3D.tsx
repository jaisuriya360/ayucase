import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { ErrorBoundary } from '../ui/ErrorBoundary'

interface DNAHelixMeshProps {
  isMobile: boolean
  isLowPerformance: boolean
  reduceMotion: boolean
}

// Inner 3D biological DNA helix node cluster
const DNAHelixMesh: React.FC<DNAHelixMeshProps> = ({ isMobile, isLowPerformance, reduceMotion }) => {
  const groupRef = useRef<THREE.Group>(null)

  // Responsive particle count and scale
  const points = useMemo(() => {
    const ptsA: THREE.Vector3[] = []
    const ptsB: THREE.Vector3[] = []
    const connections: [THREE.Vector3, THREE.Vector3][] = []

    // Reduce particle count on mobile (50% reduction) and low-performance devices
    const count = isLowPerformance ? 10 : isMobile ? 14 : 28
    const radius = isMobile ? 1.1 : 1.4
    const height = isMobile ? 3.6 : 4.5

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4
      const y = (i / count - 0.5) * height
      const x1 = Math.cos(t) * radius
      const z1 = Math.sin(t) * radius
      const x2 = Math.cos(t + Math.PI) * radius
      const z2 = Math.sin(t + Math.PI) * radius

      const pA = new THREE.Vector3(x1, y, z1)
      const pB = new THREE.Vector3(x2, y, z2)
      ptsA.push(pA)
      ptsB.push(pB)

      if (i % 2 === 0) {
        connections.push([pA, pB])
      }
    }

    return { ptsA, ptsB, connections }
  }, [isMobile, isLowPerformance])

  useFrame((state, delta) => {
    if (groupRef.current && !reduceMotion) {
      const rotSpeed = isLowPerformance ? 0.2 : 0.4
      groupRef.current.rotation.y += delta * rotSpeed
      if (!isLowPerformance) {
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.12
      }
    }
  })

  // Geometry segments: lower on mobile & low-perf to prevent GPU strain
  const sphereSegments = isLowPerformance || isMobile ? 8 : 16
  const cylinderRadial = isLowPerformance || isMobile ? 4 : 8
  const scaleMultiplier = isMobile ? 0.75 : 1.0

  return (
    <group ref={groupRef} scale={[scaleMultiplier, scaleMultiplier, scaleMultiplier]}>
      {/* Strand A nodes */}
      {points.ptsA.map((pt, i) => (
        <mesh key={`a-${i}`} position={pt}>
          <sphereGeometry args={[isMobile ? 0.08 : 0.09, sphereSegments, sphereSegments]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={isLowPerformance ? 0.3 : 0.6}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Strand B nodes */}
      {points.ptsB.map((pt, i) => (
        <mesh key={`b-${i}`} position={pt}>
          <sphereGeometry args={[isMobile ? 0.08 : 0.09, sphereSegments, sphereSegments]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={isLowPerformance ? 0.3 : 0.6}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Base pair connection rungs */}
      {points.connections.map(([pA, pB], i) => {
        const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5)
        const dist = pA.distanceTo(pB)

        return (
          <group key={`rung-${i}`} position={mid}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, dist, cylinderRadial]} />
              <meshStandardMaterial
                color="#6366f1"
                emissive="#4f46e5"
                emissiveIntensity={isLowPerformance ? 0.2 : 0.4}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export const MedicalVisual3D: React.FC<{ className?: string }> = ({ className }) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isLowPerformance, setIsLowPerformance] = useState<boolean>(false)

  let reduceMotion = false
  try {
    const a11y = useAccessibility()
    reduceMotion = a11y.settings.reduceMotion
  } catch {
    // Fallback if rendered outside provider
  }

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }

    // Responsive screen size listener
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Hardware capability detection
    const isLowPower =
      typeof navigator !== 'undefined' &&
      ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        // @ts-expect-error deviceMemory is non-standard
        (navigator.deviceMemory && navigator.deviceMemory < 4))

    if (isLowPower) {
      setIsLowPerformance(true)
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fallbackVisual = (
    <div className={`relative flex items-center justify-center ${className || 'h-64'}`}>
      <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border-2 border-dashed border-emerald-500/50 animate-spin" />
      <div className="absolute w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 blur-lg opacity-40" />
    </div>
  )

  if (!hasWebGL) {
    return fallbackVisual
  }

  return (
    <div className={`w-full h-full relative min-h-[180px] sm:min-h-[220px] ${className || ''}`}>
      <ErrorBoundary fallback={fallbackVisual}>
        <Canvas
          camera={{ position: [0, 0, isMobile ? 5.8 : 5], fov: isMobile ? 50 : 45 }}
          gl={{
            alpha: true,
            antialias: !isLowPerformance,
            powerPreference: isLowPerformance ? 'low-power' : 'default',
          }}
          dpr={isMobile || isLowPerformance ? [1, 1.5] : [1, 2]}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -5, -5]} intensity={0.5} color="#10b981" />
          {reduceMotion || isLowPerformance ? (
            <DNAHelixMesh
              isMobile={isMobile}
              isLowPerformance={isLowPerformance}
              reduceMotion={reduceMotion}
            />
          ) : (
            <Float speed={isMobile ? 1.2 : 2} rotationIntensity={0.3} floatIntensity={0.4}>
              <DNAHelixMesh
                isMobile={isMobile}
                isLowPerformance={isLowPerformance}
                reduceMotion={reduceMotion}
              />
            </Float>
          )}
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}
