import * as XLSX from "xlsx";
import fs from "fs";

export async function generateExcel(rawData: any, filePath: string) {
  try {
    // Ensure rawData is always an array
    const data = Array.isArray(rawData) ? rawData : [rawData];

    // If array contains objects, convert properly
    const cleanData = data.map((item) => JSON.parse(JSON.stringify(item)));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(cleanData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // Write file
    XLSX.writeFile(workbook, filePath);

    console.log("Excel generated:", filePath);
    return true;

  } catch (err) {
    console.error("Excel Generation Error:", err);
    throw err;
  }
}
