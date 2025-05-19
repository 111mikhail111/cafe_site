import pool from "@/lib/db";

export default async function handler(req, res) {
  const {
    query: { clientId },
    method,
  } = req;

  if (method !== "GET") {
    return res.status(405).json({ message: "Метод не разрешен" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM get_orders_from_client($1)",
      [clientId]
    );

    res.status(200).json({
      success: true,
      orders: rows,
    });
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при получении заказов",
      error: error.message,
    });
  }
}
