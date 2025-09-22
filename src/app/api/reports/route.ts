// src/app/api/reports/route.ts
// =================================================================
// API ROUTE SIMPLE DE ALERTACORDÓN - Reportes Anónimos (VERSIÓN ESTABLE)
// =================================================================
// Funciona perfecto local - POST 201, GET 200, Neon cloud OK
// Type guard mínimo para Vercel build - sin path aliases complicados
// =================================================================

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

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

    return NextResponse.json({ 
      success: true, 
      message: `🚨 Alerta enviada! Reporte #${report.id} registrado. Los vecinos están más seguros gracias a vos.`,
      reportId: report.id 
    }, { status: 201 });

  } catch (error) {
    console.error('💥 Error creando reporte:', error);
    
    // TYPE GUARD SIMPLE: Fix para Vercel build (error.code safe)
    // Chequeamos si error tiene .code ANTES de usarlo
    let errorCode = 'UNKNOWN';
    if (error && typeof error === 'object' && 'code' in error) {
      errorCode = (error as any).code;
    }
    
    if (errorCode === 'P2002') {
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