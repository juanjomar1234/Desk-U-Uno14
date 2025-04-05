export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  password: 'test123',
  name: 'Test User'
};

export const TEST_BOARD = {
  id: 'test-board-id',
  title: 'Test Board',
  columns: [
    { id: 'test-column-id', title: 'Test Column' }
  ]
}; 