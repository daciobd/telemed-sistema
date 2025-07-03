export interface IStorage {
  getUserWithProfile(id: string): Promise<any>;
  upsertUser(user: any): Promise<any>;
}

export class MemStorage implements IStorage {
  async getUserWithProfile(id: string) {
    return { id, role: 'doctor', email: 'demo@telemed.com' };
  }
  
  async upsertUser(user: any) {
    return user;
  }
}

export const storage = new MemStorage();
