import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// react-router-dom v7 uses ESM which Jest in CRA struggles to resolve
// Provide a minimal mock so tests can run without the real library
jest.mock('react-router-dom', () => ({
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
  useNavigate: () => jest.fn(),
}), { virtual: true });

test('renders home page', () => {
  render(<App />);
  expect(screen.getAllByText(/Orçamenthus/i).length).toBeGreaterThan(0);
});
