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

  it('normalizes nested primary_member and family member payloads', async () => {
    global.fetch.mockReset();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        primary_member: {
          full_name: 'Nested Primary',
          age: 45,
          gender: 'Male',
          membership_id: 'PM-1001',
          start_date: '2026-01-01',
          end_date: '2027-01-01',
          blood_group: 'B+',
          address: 'Nested Street',
          mobile: '9000000000',
          profile_image: '/media/primary_nested.jpg',
          is_active: 'active',
        },
        family_members: [
          {
            member_name: 'Nested Family',
            member_age: 12,
            sex: 'Female',
            member_membership_id: 'FM-2002',
            membership_start_date: '2026-01-01',
            membership_end_date: '2027-01-01',
            blood_group: 'A+',
            relation: 'daughter',
            profile_photo: '/media/family_nested.jpg',
            membership_status: 'active',
          },
        ],
      }),
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/PM-1001/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/45 \/ Male/)).toBeInTheDocument();
    expect(screen.getByText(/FM-2002/i)).toBeInTheDocument();
    expect(screen.getByText(/12 \/ Female/)).toBeInTheDocument();
    expect(screen.getAllByText(/^Active$/i).length).toBeGreaterThan(1);
  });

  it('prefers the dedicated primary member image over conflicting root-level image fields', async () => {
    global.fetch.mockReset();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        profile_image: '/media/root_wrong.jpg',
        primary_member: {
          id: 10,
          full_name: 'Primary Correct',
          age: 39,
          gender: 'Male',
          membership_id: 'VB-PRIMARY-10',
          start_date: '2026-01-01',
          end_date: '2027-01-01',
          blood_group: 'B+',
          mobile: '9000000010',
          profile_photo: '/media/primary_correct.jpg',
          is_active: 'active',
        },
        family_members: [],
      }),
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/VB-PRIMARY-10/i)).toBeInTheDocument();
    });

    const primaryImage = screen.getByAltText('Primary Correct');
    expect(primaryImage).toHaveAttribute(
      'src',
      expect.stringContaining('https://admin.vaidyabandhu.com/media/primary_correct.jpg')
    );
  });

  it('prefers the nested family member image over conflicting wrapper image fields', async () => {
    global.fetch.mockReset();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        primary_member: {
          full_name: 'Parent User',
          age: 45,
          gender: 'Male',
          membership_id: 'VB-PARENT-45',
          start_date: '2026-01-01',
          end_date: '2027-01-01',
          blood_group: 'O+',
          mobile: '9000000045',
          profile_image: '/media/parent.jpg',
          is_active: 'active',
        },
        family_members: [
          {
            relationship: 'daughter',
            profile_image: '/media/wrapper_wrong.jpg',
            member: {
              id: 301,
              member_name: 'Child Correct',
              member_age: 14,
              sex: 'Female',
              member_membership_id: 'VB-CHILD-301',
              membership_start_date: '2026-01-01',
              membership_end_date: '2027-01-01',
              blood_group: 'A+',
              profile_photo: '/media/child_correct.jpg',
              membership_status: 'active',
            },
          },
        ],
      }),
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/VB-CHILD-301/i)).toBeInTheDocument();
    });

    const childImage = screen.getByAltText('Child Correct');
    expect(childImage).toHaveAttribute(
      'src',
      expect.stringContaining('https://admin.vaidyabandhu.com/media/child_correct.jpg')
    );
  });
});
