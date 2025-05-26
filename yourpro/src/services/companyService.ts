import pool from '../db/config';
import { hashPassword } from '../utils/auth';

export interface CompanyInput {
  companyName: string;
  email: string;
  password: string;
  industry?: string;
  companySize?: string;
  description?: string;
  location?: string;
  website?: string;
  logo?: string;
  [key: string]: string | undefined;
}

export const createCompany = async (data: CompanyInput) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create user first
    const passwordHash = await hashPassword(data.password);
    const userResult = await client.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [data.email, passwordHash]
    );
    
    const userId = userResult.rows[0].id;
    
    // Create company profile
    const companyResult = await client.query(
      `INSERT INTO companies 
       (user_id, company_name, industry, company_size, description, location, website, logo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        userId,
        data.companyName,
        data.industry || null,
        data.companySize || null,
        data.description || null,
        data.location || null,
        data.website || null,
        data.logo || null
      ]
    );
    
    await client.query('COMMIT');
    
    return { id: companyResult.rows[0].id };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getCompanyById = async (id: string) => {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT c.*, u.email 
       FROM companies c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } finally {
    client.release();
  }
};

export const updateCompany = async (id: string, data: Partial<CompanyInput>) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const updateFields: string[] = [];
    const values: (string | null)[] = [];
    let valueIndex = 1;
    
    const fields = [
      'company_name', 'industry', 'company_size', 'description',
      'location', 'website', 'logo'
    ] as const;
    
    fields.forEach(field => {
      const camelField = field.replace(/_([a-z])/g, g => g[1].toUpperCase());
      if (data[camelField] !== undefined) {
        updateFields.push(`${field} = $${valueIndex}`);
        values.push(data[camelField] as string | null);
        valueIndex++;
      }
    });
    
    if (updateFields.length > 0) {
      values.push(id);
      await client.query(
        `UPDATE companies 
         SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${valueIndex}`,
        values
      );
    }
    
    await client.query('COMMIT');
    
    return await getCompanyById(id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}; 