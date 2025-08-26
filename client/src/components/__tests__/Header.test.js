import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Header from '../Header';

const mockStore = configureStore([thunk]);

describe('Header Component', () => {
  let store;

  const renderWithProviders = (component, initialState = {}) => {
    store = mockStore({
      auth: {
        user: null,
        ...initialState
      }
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders without crashing', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText(/Blogster/i)).toBeInTheDocument();
  });

  it('displays login link when user is not authenticated', () => {
    renderWithProviders(<Header />);
    
    const loginLink = screen.getByText(/Login With Google/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/auth/google');
  });

  it('displays user menu when user is authenticated', () => {
    renderWithProviders(<Header />, {
      user: {
        id: '123',
        displayName: 'Test User'
      }
    });

    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it('displays navigation links when authenticated', () => {
    renderWithProviders(<Header />, {
      user: {
        id: '123',
        displayName: 'Test User'
      }
    });

    expect(screen.getByText(/Blogs/i)).toBeInTheDocument();
    expect(screen.getByText(/New Blog/i)).toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    renderWithProviders(<Header />, {
      user: {
        id: '123',
        displayName: 'Test User'
      }
    });

    const blogsLink = screen.getByText(/Blogs/i).closest('a');
    const newBlogLink = screen.getByText(/New Blog/i).closest('a');

    expect(blogsLink).toHaveAttribute('href', '/blogs');
    expect(newBlogLink).toHaveAttribute('href', '/blogs/new');
  });

  it('displays logout link with correct href', () => {
    renderWithProviders(<Header />, {
      user: {
        id: '123',
        displayName: 'Test User'
      }
    });

    const logoutLink = screen.getByText(/Logout/i).closest('a');
    expect(logoutLink).toHaveAttribute('href', '/auth/logout');
  });

  it('renders brand logo/link correctly', () => {
    renderWithProviders(<Header />);
    
    const brandLink = screen.getByText(/Blogster/i).closest('a');
    expect(brandLink).toHaveAttribute('href', '/');
  });
});
