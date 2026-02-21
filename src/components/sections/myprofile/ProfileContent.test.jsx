import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import ProfileContent from './ProfileContent';

// simple mock for lucide-react icons (they just render an svg) since they don't affect the DOM
jest.mock('lucide-react', () => {
  const React = require('react');
  const Dummy = (props) => <svg {...props} data-testid="icon" />;
  return new Proxy(Dummy, {
    get: (target, name) => Dummy,
  });
});

describe('ProfileContent primary member card', () => {
  beforeEach(() => {
    // clear localStorage and mocks
    localStorage.clear();
    jest.resetAllMocks();

    // mock fetch for user profile
    global.fetch = jest.fn();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        full_name: 'John Doe',
        age: 30,
        gender: 'Male',
        mobile: '9999999999',
        membership_id: 'ABC123',
        start_date: '2024-01-01',
        end_date: '2025-01-01',
        blood_group: 'O+',
        address: '123 street',
        profile_image: '',
        family_members: [],
      }),
    });
  });

  it('renders age and gender on primary member card', async () => {
    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>
    );

    // wait for the fetch call to complete and patient data to render
    await waitFor(() => {
      expect(screen.getByText(/MEMBERSHIP ID/i)).toBeInTheDocument();
    });

    // verify the age/gender row
    expect(screen.getByText(/AGE \/ GENDER/i)).toBeInTheDocument();
    expect(screen.getByText(/30 \/ Male/)).toBeInTheDocument();
  });
});
