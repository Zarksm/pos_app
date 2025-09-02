"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TransactionsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full shadow-none border-0">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">Tidak ada data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-none border-0 bg-sky-5000">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-md">
          <Table className="[&_tr]:border-0 [&_td]:border-0 [&_th]:border-0">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>NO</TableHead>
                <TableHead>No Pen</TableHead>
                <TableHead>Nama Kantor</TableHead>
                <TableHead>KCKCU</TableHead>
                <TableHead>REG</TableHead>
                <TableHead>Tipe Kantor</TableHead>
                <TableHead>TTrx Ritel</TableHead>
                <TableHead>TRev Ritel</TableHead>
                <TableHead>TBrt Ritel</TableHead>
                <TableHead>TTrx Loket</TableHead>
                <TableHead>TRev Loket</TableHead>
                <TableHead>TBrt Loket</TableHead>
                <TableHead>TTrx AgenPos</TableHead>
                <TableHead>TRev AgenPos</TableHead>
                <TableHead>TBrt AgenPos</TableHead>
                <TableHead>TTrx Oranger</TableHead>
                <TableHead>TRev Oranger</TableHead>
                <TableHead>TBrt Oranger</TableHead>
                <TableHead>TTrx Mplace</TableHead>
                <TableHead>TRev Mplace</TableHead>
                <TableHead>TBrt Mplace</TableHead>
                <TableHead>TTrx PosAja</TableHead>
                <TableHead>TRev PosAja</TableHead>
                <TableHead>TBrt PosAja</TableHead>
                <TableHead>TTrx LPU</TableHead>
                <TableHead>TRev LPU</TableHead>
                <TableHead>TBrt LPU</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.no} className="border-0">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.nopen}</TableCell>
                  <TableCell>{item.namaKantor}</TableCell>
                  <TableCell>{item.KCKCU}</TableCell>
                  <TableCell>{item.REG}</TableCell>
                  <TableCell>{item.tipeKantor}</TableCell>
                  <TableCell>{item.tTrxRitel}</TableCell>
                  <TableCell>{item.tRevRitel}</TableCell>
                  <TableCell>{item.tBrtRitel}</TableCell>
                  <TableCell>{item.tTrxLoket}</TableCell>
                  <TableCell>{item.tRevLoket}</TableCell>
                  <TableCell>{item.tBrtLoket}</TableCell>
                  <TableCell>{item.tTrxAgenPos}</TableCell>
                  <TableCell>{item.tRevAgenPos}</TableCell>
                  <TableCell>{item.tBrtAgenPos}</TableCell>
                  <TableCell>{item.tTrxOranger}</TableCell>
                  <TableCell>{item.tRevOranger}</TableCell>
                  <TableCell>{item.tBrtOranger}</TableCell>
                  <TableCell>{item.tTrxMplace}</TableCell>
                  <TableCell>{item.tRevMplace}</TableCell>
                  <TableCell>{item.tBrtMplace}</TableCell>
                  <TableCell>{item.tTrxPosAja}</TableCell>
                  <TableCell>{item.tRevPosAja}</TableCell>
                  <TableCell>{item.tBrtPosAja}</TableCell>
                  <TableCell>{item.tTrxLPU}</TableCell>
                  <TableCell>{item.tRevLPU}</TableCell>
                  <TableCell>{item.tBrtLPU}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
