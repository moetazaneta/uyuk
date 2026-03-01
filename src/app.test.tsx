import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

function Placeholder() {
  return <h1>uyuk</h1>
}

describe('app', () => {
  it('renders without crashing', () => {
    render(<Placeholder />)
    expect(screen.getByRole('heading')).toHaveTextContent('uyuk')
  })
})
