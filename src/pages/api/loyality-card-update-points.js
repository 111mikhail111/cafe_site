import pool from '@/lib/db';

export default async function handler(req, res) {
  const { clientId, points, ifget } = req.query;

  if (req.method === "GET") {
    try {
      if (ifget == "false")
        await pool.query(
          "update loyalty_cards set points = points - $1 WHERE client_id = $2",
          [points, clientId]
        );
      else
        await pool.query(
          "update loyalty_cards set points = points + $1 WHERE client_id = $2",
          [points, clientId]
        );

      res.status(200).json(
        "Баллы успешно обновлены",
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
