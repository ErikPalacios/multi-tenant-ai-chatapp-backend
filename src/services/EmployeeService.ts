import { FirebaseService } from '../integrations/firebase/firebase.service.js';
import { Employee, EmployeeActivity } from '../interfaces/index.js';

export class EmployeeService {
    static async getEmployee(businessId: string, employeeId: string): Promise<Employee | null> {
        return FirebaseService.getEmployee(businessId, employeeId);
    }

    static async listEmployees(businessId: string): Promise<Employee[]> {
        return FirebaseService.listEmployees(businessId);
    }

    static async saveEmployee(businessId: string, employee: Employee): Promise<void> {
        // Business isolation check
        if (employee.businessId !== businessId) {
            throw new Error('Business ID mismatch');
        }
        return FirebaseService.saveEmployee(businessId, employee);
    }

    static async toggleEmployeeStatus(businessId: string, employeeId: string): Promise<void> {
        const employee = await this.getEmployee(businessId, employeeId);
        if (!employee) throw new Error('Employee not found');

        employee.isActive = !employee.isActive;
        await this.saveEmployee(businessId, employee);
    }
}
