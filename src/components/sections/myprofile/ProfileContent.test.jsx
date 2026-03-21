import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
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
      expect(screen.getAllByText(/MEMBERSHIP ID/i).length).toBeGreaterThan(0);
    });

    // verify the age/gender row
    expect(screen.getByText(/AGE \/ GENDER/i)).toBeInTheDocument();
    expect(screen.getByText(/30 \/ Male/)).toBeInTheDocument();
  });

  it('normalizes alternate profile fields for status and photo', async () => {
    global.fetch.mockReset();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        full_name: 'Jane Doe',
        age: 27,
        gender: 'Female',
        mobile_number: '8888888888',
        membership_id: 'XYZ789',
        start_date: '2024-05-01',
        end_date: '2025-05-01',
        blood_group: 'A+',
        address: '456 avenue',
        photo: '/media/profile.jpg',
        is_active: 'active',
        family_members: [],
      }),
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Primary Member/i).length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText(/^Active$/i).length).toBeGreaterThan(0);
    const profileImage = screen.getByAltText('Jane Doe');
    expect(profileImage).toHaveAttribute(
      'src',
      expect.stringContaining('https://admin.vaidyabandhu.com/media/profile.jpg')
    );
  });
});
