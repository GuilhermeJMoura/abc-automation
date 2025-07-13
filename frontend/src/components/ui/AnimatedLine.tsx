import React from 'react'

interface AnimatedLineProps {
  className?: string
  agentClassName?: string
  startLineLength?: number
  endLineLength?: number
  agentId?: string
  flip?: boolean
  verticalOffset?: number
  activeAgent?: string
}

const AnimatedLine: React.FC<AnimatedLineProps> = ({
  className,
  agentClassName,
  startLineLength = 0,
  endLineLength = 0,
  agentId,
  flip = false,
  verticalOffset = 0,
  activeAgent
}) => {
  const isActive = activeAgent === agentId

  return (
    <div className={className}>
      {/* Linha principal */}
      <div 
        className={`
          w-[2px] bg-gradient-to-b from-[#00CCFF] to-[#666666] 
          transition-all duration-1000 ease-in-out
          ${isActive ? 'opacity-100' : 'opacity-30'}
        `}
        style={{
          height: `${Math.abs(endLineLength - startLineLength)}px`,
          transform: `translateY(${Math.min(startLineLength, endLineLength)}px)`
        }}
      />
      
      {/* Ponto do agente */}
      {agentId && (
        <div 
          className={`
            absolute w-4 h-4 rounded-full bg-[#00CCFF] 
            border-2 border-[#00CCFF]/50 transition-all duration-300
            ${isActive ? 'scale-125 shadow-lg shadow-[#00CCFF]/50' : 'scale-100'}
            ${agentClassName || ''}
          `}
          style={{
            top: `${verticalOffset}px`,
            transform: flip ? 'translateX(-50%)' : 'translateX(-50%)'
          }}
        />
      )}
    </div>
  )
}

export default AnimatedLine 