import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMonthlyIncomeToProfiles1707429812345
 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'profiles',
      new TableColumn({
        name: 'monthly_income',
        type: 'decimal',
        precision: 12,
        scale: 2,
        isNullable: true,
        comment: 'Ingreso mensual del usuario en COP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('profiles', 'monthly_income');
  }
}