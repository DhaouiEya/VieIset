export interface Event {
  id?: number;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  capacity?: number;
  attendeesCount?: number;
  createdBy?: string;
}
