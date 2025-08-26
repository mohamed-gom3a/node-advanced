import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../App';

// Mock the actions
jest.mock('../../actions', () => ({
  fetchUser: jest.fn()
}));

const mockStore = configureStore([thunk]);

describe('App Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: null
      }
    });
  });

  const renderWithProviders = (component) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/Blogster/i)).toBeInTheDocument();
  });

  it('renders Header component', () => {
    renderWithProviders(<App />);
    // Header should be present
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders Landing page by default', () => {
    renderWithProviders(<App />);
    // Landing page content should be visible
    expect(screen.getByText(/Blogster/i)).toBeInTheDocument();
  });

  it('calls fetchUser on mount', () => {
    const { fetchUser } = require('../../actions');
    renderWithProviders(<App />);
    expect(fetchUser).toHaveBeenCalled();
  });
});
