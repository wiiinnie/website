// server/api/hermes.ts
export default defineEventHandler(async (event) => {
  try {
    // Используем $fetch для запроса к внешнему API на стороне сервера
    const data = await $fetch('https://nymesis.vercel.app/api/hermes');
    return data;
  } catch (error) {
    console.error('Ошибка при запросе к nymesis API:', error);
    // В случае ошибки отправляем соответствующий статус и сообщение
    throw createError({
      statusCode: 502, // Bad Gateway
      statusMessage: 'Не удалось получить данные от внешнего Hermes API.',
    });
  }
});
