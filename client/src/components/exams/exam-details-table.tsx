import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExamDetail } from '@shared/schema';
import { Badge } from '@/components/ui/badge';

interface ExamDetailsTableProps {
  details: ExamDetail[];
}

const ExamDetailsTable: React.FC<ExamDetailsTableProps> = ({ details }) => {
  const { t } = useTranslation();

  // Agrupar detalhes por categoria
  const groupedDetails = details.reduce((acc, detail) => {
    if (!acc[detail.category]) {
      acc[detail.category] = [];
    }
    acc[detail.category].push(detail);
    return acc;
  }, {} as Record<string, ExamDetail[]>);

  if (details.length === 0) {
    return (
      <div className="text-center py-8">
        <p>{t('exams.noDetailsAvailable')}</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedDetails).map(([category, categoryDetails]) => (
        <div key={category} className="rounded-lg border shadow">
          <div className="px-4 py-3 bg-muted rounded-t-lg border-b">
            <h3 className="text-lg font-semibold">{category}</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('exams.parameterName')}</TableHead>
                <TableHead>{t('exams.value')}</TableHead>
                <TableHead>{t('exams.reference')}</TableHead>
                <TableHead>{t('exams.status')}</TableHead>
                <TableHead>{t('exams.observations')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryDetails.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell className="font-medium">{detail.name}</TableCell>
                  <TableCell>
                    {detail.value} {detail.unit}
                  </TableCell>
                  <TableCell>{detail.referenceRange || t('common.notAvailable')}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(detail.status || 'normal')}>
                      {t(`exams.status.${(detail.status || 'normal').toLowerCase()}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{detail.observation || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default ExamDetailsTable;