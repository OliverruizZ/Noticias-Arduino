export default async function handler(req, res) {
  try {
    // Feed RSS de Google News adaptado para Guatemala
    const rssUrl = "https://news.google.com/rss?hl=es-419&gl=GT&ceid=GT:es-419";
    const response = await fetch(rssUrl);
    const text = await response.text();

    // Extraer el primer título (<title>) del XML
    const match = text.match(/<title>(.*?)<\/title>/);
    let titular = match ? match[1] : "Sin noticias";

    // Limpiar etiquetas de CDATA
    titular = titular.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();

    // Evitar que muestre el título general del canal si es el primero
    if (titular.includes("Google Noticias")) {
      const matches = [...text.matchAll(/<title>(.*?)<\/title>/g)];
      if (matches.length > 1) {
        titular = matches[1][1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
      }
    }

    // Devolver texto plano para el Arduino
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(titular);
  } catch (error) {
    res.status(500).send("Error al obtener noticias");
  }
}
