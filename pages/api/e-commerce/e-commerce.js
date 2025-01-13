import formidable from 'formidable';
import fs from 'fs';
 // Adjust based on your database connection
import db from '../../../lib/db';
export const config = {
  api: {
    bodyParser: false, // Important for file uploads
  },
};

const addProduct = async (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error parsing the files' });
      }

      const { productName, productPrice, productDescription, category, admin } = fields;
      const productImage = files.productImage;

      // Check if product exists
      const checkSql = "SELECT COUNT(*) FROM `product` WHERE `product_name` = ?";
      const [rows] = await db.query(checkSql, [productName]);
      if (rows[0]['COUNT(*)'] > 0) {
        return res.status(400).json({ success: false, message: 'Product already exists' });
      }

      // Handle image upload
      const imagePath = `uploads/${productImage.originalFilename}`;
      await fs.promises.rename(productImage.filepath, `public/${imagePath}`); // Move uploaded file to public directory

      // Insert product into database
      const sql = "INSERT INTO `product`(`product_name`, `product_price`, `product_description`, `category`, `admin`, `image_path`) VALUES (?, ?, ?, ?, ?, ?)";
      const result = await db.query(sql, [productName, productPrice, productDescription, category, admin, imagePath]);

      return res.status(200).json({ success: true, result: result.affectedRows });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default addProduct;
