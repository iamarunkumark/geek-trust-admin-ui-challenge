import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { userAPIURL } from './features/table/tableConstants';
import { User } from './features/table/tableSlice';

const dummyData: User[] = [
  {
    name: "Joni Baez",
    id: "1",
    email: "abc@def.com",
    role: 'engineer'
  },
  {
    name: "Benz paul",
    id: "2",
    email: "bez@pau.com",
    role: 'manager'
  }
];
const server = setupServer(
  rest.get(userAPIURL, (req, res, ctx) => {
    return res(ctx.json(dummyData))
  }),
);
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('loads and displays greeting', async () => {
  // Fix for TypeError: window.matchMedia is not a function 
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await waitFor(() => screen.getByText(dummyData[0].name, {exact: false}))
  expect(screen.getByText(/Geek/i)).toHaveTextContent('Geek')
  expect(screen.getByText(dummyData[0].name, {exact: false})).toHaveTextContent(dummyData[0].name);
});