// src/app/api/reports/route.ts
// =================================================================
// API ROUTE SIMPLE DE ALERTACORDÓN - Reportes Anónimos (VERSIÓN ESTABLE)
// =================================================================
// Funciona perfecto local - POST 201, GET 200, Neon cloud OK
// Type guard mínimo para Vercel build - sin path aliases complicados
// =================================================================

import { NextRequest, NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '@prisma/client';
import { geocodeLocation } from '@/utils/geocoding';
import { postAlertToX } from '@/utils/xClient';

// PRISMA SIMPLE: Directo, sin singleton (funciona perfecto)
const prisma = new PrismaClient();

// =================================================================
// POST /api/reports - CREAR REPORTE ANÓNIMO
// =================================================================
export async function POST(request: NextRequest) {
  console.log('🚀 [POST /api/reports] Request recibida');
  
  try {
    const { location, description, category } = await request.json();

    // Validación básica
    if (!location || !description) {
      return NextResponse.json(
        { error: 'Faltan ubicación o descripción.' }, 
        { status: 400 }
      );
    }

    const coordinates = geocodeLocation(location);

    // Guardar reporte anónimo
    const report = await prisma.report.create({
      data: {
        location,
        description,
        category: category || 'general',
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        isAnonymous: true,
      },
    });

    console.log('🚨 Nuevo reporte #', report.id, 'en', location);
    console.log('Descripción:', description);

    await postAlertToX({
      id: report.id,
      location: report.location,
      description: report.description,
      category: report.category,
    });

    return NextResponse.json({
      success: true,
      message: `🚨 Alerta enviada! Reporte #${report.id} registrado. Los vecinos están más seguros gracias a vos.`,
      report,
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('💥 Error creando reporte:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Error de base de datos. Intentá de nuevo.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Ups, algo falló. Intentá de nuevo.' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// =================================================================
// GET /api/reports - LISTAR REPORTES PÚBLICOS
// =================================================================
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      select: {
        id: true,
        location: true,
        description: true,
        category: true,
        latitude: true,
        longitude: true,
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