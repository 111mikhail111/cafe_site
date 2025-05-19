import pool from "@/lib/db";

export default async function handler(req, res) {
    const orderResult2 = await pool.query(
      'SELECT status_id FROM orders ORDER BY id DESC LIMIT 1'
    );
    console.log("После продуктов");
    console.log(orderResult2.rows[0]?.status_id);
}