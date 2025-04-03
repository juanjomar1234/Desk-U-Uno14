import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Credenciales temporales para desarrollo y producción
    if (email === 'admin@uno14.com' && password === 'Admin123!') {
      console.log('Login exitoso con credenciales temporales');
      return NextResponse.json({
        token: 'test-token',
        user: {
          id: 1,
          email: 'admin@uno14.com',
          role: 'admin'
        }
      });
    }

    // Si no son las credenciales temporales, devolver error
    console.log('Credenciales inválidas');
    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    );

  } catch (error: unknown) {
    console.error('Error en login:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error interno del servidor';
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 