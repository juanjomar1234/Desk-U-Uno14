import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Para desarrollo/pruebas
    if (email === 'admin@uno14.com' && password === 'Admin123!') {
      return NextResponse.json({
        token: 'test-token',
        user: {
          id: 1,
          email: 'admin@uno14.com',
          role: 'admin'
        }
      });
    }

    // URL del servicio según el entorno
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://uno14.trading/colaboradores/user-service'
      : 'http://localhost:3001';

    // Llamada al servicio de usuarios
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      console.error('Error response:', await response.text());
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
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