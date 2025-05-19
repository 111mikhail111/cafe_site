import pool from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const {
      query: { tableId },
    } = req;
  
    const { cafe_id: cafeId, date } = req.query;
  
    try {
      if (!tableId || !cafeId || !date) {
        return res.status(400).json({ message: "Missing required query parameters" });
      }
  
      const result = await pool.query(
        `SELECT reservation_time FROM get_booked_slots($1, $2, $3)`,
        [tableId, cafeId, date]
      );
  
      const bookedSlots = result.rows.map(row => row.reservation_time);
      return res.status(200).json({ bookedSlots });
    } catch (error) {
      console.error("Ошибка в booked-slots:", error); // <--- Важная строка
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  