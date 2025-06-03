import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <>{element}</>,
  useNavigate: () => jest.fn(),
}));

test('exibe o texto "Corujão Marmitas" na página inicial', () => {
  render(<App />);
  const elements = screen.getAllByText(/Corujão Marmitas/i);
  expect(elements.length).toBeGreaterThan(0);
});
