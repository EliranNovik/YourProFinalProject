import pool from '../db/config';

export interface ProjectInput {
  companyId: string;
  title: string;
  description: string;
  budgetMin?: number;
  budgetMax?: number;
  skills?: string[];
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
}

interface SkillRow {
  skill: string;
}

interface ProjectRow {
  id: string;
  company_id: string;
  title: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  company_name: string;
  company_logo: string | null;
}

export const createProject = async (data: ProjectInput) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create project
    const projectResult = await client.query(
      `INSERT INTO projects 
       (company_id, title, description, budget_min, budget_max, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        data.companyId,
        data.title,
        data.description,
        data.budgetMin || null,
        data.budgetMax || null,
        data.status || 'open'
      ]
    );
    
    const projectId = projectResult.rows[0].id;
    
    // Add skills
    if (data.skills && data.skills.length > 0) {
      const skillValues = data.skills.map(skill => 
        `(${projectId}, '${skill.replace(/'/g, "''")}')`
      ).join(',');
      
      await client.query(
        `INSERT INTO project_skills (project_id, skill) VALUES ${skillValues}`
      );
    }
    
    await client.query('COMMIT');
    
    return { id: projectId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getProjectById = async (id: string) => {
  const client = await pool.connect();
  
  try {
    // Get project basic info
    const projectResult = await client.query(
      `SELECT p.*, c.company_name, c.logo as company_logo
       FROM projects p
       JOIN companies c ON p.company_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (projectResult.rows.length === 0) {
      return null;
    }
    
    const project = projectResult.rows[0];
    
    // Get skills
    const skillsResult = await client.query<SkillRow>(
      'SELECT skill FROM project_skills WHERE project_id = $1',
      [id]
    );
    
    return {
      ...project,
      skills: skillsResult.rows.map((row: SkillRow) => row.skill)
    };
  } finally {
    client.release();
  }
};

export const updateProject = async (id: string, data: Partial<ProjectInput>) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const updateFields: string[] = [];
    const values: (string | number | null)[] = [];
    let valueIndex = 1;
    
    const fields = [
      'title', 'description', 'budget_min', 'budget_max', 'status'
    ] as const;
    
    fields.forEach(field => {
      const camelField = field.replace(/_([a-z])/g, g => g[1].toUpperCase());
      if (data[camelField as keyof ProjectInput] !== undefined) {
        updateFields.push(`${field} = $${valueIndex}`);
        values.push(data[camelField as keyof ProjectInput] as string | number | null);
        valueIndex++;
      }
    });
    
    if (updateFields.length > 0) {
      values.push(id);
      await client.query(
        `UPDATE projects 
         SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${valueIndex}`,
        values
      );
    }
    
    // Update skills if provided
    if (data.skills) {
      await client.query(
        'DELETE FROM project_skills WHERE project_id = $1',
        [id]
      );
      
      if (data.skills.length > 0) {
        const skillValues = data.skills.map(skill => 
          `(${id}, '${skill.replace(/'/g, "''")}')`
        ).join(',');
        
        await client.query(
          `INSERT INTO project_skills (project_id, skill) VALUES ${skillValues}`
        );
      }
    }
    
    await client.query('COMMIT');
    
    return await getProjectById(id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const listProjects = async (filters?: {
  companyId?: string;
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
  skill?: string;
}) => {
  const client = await pool.connect();
  
  try {
    let query = `
      SELECT DISTINCT p.*, c.company_name, c.logo as company_logo
      FROM projects p
      JOIN companies c ON p.company_id = c.id
    `;
    
    const conditions: string[] = [];
    const values: (string)[] = [];
    let valueIndex = 1;
    
    if (filters?.companyId) {
      conditions.push(`p.company_id = $${valueIndex}`);
      values.push(filters.companyId);
      valueIndex++;
    }
    
    if (filters?.status) {
      conditions.push(`p.status = $${valueIndex}`);
      values.push(filters.status);
      valueIndex++;
    }
    
    if (filters?.skill) {
      query += ' JOIN project_skills ps ON p.id = ps.project_id';
      conditions.push(`ps.skill = $${valueIndex}`);
      values.push(filters.skill);
      valueIndex++;
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    const result = await client.query<ProjectRow>(query, values);
    
    // Get skills for each project
    const projects = await Promise.all(
      result.rows.map(async (project: ProjectRow) => {
        const skillsResult = await client.query<SkillRow>(
          'SELECT skill FROM project_skills WHERE project_id = $1',
          [project.id]
        );
        
        return {
          ...project,
          skills: skillsResult.rows.map((row: SkillRow) => row.skill)
        };
      })
    );
    
    return projects;
  } finally {
    client.release();
  }
}; 