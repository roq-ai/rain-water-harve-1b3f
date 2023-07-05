import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface CalculatorInterface {
  id?: string;
  parameters: string;
  results: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface CalculatorGetQueryInterface extends GetQueryInterface {
  id?: string;
  parameters?: string;
  results?: string;
  organization_id?: string;
}
