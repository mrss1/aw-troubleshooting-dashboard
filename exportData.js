// exportData.js

// Function to export all data by device type into separate tabs with improved formatting
function exportAllData() {
  // Initialize a new workbook
  const workbook = XLSX.utils.book_new();

  // Define colors corresponding to device types
  const deviceColors = {
    iOS: "4a90e2", // Light Blue
    Mac: "800080", // Purple
    Android: "008000", // Green
  };

  // Iterate over each device type
  for (const device in troubleshootingData) {
    // Prepare data for the current device
    let data = [];

    // Add Checklist Data Header with style
    data.push([
      {
        v: "Checklist Data",
        s: {
          font: { bold: true, sz: 14 },
          fill: { fgColor: { rgb: "D9EAD3" } },
        },
      },
    ]);
    data.push([
      {
        v: "Failure Point",
        s: { font: { bold: true }, fill: { fgColor: { rgb: "D9EAD3" } } },
      },
      {
        v: "Symptom",
        s: { font: { bold: true }, fill: { fgColor: { rgb: "D9EAD3" } } },
      },
      {
        v: "Cause",
        s: { font: { bold: true }, fill: { fgColor: { rgb: "D9EAD3" } } },
      },
      {
        v: "Corrective Steps",
        s: { font: { bold: true }, fill: { fgColor: { rgb: "D9EAD3" } } },
      },
      {
        v: "Notes",
        s: { font: { bold: true }, fill: { fgColor: { rgb: "D9EAD3" } } },
      },
    ]);

    // Populate Checklist Data for the current device
    for (const failurePoint in troubleshootingData[device]) {
      for (const symptom in troubleshootingData[device][failurePoint]) {
        const details = troubleshootingData[device][failurePoint][symptom];
        data.push([
          { v: failurePoint },
          { v: symptom },
          { v: details.Cause },
          { v: details.CorrectiveSteps },
          { v: details.Notes },
        ]);
      }
    }

    // Add a blank row to separate sections
    data.push([]);

    // Add How To Data Header with style
    data.push([
      {
        v: "How To's Data",
        s: {
          font: { bold: true, sz: 14 },
          fill: { fgColor: { rgb: "FFF2CC" } },
        },
      },
    ]);
    data.push([
      {
        v: "Category",
        s: { font: { bold: true }, fill: { fgColor: { rgb: "FFF2CC" } } },
      },
      {
        v: "Steps",
        s: { font: { bold: true }, fill: { fgColor: { rgb: "FFF2CC" } } },
      },
      {
        v: "Notes",
        s: { font: { bold: true }, fill: { fgColor: { rgb: "FFF2CC" } } },
      },
    ]);

    // Populate How To Data for the current device
    if (howToData[device]) {
      for (const category in howToData[device]) {
        const details = howToData[device][category];
        data.push([
          { v: category },
          { v: details.Steps },
          { v: details.Notes },
        ]);
      }
    }

    // Create a worksheet for the current device type
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Apply custom color to headers and cells
    const colorCode = deviceColors[device];
    for (const cell in worksheet) {
      if (cell[0] !== "!") {
        const currentCell = worksheet[cell];
        if (!currentCell.s) {
          currentCell.s = {};
        }

        // Apply background color to non-header rows for readability
        if (parseInt(cell.substring(1)) > 2) {
          // Skip header rows
          currentCell.s.fill = { fgColor: { rgb: colorCode } };
        }
      }
    }

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, device);
  }

  // Write the workbook to a file
  XLSX.writeFile(workbook, "airwatch_troubleshooting_data.xlsx");
}
