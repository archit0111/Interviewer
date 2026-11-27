export interface ISkill {
  _id: string;
  slug: string;
  label: string;
  icon: string;
  group: string;
  order: number;
  description?: string;
  createdAt?: string | Date; 
  updatedAt?: string | Date;
}