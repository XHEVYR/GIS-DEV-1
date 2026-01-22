import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET() {
  try {
    const places = await prisma.place.findMany();
    return NextResponse.json(places, {status: 200});
  } catch (error) {
    return NextResponse.json(
      {message: 'Error retrieving places', error: String(error)},
      {status: 500}
    );
  }
}