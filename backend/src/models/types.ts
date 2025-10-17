export interface User {
  id: number;
  email: string;
  password_hash?: string;
  name?: string;
  created_at?: Date;
}

export interface Resume {
  id: number;
  user_id: number;
  title: string;
  content: any;
  template?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Achievement {
  id: number;
  user_id: number;
  type: string;
  title: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  verified: boolean;
}

export interface Skill {
  id: number;
  user_id: number;
  name: string;
  category?: string;
  proficiency?: string;
}
