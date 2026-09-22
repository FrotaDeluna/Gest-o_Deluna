import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const cleanUser = username.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { username: cleanUser }
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { username: user.username, role: user.role, perms: user.perms } 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}