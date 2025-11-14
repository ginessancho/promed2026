import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Field {
  odoo: string;
  naf: string;
  description: string;
  rule?: string;
}

interface Props {
  title: string;
  fields: Field[];
}

export default function CriticalFieldsTable({ title, fields }: Props) {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold mb-3">{title}</h4>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Campo en Odoo</TableHead>
              <TableHead className="w-1/4">Campo en NAF</TableHead>
              <TableHead className="w-1/2">Descripción y Reglas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-xs">{field.odoo}</TableCell>
                <TableCell className="font-mono text-xs">{field.naf}</TableCell>
                <TableCell>
                  <p className="text-xs">{field.description}</p>
                  {field.rule && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1"><strong>Regla:</strong> {field.rule}</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
