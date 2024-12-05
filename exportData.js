function exportAllData() {
  // Create a new workbook
  let wb = XLSX.utils.book_new();

  // Iterate over the troubleshootingData and howToData objects
  for (let deviceType in troubleshootingData) {
    // Create data arrays for each device type
    let data = [];

    // Section 1: Troubleshooting Checklist
    data.push(["Troubleshooting Checklist for " + deviceType]);
    data.push([
      "Rating",
      "Failure Point",
      "Symptom",
      "Cause",
      "Corrective Steps",
      "Notes",
      "KB Article",
    ]);

    // Iterate over each failure point and symptom for the given device type
    for (let failurePoint in troubleshootingData[deviceType]) {
      for (let symptom in troubleshootingData[deviceType][failurePoint]) {
        let details = troubleshootingData[deviceType][failurePoint][symptom];
        data.push([
          "", // Leave Rating empty for now, or you can provide a default value
          failurePoint,
          symptom,
          details.Cause,
          details.CorrectiveSteps,
          details.Notes,
          "", // KB Article column left empty
        ]);
      }
    }

    // Add a blank row to separate sections
    data.push([]);

    // Section 2: How To's Data
    data.push(["How To's Data"]);
    data.push(["Category", "Steps", "Notes"]);

    // Iterate over the How To data for the given device type
    if (howToData[deviceType]) {
      for (let category in howToData[deviceType]) {
        let howToDetails = howToData[deviceType][category];
        data.push([category, howToDetails.Steps, howToDetails.Notes]);
      }
    }

    // Create a worksheet from the data array
    let ws = XLSX.utils.aoa_to_sheet(data);

    // Style headers: Make the first row of each section bold and add a border
    for (let R = 0; R < data.length; R++) {
      if (
        R === 1 ||
        R === data.findIndex((row) => row.includes("How To's Data")) + 1
      ) {
        // Apply bold style and border to each section header
        for (let C = 0; C < data[R].length; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellAddress]) continue;

          ws[cellAddress].s = {
            font: {
              bold: true,
            },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }
      }
    }

    // Add worksheet to workbook with device type as sheet name
    XLSX.utils.book_append_sheet(wb, ws, deviceType);
  }

  // Write the workbook to a file
  XLSX.writeFile(wb, "AirWatch_Troubleshooting.xlsx");
}
