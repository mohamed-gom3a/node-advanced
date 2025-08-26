import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import BlogForm from '../blogs/BlogForm';

const mockStore = configureStore([thunk]);

describe('BlogForm Component', () => {
  let store;
  let mockSubmit;

  beforeEach(() => {
    mockSubmit = jest.fn();
    store = mockStore({
      auth: {
        user: {
          id: '123',
          displayName: 'Test User'
        }
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
    renderWithProviders(<BlogForm onSubmit={mockSubmit} />);
    expect(screen.getByText(/Create a New Blog/i)).toBeInTheDocument();
  });

  it('renders form fields', () => {
    renderWithProviders(<BlogForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/Blog Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  it('updates form values on input change', () => {
    renderWithProviders(<BlogForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/Blog Title/i);
    const contentInput = screen.getByLabelText(/Content/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Blog Title' } });
    fireEvent.change(contentInput, { target: { value: 'Test blog content' } });
    
    expect(titleInput.value).toBe('Test Blog Title');
    expect(contentInput.value).toBe('Test blog content');
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<BlogForm onSubmit={mockSubmit} />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/You must provide a title/i)).toBeInTheDocument();
      expect(screen.getByText(/You must provide some content/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors for short content', async () => {
    renderWithProviders(<BlogForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/Blog Title/i);
    const contentInput = screen.getByLabelText(/Content/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(contentInput, { target: { value: 'Short' } });
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Content must be at least 20 characters/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with form data when valid', async () => {
    renderWithProviders(<BlogForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/Blog Title/i);
    const contentInput = screen.getByLabelText(/Content/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Blog Title' } });
    fireEvent.change(contentInput, { target: { value: 'This is a test blog content that is long enough' } });
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'Test Blog Title',
        content: 'This is a test blog content that is long enough'
      });
    });
  });

  it('clears form after successful submission', async () => {
    renderWithProviders(<BlogForm onSubmit={mockSubmit} />);
    
    const titleInput = screen.getByLabelText(/Blog Title/i);
    const contentInput = screen.getByLabelText(/Content/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Blog Title' } });
    fireEvent.change(contentInput, { target: { value: 'This is a test blog content that is long enough' } });
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
    
    // Form should be cleared
    expect(titleInput.value).toBe('');
    expect(contentInput.value).toBe('');
  });
});
