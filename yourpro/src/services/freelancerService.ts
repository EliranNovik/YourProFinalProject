import pool from '../db/config';
import { hashPassword } from '../utils/auth';

export interface FreelancerInput {
  name: string;
  email: string;
  password: string;
  title?: string;
  skills?: string[];
  languages?: string[];
  education?: string;
  location?: string;
  description?: string;
  aboutMe?: string;
  hourlyRate?: number;
  packageRate?: number;
  profileImage?: string;
  [key: string]: string | number | string[] | undefined;
}

interface SkillRow {
  skill: string;
}

interface LanguageRow {
  language: string;
}

interface ImageRow {
  image_url: string;
}

export const createFreelancer = async (data: FreelancerInput) => {
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
    
    // Create freelancer profile
    const freelancerResult = await client.query(
      `INSERT INTO freelancers 
       (user_id, name, title, location, education, description, about_me, hourly_rate, package_rate, profile_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        userId,
        data.name,
        data.title || null,
        data.location || null,
        data.education || null,
        data.description || null,
        data.aboutMe || null,
        data.hourlyRate || null,
        data.packageRate || null,
        data.profileImage || null
      ]
    );
    
    const freelancerId = freelancerResult.rows[0].id;
    
    // Add skills
    if (data.skills && data.skills.length > 0) {
      const skillValues = data.skills.map(skill => 
        `(${freelancerId}, '${skill.replace(/'/g, "''")}')`
      ).join(',');
      
      await client.query(
        `INSERT INTO freelancer_skills (freelancer_id, skill) VALUES ${skillValues}`
      );
    }
    
    // Add languages
    if (data.languages && data.languages.length > 0) {
      const languageValues = data.languages.map(language => 
        `(${freelancerId}, '${language.replace(/'/g, "''")}')`
      ).join(',');
      
      await client.query(
        `INSERT INTO freelancer_languages (freelancer_id, language) VALUES ${languageValues}`
      );
    }
    
    await client.query('COMMIT');
    
    return { id: freelancerId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getFreelancerById = async (id: string) => {
  const client = await pool.connect();
  
  try {
    // Get freelancer basic info
    const freelancerResult = await client.query(
      `SELECT f.*, u.email 
       FROM freelancers f
       JOIN users u ON f.user_id = u.id
       WHERE f.id = $1`,
      [id]
    );
    
    if (freelancerResult.rows.length === 0) {
      return null;
    }
    
    const freelancer = freelancerResult.rows[0];
    
    // Get skills
    const skillsResult = await client.query<SkillRow>(
      'SELECT skill FROM freelancer_skills WHERE freelancer_id = $1',
      [id]
    );
    
    // Get languages
    const languagesResult = await client.query<LanguageRow>(
      'SELECT language FROM freelancer_languages WHERE freelancer_id = $1',
      [id]
    );
    
    // Get portfolio images
    const imagesResult = await client.query<ImageRow>(
      'SELECT image_url FROM portfolio_images WHERE freelancer_id = $1',
      [id]
    );
    
    return {
      ...freelancer,
      skills: skillsResult.rows.map((row: SkillRow) => row.skill),
      languages: languagesResult.rows.map((row: LanguageRow) => row.language),
      portfolioImages: imagesResult.rows.map((row: ImageRow) => row.image_url)
    };
  } finally {
    client.release();
  }
};

export const updateFreelancer = async (id: string, data: Partial<FreelancerInput>) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Update freelancer basic info
    const updateFields: string[] = [];
    const values: (string | number | null)[] = [];
    let valueIndex = 1;
    
    const fields = [
      'name', 'title', 'location', 'education', 'description',
      'about_me', 'hourly_rate', 'package_rate', 'profile_image'
    ] as const;
    
    fields.forEach(field => {
      if (data[field] !== undefined) {
        updateFields.push(`${field.includes('_') ? field : field} = $${valueIndex}`);
        values.push(data[field] as string | number | null);
        valueIndex++;
      }
    });
    
    if (updateFields.length > 0) {
      values.push(id);
      await client.query(
        `UPDATE freelancers 
         SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${valueIndex}`,
        values
      );
    }
    
    // Update skills if provided
    if (data.skills) {
      await client.query(
        'DELETE FROM freelancer_skills WHERE freelancer_id = $1',
        [id]
      );
      
      if (data.skills.length > 0) {
        const skillValues = data.skills.map(skill => 
          `(${id}, '${skill.replace(/'/g, "''")}')`
        ).join(',');
        
        await client.query(
          `INSERT INTO freelancer_skills (freelancer_id, skill) VALUES ${skillValues}`
        );
      }
    }
    
    // Update languages if provided
    if (data.languages) {
      await client.query(
        'DELETE FROM freelancer_languages WHERE freelancer_id = $1',
        [id]
      );
      
      if (data.languages.length > 0) {
        const languageValues = data.languages.map(language => 
          `(${id}, '${language.replace(/'/g, "''")}')`
        ).join(',');
        
        await client.query(
          `INSERT INTO freelancer_languages (freelancer_id, language) VALUES ${languageValues}`
        );
      }
    }
    
    await client.query('COMMIT');
    
    return await getFreelancerById(id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}; 