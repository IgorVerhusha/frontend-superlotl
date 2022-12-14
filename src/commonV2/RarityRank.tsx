import React from 'react'
import styled from 'styled-components'

export default function RarityRank ({ className = '', rarityRank }) {
  if (!rarityRank) return <div />
  return (
    <StyledWrapper className={className}>
      No{rarityRank}
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.text.secondaryBlue};
`
