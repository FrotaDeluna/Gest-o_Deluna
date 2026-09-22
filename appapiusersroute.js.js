import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Listar usuários
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

// Criar ou atualizar usuário
export async function POST(request) {
  try {
    const { username, password, role, perms } = await request.json();
    const cleanUser = username.toLowerCase().trim();

    const newUser = await prisma.user.upsert({
      where: { username: cleanUser },
      update: { password, role, perms },
      create: { username: cleanUser, password, role, perms }
    });

    return NextResponse.json({ success: true, newUser });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar usuário' }, { status: 500 });
  }
}

// Deletar usuário
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    await prisma.user.delete({
      where: { username: username.toLowerCase().trim() }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
}