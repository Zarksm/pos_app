import sys, csv
from openpyxl import Workbook
from openpyxl.utils import get_column_letter

csv_path = sys.argv[1]
output_path = "/tmp/output.xlsx"

wb = Workbook()

# --- Sheet 1: Data ---
ws_data = wb.active
ws_data.title = "Data"

# Load CSV ke sheet Data
with open(csv_path, newline="", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        ws_data.append(row)

# --- Sheet 2: Summary ---
ws_sum = wb.create_sheet("Summary")

# Cari kolom T. TRX RITEL & T. REV RITEL
headers = [cell.value for cell in ws_data[1]]
trx_col = headers.index("T. TRX RITEL") + 1
rev_col = headers.index("T. REV RITEL") + 1
last_row = ws_data.max_row

trx_range = f"{get_column_letter(trx_col)}2:{get_column_letter(trx_col)}{last_row}"
rev_range = f"{get_column_letter(rev_col)}2:{get_column_letter(rev_col)}{last_row}"

# Isi Summary
ws_sum["A1"] = "Metric"
ws_sum["B1"] = "Formula"
ws_sum["C1"] = "Result"

metrics = [
    ("Total TRX Ritel", f"=SUM({trx_range})"),
    ("Rata-rata TRX Ritel", f"=AVERAGE({trx_range})"),
    ("Max TRX Ritel", f"=MAX({trx_range})"),
    ("Min TRX Ritel", f"=MIN({trx_range})"),
    ("Total REV Ritel", f"=SUM({rev_range})"),
    ("Rata-rata REV Ritel", f"=AVERAGE({rev_range})"),
    ("Max REV Ritel", f"=MAX({rev_range})"),
    ("Min REV Ritel", f"=MIN({rev_range})"),
]

row = 2
for name, formula in metrics:
    ws_sum[f"A{row}"] = name
    ws_sum[f"B{row}"] = formula
    ws_sum[f"C{row}"] = formula  # Excel will evaluate
    row += 1

# Simpan file
wb.save(output_path)
