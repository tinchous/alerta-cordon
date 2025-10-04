import { TwitterApi } from 'twitter-api-v2';

export interface XPostInput {
  id: number;
  location: string;
  description: string;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  robo: 'Robo/Atraco',
  narcos: 'Venta de drogas',
  sospechoso: 'Actividad sospechosa',
  cuidacoches: 'Cuidacoches agresivos',
  cajero: 'Problemas en cajero/banco',
  abitab: 'Vigilancia Abitab/Brooker',
  calle: 'Ocupación de vereda/calle',
  otro: 'Otro',
};

function buildStatus({ id, location, description, category }: XPostInput) {
  const label = CATEGORY_LABELS[category] || 'Alerta';
  const base = `🚨 ALERTA CORDÓN #${id}: ${location} (${label}) - `;
  const suffix = ' #AlertaCordon';
  const remaining = 280 - base.length - suffix.length;
  const truncatedDescription = description.length > remaining
    ? `${description.slice(0, Math.max(remaining - 3, 0)).trim()}...`
    : description;

  return `${base}${truncatedDescription}${suffix}`;
}

export async function postAlertToX(input: XPostInput) {
  const appKey = process.env.X_APP_KEY;
  const appSecret = process.env.X_APP_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_SECRET;

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    console.warn('⚠️ X API credentials missing. Skipping automatic post.');
    return;
  }

  try {
    const client = new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    });

    const status = buildStatus(input);
    await client.v2.tweet(status);
    console.log('✅ Reporte publicado en X:', status);
  } catch (error) {
    console.error('💥 Error publicando en X:', error);
  }
}
