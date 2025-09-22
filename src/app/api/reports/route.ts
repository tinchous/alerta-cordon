// src/app/api/reports/route.ts - VERSIÓN SIN RESEND (temporal)
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// COMENTADO TEMPORAL - Activamos cuando tengamos API key
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { location, description, category } = await request.json();

    // Validación básica
    if (!location || !description) {
      return NextResponse.json(
        { error: 'Faltan ubicación o descripción.' },
        { status: 400 }
      );
    }

    // Guardar reporte anónimo
    const report = await prisma.report.create({
      data: {
        location,
        description,
        category: category || 'general',
        isAnonymous: true,
      },
    });

    console.log('🚨 Nuevo reporte #', report.id, 'en', location);
    console.log('Descripción:', description);

    // TODO: Aquí iría el email y X post
    // if (resend) { await sendAlerts(resend, report); }

    return NextResponse.json({
      success: true,
      message: `🚨 Alerta enviada! Reporte #${report.id} registrado. Los vecinos están más seguros gracias a vos.`,
      reportId: report.id
    }, { status: 201 });

  } catch (error) {
    console.error('💥 Error creando reporte:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error de base de datos. Intentá de nuevo.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Ups, algo falló. Intentá de nuevo en unos minutos.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      select: {
        id: true,
        location: true,
        description: true,
        category: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error listando reportes:', error);
    return NextResponse.json([], { status: 200 });
  }
}
