import pool from "@/lib/db";

export default async function handler(req, res) {
    const { prodId } = req.query;

    if (!prodId) {
        return res.status(400).json({ message: 'Не указан prodId' });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM get_product_by_id($1)', [prodId]);

        console.log(rows.length);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }

        const product = rows[0];
        const result = {
            id: product.id,
            name: product.name,
            price: product.price,
            shelf: product.shelf,
            weight: product.weight,
            description: product.description,
            recipe: product.recipe,
            kind: product.kind,
            ingredients: product.ingredients || [],
            image: null
        };

        console.log(result.name);

        // Конвертируем изображение в base64, если оно есть
        if (product.image) {
            result.image = `data:image/jpeg;base64,${Buffer.from(product.image).toString('base64')}`;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ 
            message: 'Ошибка при получении данных',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}