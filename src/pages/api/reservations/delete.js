import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { reservationId } = req.query;

  // Валидация данных
  if (!reservationId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Проверяем существование бронирования
    const existing = await pool.query(
      `SELECT id FROM reservations WHERE id = $1`,
      [reservationId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Проверяем, не было ли бронирование уже отменено
    const cancellationCheck = await pool.query(
      `SELECT cancelled FROM reservations WHERE id = $1`,
      [reservationId]
    );

    if (cancellationCheck.rows[0].cancelled) {
      return res.status(409).json({
        success: false,
        message: "Reservation has already been cancelled",
      });
    }

    // Отменяем бронирование
    const result = await pool.query(
      `UPDATE reservations 
       SET cancelled = TRUE, cancelled_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING id`,
      [reservationId]
    );

    res.status(200).json({
      success: true,
      reservationId: result.rows[0].id,
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling reservation",
      error: error.message,
    });
  }
}
